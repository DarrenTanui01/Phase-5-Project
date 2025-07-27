from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity
from functools import wraps
from models import User

def role_required(roles_dict):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            if not user:
                return jsonify({'error': 'Forbidden: user not found'}), 403
            method = request.method
            allowed = roles_dict.get(user.role, [])
            if method not in allowed:
                return jsonify({
                    "error": "You don't have permission to view this.",
                    "icon": "lock"
                }), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator