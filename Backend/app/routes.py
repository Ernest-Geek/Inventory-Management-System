from flask import jsonify, Blueprint, request, abort, flash, url_for
from flask_login import login_required, login_user, logout_user, current_user
from flask_mail import Message
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import URLSafeTimedSerializer, SignatureExpired
from app.models import db, User, Role, Product, Sale
from app import mail, bcrypt
from sqlalchemy import text
from app.utils import verify_reset_token, send_reset_password_email, generate_reset_token
from flask_bcrypt import Bcrypt
from sqlalchemy import and_
from sqlalchemy.exc import IntegrityError
from app.decorators import permission_required

import re

bcrypt = Bcrypt() 

bp = Blueprint('main', __name__)

# URL serializer for password reset
s = URLSafeTimedSerializer('Thisisasecret!')


#Route to test if the backend is working
@bp.route('/api/test_db')
def test_db():
    try:
        # Use text() to explicitly declare the SQL expression
        result = db.session.execute(text('SELECT 1'))
        return 'Database connection successful!'
    except Exception as e:
        return f'Error connecting to database: {str(e)}'

@bp.route("/api/register", methods=['POST'])
def register():
    data = request.json
    print(f"Received data: {data}")  # Debugging line
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({"message": "Missing required fields"}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"message": "User already exists"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User(username=username, email=email, password_hash=hashed_password, role_id=2)

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

@bp.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if user and bcrypt.check_password_hash(user.password_hash, password):
        login_user(user)
        return jsonify({"message": "Logged in successfully"}), 200
    else:
        return jsonify({"message": "Invalid email or password"}), 401

    
@bp.route("/api/logout", methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully"}), 200

@bp.route("/api/forgot_password", methods=["POST"])
def forgot_password():
    data = request.json
    email = data.get('email')

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "User with this email does not exist"}), 404

    token = s.dumps(email, salt='password-reset-salt') 

    msg = Message('Password Reset Request', sender='ernestampene1@gmail.com', recipients=[email])
    link = url_for('main.reset_password', token=token, _external=True)
    msg.body = f'Your link to reset the password is {link}. This link will expire in 30 minutes.'
    mail.send(msg)

    return jsonify({"message": "Password reset email sent successfully"}), 200



@bp.route("/api/reset_password/<token>", methods=['POST'])
def reset_password(token):
    try:
        email = verify_reset_token(token, expiration=1800)
        if not email:
            return jsonify({"message": "Invalid or expired token"}), 400
    except Exception as e:
        return jsonify({"message": "Error verifying token"}), 400

    data = request.json
    new_password = data.get('password')

    if not new_password:
        return jsonify({"message": "Password is required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "User not found"}), 404

    user.password_hash = bcrypt.generate_password_hash(new_password).decode('utf-8')
    db.session.commit()

    # Send confirmation email
    # send_reset_password_email(user.email, token)

    return jsonify({"message": "Password has been reset successfully"}), 200

@bp.route("/api/request_password_reset", methods=['POST'])
def request_password_reset():
    data = request.json
    email = data.get('email')
    
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "User not found"}), 404

    token = generate_reset_token(email)
    send_reset_password_email(email, token)

    return jsonify({"message": "Password reset email sent"}), 200


@bp.route('/api/add_product', methods=['POST'])
def add_product():
    try:
        data = request.get_json()
        name = data.get('name')
        description = data.get('description')
        price = data.get('price')
        stock = data.get('stock')

        if not name or not price or not stock:
            return jsonify({'message': 'Name, price, stock are required'}), 400

        new_product = Product(name=name, description=description, price=price, stock=stock)
        db.session.add(new_product)
        db.session.commit()

        return jsonify({'message': 'Product added successfully'}), 201

    except Exception as e:
        print(f"Error adding product: {e}")
        return jsonify({'message': 'Failed to add product', 'error': str(e)}), 500
    
@bp.route('/api/products', methods=['GET'])
def get_products():
    try:
        products = Product.query.all()
        products_list = [{'id': p.id, 'name': p.name, 'description': p.description, 'price': p.price, 'stock': p.stock} for p in products]
        return jsonify(products_list), 200
    except Exception as e:
        print(f"Error fetching products: {e}")
        return jsonify({'message': 'Failed to fetch products', 'error': str(e)}), 500


@bp.route('/api/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    try:
        # Retrieve the product
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'message': 'Product not found'}), 404

        # Check if there are any sales associated with the product
        if Sale.query.filter_by(product_id=product_id).count() > 0:
            return jsonify({'message': 'Product cannot be deleted as it is referenced in sales'}), 400

        # Delete the product
        db.session.delete(product)
        db.session.commit()

        return jsonify({'message': 'Product deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting product: {e}")
        return jsonify({'message': 'Failed to delete product', 'error': str(e)}), 500

    
@bp.route('/api/products/<int:product_id>/update_stock', methods=['PUT'])
def update_stock(product_id):
    product = Product.query.get(product_id)
    
    if not product:
        return jsonify({'message': 'Product not found'}), 404

    data = request.get_json()
    stock = data.get('stock')

    if stock is None:
        return jsonify({'message': 'Stock level is required'}), 400

    if not isinstance(stock, int) or stock < 0:
        return jsonify({'message': 'Stock must be a non-negative integer'}), 400

    try:
        product.stock = stock
        db.session.commit()
        return jsonify({'message': 'Stock updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to update stock', 'error': str(e)}), 500
    
@bp.route('/api/sales', methods=['POST'])
def add_sale():
    data = request.get_json()
    product_id = data.get('product_id')
    quantity = data.get('quantity')
    total_price = data.get('total_price')
    sale_date = data.get('sale_date')

    if not all([product_id, quantity, total_price, sale_date]):
        return jsonify({'message': 'Missing data'}), 400

    product = Product.query.get(product_id)
    if not product:
        return jsonify({'message': 'Product not found'}), 404

    try:
        sale = Sale(
            product_id=product_id,
            quantity=quantity,
            total_price=total_price,
            sale_date=sale_date
        )
        db.session.add(sale)
        db.session.commit()
        return jsonify({'message': 'Sale added successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to add sale', 'error': str(e)}), 500
    
@bp.route('/api/sales', methods=['GET'])
def get_sales():
    try:
        # Query to join Sales with Products to get product names
        sales = db.session.query(Sale, Product.name).join(Product).all()
        
        # Format the data
        sales_data = [
            {
                'id': sale.id,
                'sale_date': sale.sale_date.isoformat(),
                'product_name': product_name,
                'total_price': sale.total_price
            }
            for sale, product_name in sales
        ]
        
        return jsonify(sales_data)
    except Exception as e:
        return jsonify({'message': 'Failed to fetch sales data', 'error': str(e)}), 500

@bp.route('/api/reports/generate', methods=['GET'])
def generate_report():
    report_type = request.args.get('report_type', 'summary')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    if not start_date or not end_date:
        return jsonify({'message': 'Start date and end date are required'}), 400

    sales_query = db.session.query(Sale, Product.name).join(Product).filter(
        and_(Sale.sale_date >= start_date, Sale.sale_date <= end_date)
    ).all()

    sales_data = [
        {
            'id': sale.id,
            'date': sale.sale_date.isoformat(),
            'product_name': product_name,
            'total_price': sale.total_price,
            'quantity': sale.quantity,
            'details': f"{sale.quantity} {product_name}(s) purchased"
        }
        for sale, product_name in sales_query
    ]

    if report_type == 'summary':
        report_data = [
            {
                'date': sale['date'],
                'product_name': sale['product_name'],
                'total_price': sale['total_price']
            }
            for sale in sales_data
        ]
    else:
        report_data = sales_data
    
    return jsonify(report_data)







