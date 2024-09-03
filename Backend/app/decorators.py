from functools import wraps
from flask import request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from app import db
from app.models import User  # Ensure you import the User model

def role_required(roles):
    def wrapper(f):
        @wraps(f)
        @jwt_required()
        def decorated_function(*args, **kwargs):
            user_id = get_jwt_identity()
            current_user = User.query.filter_by(id=user_id).first()
            if not current_user or current_user.role.name not in roles:
                return jsonify({"message": "Access denied"}), 403
            return f(*args, **kwargs)
        return decorated_function
    return wrapper

