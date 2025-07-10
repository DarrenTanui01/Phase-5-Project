from flask.views import MethodView
from flask_jwt_extended import jwt_required
from flask import request, jsonify
from models import Customer, db
from schemas import CustomerSchema
from utils import role_required

customer_schema = CustomerSchema()

class CustomerAPI(MethodView):
    decorators = [jwt_required(), role_required('admin', 'customer')]

    def get(self, customer_id=None):
        if customer_id:
            customer = Customer.query.get_or_404(customer_id)
            return customer_schema.dump(customer)
        customers = Customer.query.all()
        return customer_schema.dump(customers, many=True)

    def post(self):
        data = request.json
        errors = customer_schema.validate(data)
        if errors:
            return jsonify(errors), 400
        customer = Customer(**data)
        db.session.add(customer)
        db.session.commit()
        return customer_schema.dump(customer), 201

    def put(self, customer_id):
        customer = Customer.query.get_or_404(customer_id)
        data = request.json
        errors = customer_schema.validate(data)
        if errors:
            return jsonify(errors), 400
        customer.name = data['name']
        customer.contact_info = data.get('contact_info', customer.contact_info)
        db.session.commit()
        return customer_schema.dump(customer)

    def delete(self, customer_id):
        customer = Customer.query.get_or_404(customer_id)
        db.session.delete(customer)
        db.session.commit()
        return '', 204