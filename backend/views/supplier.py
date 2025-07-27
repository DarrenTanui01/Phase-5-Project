from flask.views import MethodView
from flask_jwt_extended import jwt_required
from flask import request, jsonify
from models import Supplier, db
from schemas import SupplierSchema
from utils import role_required

supplier_schema = SupplierSchema()

class SupplierAPI(MethodView):
    decorators = [role_required({
        'admin': ['GET', 'POST', 'PUT', 'DELETE'],
        'supplier': ['POST']
    }), jwt_required()]

    def get(self, supplier_id=None):
        if supplier_id:
            supplier = Supplier.query.get_or_404(supplier_id)
            return supplier_schema.dump(supplier)
        suppliers = Supplier.query.all()
        return supplier_schema.dump(suppliers, many=True)

    def post(self):
        data = request.json
        errors = supplier_schema.validate(data)
        if errors:
            return jsonify(errors), 400
        supplier = Supplier(**data)
        db.session.add(supplier)
        db.session.commit()
        return supplier_schema.dump(supplier), 201

    def put(self, supplier_id):
        supplier = Supplier.query.get_or_404(supplier_id)
        data = request.json
        errors = supplier_schema.validate(data)
        if errors:
            return jsonify(errors), 400
        supplier.name = data['name']
        supplier.contact_info = data.get('contact_info', supplier.contact_info)
        db.session.commit()
        return supplier_schema.dump(supplier)

    def delete(self, supplier_id):
        supplier = Supplier.query.get_or_404(supplier_id)
        db.session.delete(supplier)
        db.session.commit()
        return '', 204

class SupplierFinanceAPI(MethodView):
    decorators = [role_required({'admin': ['GET'], 'supplier': ['GET']}), jwt_required()]

    def get(self):
        suppliers = Supplier.query.all()
        result = []
        for supplier in suppliers:
            total_products = len(supplier.products)
            total_stock_value = sum(p.price * p.stock for p in supplier.products)
            result.append({
                "supplier_id": supplier.id,
                "name": supplier.name,
                "total_products": total_products,
                "total_stock_value": total_stock_value
            })
        return jsonify(result), 200

class SupplierReportAPI(MethodView):
    decorators = [role_required({'admin': ['GET'], 'supplier': ['GET']}), jwt_required()]

    def get(self):
        suppliers = Supplier.query.all()
        report = []
        for supplier in suppliers:
            products = [{"id": p.id, "name": p.name, "stock": p.stock, "price": p.price} for p in supplier.products]
            report.append({
                "supplier_id": supplier.id,
                "name": supplier.name,
                "products": products
            })
        return jsonify(report), 200

class SupplierAnalyticsAPI(MethodView):
    decorators = [role_required({'admin': ['GET'], 'supplier': ['GET']}), jwt_required()]

    def get(self):
        suppliers = Supplier.query.all()
        analytics = []
        for supplier in suppliers:
            total_stock = sum(p.stock for p in supplier.products)
            avg_price = sum(p.price for p in supplier.products) / len(supplier.products) if supplier.products else 0
            analytics.append({
                "supplier_id": supplier.id,
                "name": supplier.name,
                "total_stock": total_stock,
                "average_price": avg_price
            })
        return jsonify(analytics), 200