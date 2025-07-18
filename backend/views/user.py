from flask.views import MethodView
from flask_jwt_extended import jwt_required
from flask import request, jsonify
from models import User, db
from schemas import UserSchema
from utils import role_required

user_schema = UserSchema()

class UserAPI(MethodView):
    decorators = [role_required({'admin': ['GET', 'DELETE']}), jwt_required()]

    def get(self, user_id=None):
        if user_id:
            user = User.query.get_or_404(user_id)
            return user_schema.dump(user)
        users = User.query.all()
        return user_schema.dump(users, many=True)

    def delete(self, user_id):
        user = User.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        return '', 204