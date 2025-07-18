from flask.views import MethodView
from flask_jwt_extended import jwt_required
from flask import request, jsonify
from models import User, Role, Permission, db
from schemas import UserSchema, RoleSchema, PermissionSchema
from utils import role_required

user_schema = UserSchema()
role_schema = RoleSchema()
permission_schema = PermissionSchema()

class UserRoleAPI(MethodView):
    decorators = [role_required({'admin': ['GET', 'POST']}), jwt_required()]

    def get(self, role_id=None):
        if role_id:
            role = Role.query.get_or_404(role_id)
            return role_schema.dump(role)
        roles = Role.query.all()
        return role_schema.dump(roles, many=True)

    def post(self):
        data = request.json
        errors = role_schema.validate(data)
        if errors:
            return jsonify(errors), 400
        role = Role(name=data['name'])
        db.session.add(role)
        db.session.commit()
        return role_schema.dump(role), 201

class UserPermissionAPI(MethodView):
    decorators = [role_required({'admin': ['GET', 'POST']}), jwt_required()]

    def get(self, permission_id=None):
        if permission_id:
            permission = Permission.query.get_or_404(permission_id)
            return permission_schema.dump(permission)
        permissions = Permission.query.all()
        return permission_schema.dump(permissions, many=True)

    def post(self):
        data = request.json
        errors = permission_schema.validate(data)
        if errors:
            return jsonify(errors), 400
        permission = Permission(name=data['name'], role_id=data['role_id'])
        db.session.add(permission)
        db.session.commit()
        return permission_schema.dump(permission), 201