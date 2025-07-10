from flask.views import MethodView
from flask_jwt_extended import jwt_required
from flask import request, jsonify
from models import Company, db
from schemas import CompanySchema
from utils import role_required

company_schema = CompanySchema()

class CompanyAPI(MethodView):
    decorators = [role_required('admin', 'supplier'), jwt_required()]

    def get(self, company_id=None):
        if company_id:
            company = Company.query.get_or_404(company_id)
            return company_schema.dump(company)
        companies = Company.query.all()
        return company_schema.dump(companies, many=True)

    def post(self):
        data = request.json
        errors = company_schema.validate(data)
        if errors:
            return jsonify(errors), 400
        company = Company(**data)
        db.session.add(company)
        db.session.commit()
        return company_schema.dump(company), 201

    def put(self, company_id):
        company = Company.query.get_or_404(company_id)
        data = request.json
        errors = company_schema.validate(data)
        if errors:
            return jsonify(errors), 400
        company.name = data['name']
        company.address = data.get('address', company.address)
        company.contact_info = data.get('contact_info', company.contact_info)
        db.session.commit()
        return company_schema.dump(company)

    def delete(self, company_id):
        company = Company.query.get_or_404(company_id)
        db.session.delete(company)
        db.session.commit()
        return '', 204