from flask.views import MethodView
from flask_jwt_extended import jwt_required
from flask import jsonify
from utils import role_required
from models import Product, Order, Company, Customer, Supplier, db
from datetime import datetime, timedelta

class StockReportAPI(MethodView):
    decorators = [role_required({'admin': ['GET'], 'company': ['GET']}), jwt_required()]

    def get(self):
        products = Product.query.all()
        total_stock = sum(p.stock for p in products)
        product_list = [
            {"id": p.id, "name": p.name, "stock": p.stock, "supplier_id": p.supplier_id}
            for p in products
        ]
        return jsonify({
            "total_stock": total_stock,
            "products": product_list
        }), 200

class StockAnalysisAPI(MethodView):
    decorators = [role_required({'admin': ['GET'], 'company': ['GET']}), jwt_required()]

    def get(self):
        products = Product.query.all()
        avg_price = sum(p.price for p in products) / len(products) if products else 0
        low_stock = [ {"id": p.id, "name": p.name, "stock": p.stock} for p in products if p.stock < 10 ]
        return jsonify({
            "average_price": avg_price,
            "low_stock_products": low_stock
        }), 200

class SalesReportAPI(MethodView):
    decorators = [role_required({'admin': ['GET'], 'company': ['GET']}), jwt_required()]

    def get(self):
        orders = Order.query.all()
        total_sales = 0
        for order in orders:
            for prod in order.products_with_quantities():
                total_sales += prod['quantity']
        return jsonify({
            "total_orders": len(orders),
            "total_products_sold": total_sales
        }), 200

class DashboardAnalyticsAPI(MethodView):
    decorators = [role_required({'admin': ['GET'], 'company': ['GET']}), jwt_required()]

    def get(self):
        num_products = Product.query.count()
        num_orders = Order.query.count()
        num_companies = Company.query.count()
        num_customers = Customer.query.count()
        num_suppliers = Supplier.query.count()
        return jsonify({
            "num_products": num_products,
            "num_orders": num_orders,
            "num_companies": num_companies,
            "num_customers": num_customers,
            "num_suppliers": num_suppliers
        }), 200

class TrendInsightsAPI(MethodView):
    decorators = [role_required({'admin': ['GET'], 'company': ['GET']}), jwt_required()]

    def get(self):
        # Orders in the last 7 days
        week_ago = datetime.utcnow() - timedelta(days=7)
        orders = Order.query.filter(Order.date >= week_ago).all()
        daily_counts = {}
        for order in orders:
            day = order.date.strftime('%Y-%m-%d')
            daily_counts[day] = daily_counts.get(day, 0) + 1
        return jsonify({
            "orders_last_7_days": daily_counts
        }), 200