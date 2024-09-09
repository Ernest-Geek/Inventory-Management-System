from functools import wraps
from flask import request, jsonify
from app.models import User  # Adjust the import based on your project structure
from flask_login import current_user


def permission_required(permission_name):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            if not current_user.is_authenticated:
                return jsonify({'message': 'Unauthorized'}), 401

            user = User.query.get(current_user.id)
            if not user:
                return jsonify({'message': 'User not found'}), 404

            # Get user permissions
            user_permissions = {perm.name for role in user.role.permissions for perm in role.permissions}
            if permission_name not in user_permissions:
                return jsonify({'message': 'Forbidden'}), 403

            return f(*args, **kwargs)
        return wrapper
    return decorator


