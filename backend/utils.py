from functools import wraps
from flask_jwt_extended import get_jwt_identity
from flask import jsonify
from models import User

def role_required(*roles):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            if not user or user.role not in roles:
                return jsonify({'error': 'Forbidden: insufficient permissions'}), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator