from flask.views import MethodView
from flask_jwt_extended import jwt_required
from flask import request, jsonify
from models import Product, db
from schemas import ProductSchema
from utils import role_required

product_schema = ProductSchema()

class ProductAPI(MethodView):
    decorators = [jwt_required(), role_required('admin', 'supplier')]

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