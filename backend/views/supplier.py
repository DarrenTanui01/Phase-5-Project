from flask.views import MethodView
from flask_jwt_extended import jwt_required
from flask import request, jsonify
from models import Supplier, db
from schemas import SupplierSchema
from utils import role_required

supplier_schema = SupplierSchema()

class SupplierAPI(MethodView):
    decorators = [jwt_required(), role_required('admin', 'supplier')]

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