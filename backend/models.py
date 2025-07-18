from extensions import db
from werkzeug.security import generate_password_hash, check_password_hash

order_product = db.Table('order_product',
    db.Column('order_id', db.Integer, db.ForeignKey('order.id'), primary_key=True),
    db.Column('product_id', db.Integer, db.ForeignKey('product.id'), primary_key=True),
    db.Column('quantity', db.Integer, nullable=False, default=1)
)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'supplier', 'customer', 'admin'

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Supplier(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    contact_info = db.Column(db.String(200))
    products = db.relationship('Product', backref='supplier', lazy=True)

class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    contact_info = db.Column(db.String(200))
    orders = db.relationship('Order', backref='customer', lazy=True)

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.String(200))
    price = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, default=0)
    supplier_id = db.Column(db.Integer, db.ForeignKey('supplier.id'), nullable=False)
    orders = db.relationship('Order', secondary=order_product, back_populates='products')

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=False)
    date = db.Column(db.DateTime)
    status = db.Column(db.String(50))
    products = db.relationship('Product', secondary=order_product, back_populates='orders')

    def products_with_quantities(self):
        results = []
        for association in db.session.execute(
            order_product.select().where(order_product.c.order_id == self.id)
        ):
            product = Product.query.get(association.product_id)
            results.append({
                "product_id": product.id,
                "name": product.name,
                "quantity": association.quantity
            })
        return results

class Role(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    permissions = db.relationship('Permission', backref='role', lazy=True)

class Permission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'))

class BankAccount(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    account_name = db.Column(db.String(120), nullable=False)
    account_number = db.Column(db.String(50), nullable=False)
    bank_name = db.Column(db.String(120), nullable=False)
    balance = db.Column(db.Float, default=0.0)

class BankTransaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    bank_account_id = db.Column(db.Integer, db.ForeignKey('bank_account.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    transaction_type = db.Column(db.String(20))  # deposit, withdrawal, transfer
    date = db.Column(db.DateTime)
    description = db.Column(db.String(200))
    bank_account = db.relationship('BankAccount', backref='transactions')

class Posting(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    posting_type = db.Column(db.String(50))  # supplier, customer, other
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.DateTime)
    description = db.Column(db.String(200))
    related_id = db.Column(db.Integer)  # supplier_id, customer_id, etc.

class Company(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    address = db.Column(db.String(200))
    contact_info = db.Column(db.String(200))