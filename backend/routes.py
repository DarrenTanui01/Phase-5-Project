from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, User, Supplier, Customer, Product, Order, order_product
from schemas import UserSchema, SupplierSchema, CustomerSchema, ProductSchema, OrderSchema
from datetime import datetime
from views.supplier import SupplierAPI, SupplierFinanceAPI, SupplierReportAPI, SupplierAnalyticsAPI
from views.user import UserAPI, AdminDashboardAPI
from views.customer import CustomerAPI, CustomerFinanceAPI, CustomerReportAPI
from views.product import ProductAPI, ProductConversionAPI, ProductTransferAPI, ProductWriteOffAPI
from views.order import OrderAPI
from views.bank import BankAccountAPI, BankTransactionAPI, PostingAPI
from views.admin import UserRoleAPI, UserPermissionAPI
from views.stock import CompanyAPI
from views.report import (
    StockReportAPI, StockAnalysisAPI,
    SalesReportAPI, DashboardAnalyticsAPI, TrendInsightsAPI
)

api_bp = Blueprint('api', __name__)

# User endpoints (admin only)
user_view = UserAPI.as_view('user_api')
api_bp.add_url_rule('/users', defaults={'user_id': None}, view_func=user_view, methods=['GET'])
api_bp.add_url_rule('/users/<int:user_id>', view_func=user_view, methods=['GET', 'DELETE'])

# Admin dashboard endpoint
admin_dashboard_view = AdminDashboardAPI.as_view('admin_dashboard_api')
api_bp.add_url_rule('/users/admin', view_func=admin_dashboard_view, methods=['GET'])

# Supplier endpoints
supplier_view = SupplierAPI.as_view('supplier_api')
api_bp.add_url_rule('/suppliers', defaults={'supplier_id': None}, view_func=supplier_view, methods=['GET'])
api_bp.add_url_rule('/suppliers', view_func=supplier_view, methods=['POST'])
api_bp.add_url_rule('/suppliers/<int:supplier_id>', view_func=supplier_view, methods=['GET', 'PUT', 'DELETE'])

# Customer endpoints
customer_view = CustomerAPI.as_view('customer_api')
api_bp.add_url_rule('/customers', defaults={'customer_id': None}, view_func=customer_view, methods=['GET'])
api_bp.add_url_rule('/customers', view_func=customer_view, methods=['POST'])
api_bp.add_url_rule('/customers/<int:customer_id>', view_func=customer_view, methods=['GET', 'PUT', 'DELETE'])

# Product endpoints
product_view = ProductAPI.as_view('product_api')
api_bp.add_url_rule('/products', defaults={'product_id': None}, view_func=product_view, methods=['GET'])
api_bp.add_url_rule('/products', view_func=product_view, methods=['POST'])
api_bp.add_url_rule('/products/<int:product_id>', view_func=product_view, methods=['GET', 'PUT', 'DELETE'])

# Order endpoints
order_view = OrderAPI.as_view('order_api')
api_bp.add_url_rule('/orders', defaults={'order_id': None}, view_func=order_view, methods=['GET'])
api_bp.add_url_rule('/orders', view_func=order_view, methods=['POST'])
api_bp.add_url_rule('/orders/<int:order_id>', view_func=order_view, methods=['GET', 'PUT', 'DELETE'])

# Bank endpoints
bank_account_view = BankAccountAPI.as_view('bank_account_api')
api_bp.add_url_rule('/bank_accounts', defaults={'account_id': None}, view_func=bank_account_view, methods=['GET'])
api_bp.add_url_rule('/bank_accounts', view_func=bank_account_view, methods=['POST'])
api_bp.add_url_rule('/bank_accounts/<int:account_id>', view_func=bank_account_view, methods=['GET', 'PUT', 'DELETE'])

bank_transaction_view = BankTransactionAPI.as_view('bank_transaction_api')
api_bp.add_url_rule('/bank_transactions', defaults={'transaction_id': None}, view_func=bank_transaction_view, methods=['GET'])
api_bp.add_url_rule('/bank_transactions', view_func=bank_transaction_view, methods=['POST'])
api_bp.add_url_rule('/bank_transactions/<int:transaction_id>', view_func=bank_transaction_view, methods=['GET'])

posting_view = PostingAPI.as_view('posting_api')
api_bp.add_url_rule('/postings', defaults={'posting_id': None}, view_func=posting_view, methods=['GET'])
api_bp.add_url_rule('/postings', view_func=posting_view, methods=['POST'])
api_bp.add_url_rule('/postings/<int:posting_id>', view_func=posting_view, methods=['GET'])

# Admin endpoints
role_view = UserRoleAPI.as_view('role_api')
api_bp.add_url_rule('/roles', defaults={'role_id': None}, view_func=role_view, methods=['GET'])
api_bp.add_url_rule('/roles', view_func=role_view, methods=['POST'])
api_bp.add_url_rule('/roles/<int:role_id>', view_func=role_view, methods=['GET'])

permission_view = UserPermissionAPI.as_view('permission_api')
api_bp.add_url_rule('/permissions', defaults={'permission_id': None}, view_func=permission_view, methods=['GET'])
api_bp.add_url_rule('/permissions', view_func=permission_view, methods=['POST'])
api_bp.add_url_rule('/permissions/<int:permission_id>', view_func=permission_view, methods=['GET'])

# Stock/Company endpoints
company_view = CompanyAPI.as_view('company_api')
api_bp.add_url_rule('/companies', defaults={'company_id': None}, view_func=company_view, methods=['GET'])
api_bp.add_url_rule('/companies', view_func=company_view, methods=['POST'])
api_bp.add_url_rule('/companies/<int:company_id>', view_func=company_view, methods=['GET', 'PUT', 'DELETE'])

user_schema = UserSchema()
supplier_schema = SupplierSchema()
customer_schema = CustomerSchema()
product_schema = ProductSchema()
order_schema = OrderSchema()


@api_bp.app_errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Not found'}), 404

@api_bp.app_errorhandler(400)
def bad_request(e):
    return jsonify({'error': 'Bad request'}), 400


@api_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        errors = user_schema.validate(data)
        if errors:
            return jsonify(errors), 400
        if User.query.filter((User.username==data['username']) | (User.email==data['email'])).first():
            return jsonify({'error': 'Username or email exists'}), 400
        user = User(
            username=data['username'],
            email=data['email'],
            role=data.get('role', 'customer')
        )
        user.set_password(data['password'])
        db.session.add(user)
        db.session.commit()
        return user_schema.dump(user), 201
    except Exception as e:
        print("Registration error:", e)
        return jsonify({'error': 'Registration failed', 'details': str(e)}), 500

@api_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data.get('username')).first()
    if user and user.check_password(data.get('password')):
        access_token = create_access_token(identity=str(user.id)) 
        return jsonify({'access_token': access_token, 'user': user_schema.dump(user)})
    return jsonify({'error': 'Invalid credentials'}), 401


@api_bp.route('/some_route', methods=['GET'])
@jwt_required()
def some_route():
    user_id = get_jwt_identity()
    
    return jsonify({'user_id': user_id}), 200

# Supplier dashboard endpoints
api_bp.add_url_rule('/supplier_finances', view_func=SupplierFinanceAPI.as_view('supplier_finances_api'), methods=['GET'])
api_bp.add_url_rule('/supplier_reports', view_func=SupplierReportAPI.as_view('supplier_reports_api'), methods=['GET'])
api_bp.add_url_rule('/supplier_analytics', view_func=SupplierAnalyticsAPI.as_view('supplier_analytics_api'), methods=['GET'])

# Customer dashboard endpoints
api_bp.add_url_rule('/customer_finances', view_func=CustomerFinanceAPI.as_view('customer_finances_api'), methods=['GET'])
api_bp.add_url_rule('/customer_reports', view_func=CustomerReportAPI.as_view('customer_reports_api'), methods=['GET'])

# Product dashboard endpoints
api_bp.add_url_rule('/product_conversions', view_func=ProductConversionAPI.as_view('product_conversions_api'), methods=['POST'])
api_bp.add_url_rule('/product_transfers', view_func=ProductTransferAPI.as_view('product_transfers_api'), methods=['POST'])
api_bp.add_url_rule('/product_writeoffs', view_func=ProductWriteOffAPI.as_view('product_writeoffs_api'), methods=['POST'])

# Stock/Reports endpoints
api_bp.add_url_rule('/stock_reports', view_func=StockReportAPI.as_view('stock_reports_api'), methods=['GET'])
api_bp.add_url_rule('/stock_analysis', view_func=StockAnalysisAPI.as_view('stock_analysis_api'), methods=['GET'])

# Admin/Reports endpoints
api_bp.add_url_rule('/sales_reports', view_func=SalesReportAPI.as_view('sales_reports_api'), methods=['GET'])
api_bp.add_url_rule('/dashboard_analytics', view_func=DashboardAnalyticsAPI.as_view('dashboard_analytics_api'), methods=['GET'])
api_bp.add_url_rule('/trend_insights', view_func=TrendInsightsAPI.as_view('trend_insights_api'), methods=['GET'])