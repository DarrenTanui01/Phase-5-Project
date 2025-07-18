from flask.views import MethodView
from flask_jwt_extended import jwt_required
from flask import request, jsonify
from models import Order, db, order_product, Product
from schemas import OrderSchema
from utils import role_required
from datetime import datetime

order_schema = OrderSchema()

class OrderAPI(MethodView):
    decorators = [role_required({'admin': ['GET', 'POST'], 'customer': ['GET', 'POST', 'PUT', 'DELETE']}), jwt_required()]

    def get(self, order_id=None):
        if order_id:
            order = Order.query.get_or_404(order_id)
            return order_schema.dump(order)
        orders = Order.query.all()
        return order_schema.dump(orders, many=True)

    def post(self):
        data = request.json
        errors = order_schema.validate(data)
        if errors:
            return jsonify(errors), 400
        order = Order(
            customer_id=data['customer_id'],
            date=datetime.utcnow(),
            status=data.get('status', 'pending')
        )
        db.session.add(order)
        db.session.flush()
        for prod in data.get('products', []):
            db.session.execute(order_product.insert().values(
                order_id=order.id,
                product_id=prod['product_id'],
                quantity=prod['quantity']
            ))
            
            product = Product.query.get(prod['product_id'])
            if product:
                if product.stock < prod['quantity']:
                    db.session.rollback()
                    return jsonify({'error': f'Insufficient stock for product {product.name}'}), 400
                product.stock -= prod['quantity']
        db.session.commit()
        return order_schema.dump(order), 201

    def put(self, order_id):
        order = Order.query.get_or_404(order_id)
        data = request.json
        errors = order_schema.validate(data)
        if errors:
            return jsonify(errors), 400
        order.status = data.get('status', order.status)
        db.session.commit()
        return order_schema.dump(order)

    def delete(self, order_id):
        order = Order.query.get_or_404(order_id)
        db.session.delete(order)
        db.session.commit()
        return '', 204