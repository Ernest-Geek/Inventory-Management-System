from flask import jsonify, Blueprint, request, abort, flash, url_for
from flask_login import login_required, login_user, logout_user, current_user
from flask_mail import Message
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import URLSafeTimedSerializer, SignatureExpired
from app.models import db, User, Role
from app import mail, bcrypt
from app.models import db, User, Role, Product, Sale
from app.email_utils import send_reset_email

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  

auth_bp = Blueprint('auth', __name__)
bp = Blueprint('routes', __name__)

cors = CORS(bp, resources={r"/api/*": {"origins": "*"}})

#URL serializer for password reset
s = URLSafeTimedSerializer('Thisisasecret!')

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
    email = request.json.get('email')
    if not email:
        return jsonify({'message': 'Email is required'}), 400

    # Generate the reset link (implement your token generation logic here)
    reset_link = f"http://localhost:3000/reset_password?email={email}&token=unique_token"
    
    # Call the function to send the email
    if send_reset_email(email, reset_link):
        return jsonify({'message': 'A reset link has been sent to your email address.'}), 200
    else:
        return jsonify({'message': 'Failed to send reset link. Please try again later.'}), 500


@bp.route("/api/reset_password/<token>", methods=['POST'])
def reset_password(token):
    try:
        email = s.loads(token, salt='password-reset-salt', max_age=1800)  # Ensure this salt name matches
    except SignatureExpired:
        return jsonify({"message": "The token has expired"}), 400
    except Exception as e:
        return jsonify({"message": "Invalid or tampered token"}), 400
    
    data = request.json
    new_password = data.get('password')

    if not new_password:
        return jsonify({"message": "Password is required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    user.password_hash = bcrypt.generate_password_hash(new_password).decode('utf-8')
    db.session.commit()

    return jsonify({"message": "Password has been reset successfully"}), 200

@bp.route("/api/user_roles", methods=['POST'])
@login_required
def user_roles():
    if current_user.role.name != 'Admin':
        abort(403)  # Forbidden

    data = request.json
    user_id = data.get('user_id')
    new_role = data.get('role')

    if not user_id or not new_role:
        return jsonify({"message": "Missing required fields"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    role = Role.query.filter_by(name=new_role).first()
    if not role:
        return jsonify({"message": "Role not found"}), 404

    user.role_id = role.id
    db.session.commit()

    return jsonify({"message": "User role updated successfully"}), 200

@app.route('/api/add_product', methods=['POST'])
def add_product():
    data = request.json
    name = data.get('name')
    description = data.get('description')
    stock = data.get('stock')
    price = data.get('price')
    category = data.get('category')

    if not all([name, stock, price]):
        return jsonify({"message": "Missing required fields"}), 400

    try:
        stock = int(stock)
        price = float(price)
    except ValueError:
        return jsonify({"message": "Invalid number format"}), 400

    product = Product(name=name, description=description, stock=stock, price=price, category=category)
    db.session.add(product)
    db.session.commit()

    return jsonify({"message": "Product added successfully"}), 201

if __name__ == '__main__':
    app.run(debug=True)

@bp.route("/api/update_stock", methods=['POST'])
@login_required
def update_stock():
    if current_user.role.name not in ['Manager', 'Admin']:
        abort(403)  # Forbidden

    data = request.json
    product_id = data.get('product_id')
    quantity = data.get('quantity')

    if not product_id or quantity is None:
        return jsonify({"message": "Missing required fields"}), 400

    product = Product.query.get(product_id)
    if not product:
        return jsonify({"message": "Product not found"}), 404

    product.stock = quantity
    db.session.commit()

    return jsonify({"message": "Stock updated successfully"}), 200



@bp.route("/api/track_sales", methods=['GET'])
@login_required
def track_sales():
    sales = Sale.query.order_by(Sale.sale_date.desc()).all()
    return jsonify([
        {
            'id': sale.id,
            'product_id': sale.product_id,
            'quantity': sale.quantity,
            'total_price': sale.total_price,
            'sale_date': sale.sale_date
        }
        for sale in sales
    ])

@bp.route("/api/generate_report", methods=['GET'])
@login_required
def generate_report():
    if current_user.role.name not in ['Admin', 'Manager']:
        abort(403)

    total_product = Product.query.count()
    total_stock = sum([product.stock for product in Product.query.all()])
    total_sales = Sale.query.count()

    data = {
        'total_product': total_product,
        'total_stock': total_stock,
        'total_sales': total_sales
    }

    return jsonify(data)


