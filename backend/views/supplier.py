from flask.views import MethodView
from flask_jwt_extended import jwt_required
from flask import request, jsonify
from models import Supplier, db
from schemas import SupplierSchema
from utils import role_required

supplier_schema = SupplierSchema()

class SupplierAPI(MethodView):
    decorators = [role_required('admin', 'supplier'), jwt_required()]

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
    decorators = [role_required('admin', 'supplier'), jwt_required()]

    def get(self):
        # Return supplier financial data (stub)
        return jsonify({'message': 'Supplier finances endpoint'}), 200

class SupplierReportAPI(MethodView):
    decorators = [role_required('admin', 'supplier'), jwt_required()]

    def get(self):
        # Return supplier reports (stub)
        return jsonify({'message': 'Supplier reports endpoint'}), 200

class SupplierAnalyticsAPI(MethodView):
    decorators = [role_required('admin', 'supplier'), jwt_required()]

    def get(self):
        # Return supplier analytics (stub)
        return jsonify({'message': 'Supplier analytics endpoint'}), 200