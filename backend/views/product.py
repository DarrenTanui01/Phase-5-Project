from flask.views import MethodView
from flask_jwt_extended import jwt_required
from flask import request, jsonify
from models import Product, db
from schemas import ProductSchema
from utils import role_required

product_schema = ProductSchema()

class ProductAPI(MethodView):
    decorators = [role_required({
        'admin': ['GET', 'POST', 'PUT', 'DELETE'],
        'supplier': ['GET', 'POST', 'PUT', 'DELETE']
    }), jwt_required()]

    def get(self, product_id=None):
        if product_id:
            product = Product.query.get_or_404(product_id)
            return product_schema.dump(product)
        products = Product.query.all()
        return product_schema.dump(products, many=True)

    def post(self):
        data = request.json
        errors = product_schema.validate(data)
        if errors:
            return jsonify(errors), 400
        product = Product(**data)
        db.session.add(product)
        db.session.commit()
        return product_schema.dump(product), 201

    def put(self, product_id):
        product = Product.query.get_or_404(product_id)
        data = request.json
        errors = product_schema.validate(data)
        if errors:
            return jsonify(errors), 400
        product.name = data['name']
        product.description = data.get('description', product.description)
        product.price = data['price']
        product.stock = data.get('stock', product.stock)
        product.supplier_id = data['supplier_id']
        db.session.commit()
        return product_schema.dump(product)

    def delete(self, product_id):
        product = Product.query.get_or_404(product_id)
        db.session.delete(product)
        db.session.commit()
        return '', 204

class ProductConversionAPI(MethodView):
    decorators = [role_required({'admin': ['GET'], 'supplier': ['POST']}), jwt_required()]

    def get(self):
        
        products = Product.query.all()
        result = []
        for p in products:
            result.append({
                "product_id": p.id,
                "name": p.name,
                "stock": p.stock
            })
        return jsonify(result), 200

    def post(self):
        data = request.json
        from_product = Product.query.get(data.get('from_product_id'))
        to_product = Product.query.get(data.get('to_product_id'))
        quantity = data.get('quantity', 0)
        if not from_product or not to_product:
            return jsonify({'error': 'Product not found'}), 404
        if from_product.stock < quantity:
            return jsonify({'error': 'Insufficient stock for conversion'}), 400
        from_product.stock -= quantity
        to_product.stock += quantity
        db.session.commit()
        return jsonify({
            "converted_from": {"id": from_product.id, "name": from_product.name, "remaining_stock": from_product.stock},
            "converted_to": {"id": to_product.id, "name": to_product.name, "new_stock": to_product.stock},
            "quantity_converted": quantity
        }), 200

class ProductTransferAPI(MethodView):
    decorators = [role_required({'admin': ['POST'], 'supplier': ['POST']}), jwt_required()]

    def post(self):
        data = request.json
        product = Product.query.get(data['product_id'])
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        quantity = data.get('quantity', 0)
        if product.stock < quantity:
            return jsonify({'error': 'Insufficient stock'}), 400
        product.stock -= quantity
        db.session.commit()
        return jsonify({
            "product_id": product.id,
            "from_location": data.get('from_location'),
            "to_location": data.get('to_location'),
            "quantity_transferred": quantity,
            "remaining_stock": product.stock
        }), 200

class ProductWriteOffAPI(MethodView):
    decorators = [role_required({'admin': ['POST'], 'supplier': ['POST']}), jwt_required()]

    def post(self):
        data = request.json
        product = Product.query.get(data['product_id'])
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        quantity = data.get('quantity', 0)
        if product.stock < quantity:
            return jsonify({'error': 'Insufficient stock'}), 400
        product.stock -= quantity
        db.session.commit()
        return jsonify({
            "product_id": product.id,
            "quantity_written_off": quantity,
            "reason": data.get('reason'),
            "remaining_stock": product.stock
        }), 200