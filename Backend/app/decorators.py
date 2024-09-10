from functools import wraps
from flask_login import current_user
from flask import jsonify

def permission_required(permission_name):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Check if the user is logged in
            if not current_user.is_authenticated:
                return jsonify({"message": "Access forbidden: user not logged in"}), 403

            # Check if the user has the required permission
            role = current_user.role
            if not role:
                return jsonify({"message": "Access forbidden: no role assigned"}), 403

            permissions = [p.name for p in role.permissions]
            if permission_name not in permissions:
                return jsonify({"message": "Access forbidden: insufficient permissions"}), 403

            return func(*args, **kwargs)
        return wrapper
    return decorator
