from flask import request, jsonify
from functools import wraps
from flask_jwt_extended import get_jwt_identity, jwt_required
from app.models import User  # Adjust this import if needed

def admin_required(f):
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        if not user or user.role != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated_function
