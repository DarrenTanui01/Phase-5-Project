from flask.views import MethodView
from flask_jwt_extended import jwt_required
from flask import jsonify
from utils import role_required
from models import Product, Order, Company, Customer, Supplier, db, Posting, BankTransaction
from datetime import datetime, timedelta

class StockReportAPI(MethodView):
    decorators = [role_required({'admin': ['GET']}), jwt_required()]

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
    decorators = [role_required({'admin': ['GET']}), jwt_required()]

    def get(self):
        products = Product.query.all()
        avg_price = sum(p.price for p in products) / len(products) if products else 0
        low_stock = [ {"id": p.id, "name": p.name, "stock": p.stock} for p in products if p.stock < 10 ]
        return jsonify({
            "average_price": avg_price,
            "low_stock_products": low_stock
        }), 200

class SalesReportAPI(MethodView):
    decorators = [role_required({'admin': ['GET']}), jwt_required()]

    def get(self):
        orders = Order.query.all()
        total_sales = 0
        orders_list = []
        for order in orders:
            # Calculate products sold and total due
            products_with_qty = order.products_with_quantities()
            products_sold = sum(prod['quantity'] for prod in products_with_qty)
            total_sales += products_sold
            total_due = sum(
                Product.query.get(prod['product_id']).price * prod['quantity']
                for prod in products_with_qty
            )
            # Get payments received for this order
            payment_received = sum(
                p.amount for p in Posting.query.filter_by(posting_type='customer', related_id=order.customer_id).all()
            )
            # Determine status
            status = "completed" if payment_received >= total_due else "pending"
            orders_list.append({
                "id": order.id,
                "customer_name": order.customer.name if order.customer else "",
                "status": status,
                "date": order.date.strftime('%Y-%m-%d'),
                "products_sold": products_sold,
                "payment_received": payment_received,
                "total_due": total_due
            })

        customer_postings = Posting.query.filter_by(posting_type='customer').all()
        total_payments = sum(p.amount for p in customer_postings)
        return jsonify({
            "total_orders": len(orders),
            "total_products_sold": total_sales,
            "total_payments_received": total_payments,
            "orders": orders_list
        }), 200

class DashboardAnalyticsAPI(MethodView):
    decorators = [role_required({'admin': ['GET']}), jwt_required()]

    def get(self):
        num_products = Product.query.count()
        num_orders = Order.query.count()
        num_companies = Company.query.count()
        num_customers = Customer.query.count()
        num_suppliers = Supplier.query.count()
        total_postings = db.session.query(db.func.sum(Posting.amount)).scalar() or 0
        total_bank_transactions = db.session.query(db.func.sum(BankTransaction.amount)).scalar() or 0
        return jsonify({
            "num_products": num_products,
            "num_orders": num_orders,
            "num_companies": num_companies,
            "num_customers": num_customers,
            "num_suppliers": num_suppliers,
            "total_postings": total_postings,
            "total_bank_transactions": total_bank_transactions
        }), 200

class TrendInsightsAPI(MethodView):
    decorators = [role_required({'admin': ['GET']}), jwt_required()]

    def get(self):
        week_ago = datetime.utcnow() - timedelta(days=7)
        orders = Order.query.filter(Order.date >= week_ago).all()
        postings = Posting.query.filter(Posting.date >= week_ago).all()
        transactions = BankTransaction.query.filter(BankTransaction.date >= week_ago).all()
        daily_counts = {}
        daily_postings = {}
        daily_transactions = {}
        for order in orders:
            day = order.date.strftime('%Y-%m-%d')
            daily_counts[day] = daily_counts.get(day, 0) + 1
        for posting in postings:
            day = posting.date.strftime('%Y-%m-%d')
            daily_postings[day] = daily_postings.get(day, 0) + posting.amount
        for transaction in transactions:
            day = transaction.date.strftime('%Y-%m-%d')
            daily_transactions[day] = daily_transactions.get(day, 0) + transaction.amount
        return jsonify({
            "orders_last_7_days": daily_counts,
            "postings_last_7_days": daily_postings,
            "bank_transactions_last_7_days": daily_transactions
        }), 200

class SupplierReportAPI(MethodView):
    decorators = [role_required({'admin': ['GET']}), jwt_required()]

    def get(self):
        suppliers = Supplier.query.all()
        total_suppliers = len(suppliers)
        supplier_list = [
            {"id": s.id, "name": s.name, "contact_info": s.contact_info}
            for s in suppliers
        ]
        return jsonify({
            "total_suppliers": total_suppliers,
            "suppliers": supplier_list
        }), 200

class SupplierAnalyticsAPI(MethodView):
    decorators = [role_required({'admin': ['GET']}), jwt_required()]

    def get(self):
        suppliers = Supplier.query.all()
        analytics_data = []
        for supplier in suppliers:
            total_products = len(supplier.products)
            total_orders = sum(len(product.orders) for product in supplier.products)
            total_revenue = sum(
                product.price * order.quantity
                for product in supplier.products
                for order in product.orders
            )
            analytics_data.append({
                "supplier_id": supplier.id,
                "supplier_name": supplier.name,
                "total_products": total_products,
                "total_orders": total_orders,
                "total_revenue": total_revenue
            })
        return jsonify({
            "supplier_analytics": analytics_data
        }), 200

class CustomerReportAPI(MethodView):
    decorators = [role_required({'admin': ['GET']}), jwt_required()]

    def get(self):
        customers = Customer.query.all()
        total_customers = len(customers)
        customer_list = [
            {"id": c.id, "name": c.name, "contact_info": c.contact_info}
            for c in customers
        ]
        return jsonify({
            "total_customers": total_customers,
            "customers": customer_list
        }), 200

class CustomerAnalyticsAPI(MethodView):
    decorators = [role_required({'admin': ['GET']}), jwt_required()]

    def get(self):
        customers = Customer.query.all()
        analytics_data = []
        for customer in customers:
            total_orders = len(customer.orders)
            total_spent = sum(
                product.price * order.quantity
                for order in customer.orders
                for product in order.products
            )
            analytics_data.append({
                "customer_id": customer.id,
                "customer_name": customer.name,
                "total_orders": total_orders,
                "total_spent": total_spent
            })
        return jsonify({
            "customer_analytics": analytics_data
        }), 200