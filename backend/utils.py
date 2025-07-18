from functools import wraps
from flask_jwt_extended import get_jwt_identity
from flask import jsonify, request
from models import User

def role_required(roles_methods):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            if not user:
                return jsonify({'error': 'Forbidden: user not found'}), 403
            allowed_methods = roles_methods.get(user.role, [])
            if request.method not in allowed_methods:
                return jsonify({'error': 'Forbidden: insufficient permissions'}), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator