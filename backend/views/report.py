from flask.views import MethodView
from flask_jwt_extended import jwt_required
from flask import jsonify
from utils import role_required

class StockReportAPI(MethodView):
    decorators = [role_required('admin', 'supplier'), jwt_required()]

    def get(self):
        return jsonify({'message': 'Stock report endpoint'}), 200

class StockAnalysisAPI(MethodView):
    decorators = [role_required('admin', 'supplier'), jwt_required()]

    def get(self):
        return jsonify({'message': 'Stock analysis endpoint'}), 200

class SalesReportAPI(MethodView):
    decorators = [role_required('admin'), jwt_required()]

    def get(self):
        return jsonify({'message': 'Total sales report endpoint'}), 200

class DashboardAnalyticsAPI(MethodView):
    decorators = [role_required('admin'), jwt_required()]

    def get(self):
        return jsonify({'message': 'Overall dashboard analytics endpoint'}), 200

class TrendInsightsAPI(MethodView):
    decorators = [role_required('admin'), jwt_required()]

    def get(self):
        return jsonify({'message': 'Trend and insights endpoint'}), 200