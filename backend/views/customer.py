from flask.views import MethodView
from flask_jwt_extended import jwt_required
from flask import request, jsonify
from models import Customer, db, Product
from schemas import CustomerSchema
from utils import role_required

customer_schema = CustomerSchema()

class CustomerAPI(MethodView):
    decorators = [role_required({'admin': ['GET', 'POST', 'PUT', 'DELETE'], 'customer': ['GET', 'POST', 'PUT', 'DELETE']}), jwt_required()]

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

class CustomerFinanceAPI(MethodView):
    decorators = [role_required({'admin': ['GET'], 'customer': ['GET']}), jwt_required()]

    def get(self):
        customers = Customer.query.all()
        result = []
        for customer in customers:
            total_orders = len(customer.orders)
            total_spent = 0
            for order in customer.orders:
                for prod in order.products_with_quantities():
                    product = Product.query.get(prod['product_id'])
                    total_spent += product.price * prod['quantity']
            result.append({
                "customer_id": customer.id,
                "name": customer.name,
                "total_orders": total_orders,
                "total_spent": total_spent
            })
        return jsonify(result), 200

class CustomerReportAPI(MethodView):
    decorators = [role_required({'admin': ['GET'], 'customer': ['GET']}), jwt_required()]

    def get(self):
        customers = Customer.query.all()
        report = []
        for customer in customers:
            total_orders = len(customer.orders)
            total_spent = 0
            for order in customer.orders:
                for prod in order.products_with_quantities():
                    product = Product.query.get(prod['product_id'])
                    total_spent += product.price * prod['quantity']
            report.append({
                "customer_id": customer.id,
                "name": customer.name,
                "total_orders": total_orders,
                "total_spent": total_spent
            })
        return jsonify(report), 200