from flask.views import MethodView
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import request, jsonify
from models import User, db
from schemas import UserSchema
from utils import role_required
from views.report import (
    StockReportAPI, StockAnalysisAPI,
    SalesReportAPI, DashboardAnalyticsAPI, TrendInsightsAPI
)
from views.supplier import SupplierReportAPI, SupplierAnalyticsAPI
from views.customer import CustomerReportAPI
from views.bank import BankAccountAPI

user_schema = UserSchema()

class UserAPI(MethodView):
    decorators = [role_required({'admin': ['GET', 'DELETE']}), jwt_required()]

    def get(self, user_id=None):
        if user_id:
            user = User.query.get_or_404(user_id)
            return user_schema.dump(user)
        users = User.query.all()
        return user_schema.dump(users, many=True)

    def delete(self, user_id):
        user = User.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        return '', 204

class AdminDashboardAPI(MethodView):
    decorators = [role_required({'admin': ['GET']}), jwt_required()]

    def get(self):
        user_id = get_jwt_identity()
        user = User.query.get_or_404(user_id)
        if user.role != 'admin':
            return jsonify({'error': 'Forbidden'}), 403

        # Reports and analytics
        
        stock_report = StockReportAPI().get()[0].json
        stock_analysis = StockAnalysisAPI().get()[0].json
        sales_report = SalesReportAPI().get()[0].json
        dashboard_analytics = DashboardAnalyticsAPI().get()[0].json
        trend_insights = TrendInsightsAPI().get()[0].json
        supplier_report = SupplierReportAPI().get()[0].json
        supplier_analytics = SupplierAnalyticsAPI().get()[0].json
        customer_report = CustomerReportAPI().get()[0].json
        # Bank accounts
        bank_accounts = BankAccountAPI().get()

        return jsonify({
            "admin_profile": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role
            },
            "stock_report": stock_report,
            "stock_analysis": stock_analysis,
            "sales_report": sales_report,
            "dashboard_analytics": dashboard_analytics,
            "trend_insights": trend_insights,
            "supplier_report": supplier_report,
            "supplier_analytics": supplier_analytics,
            "customer_report": customer_report,
            "bank_accounts": bank_accounts.json if hasattr(bank_accounts, 'json') else bank_accounts.get_json()
        })