from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, User, Supplier, Customer, Product, Order, order_product
from schemas import UserSchema, SupplierSchema, CustomerSchema, ProductSchema, OrderSchema
from datetime import datetime
from views.supplier import SupplierAPI
from views.user import UserAPI
from views.customer import CustomerAPI
from views.product import ProductAPI
from views.order import OrderAPI

api_bp = Blueprint('api', __name__)

# User endpoints (admin only)
user_view = UserAPI.as_view('user_api')
api_bp.add_url_rule('/users', defaults={'user_id': None}, view_func=user_view, methods=['GET'])
api_bp.add_url_rule('/users/<int:user_id>', view_func=user_view, methods=['GET', 'DELETE'])

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


@api_bp.route('/customers', methods=['GET', 'POST'])
@jwt_required()
def customers():
    if request.method == 'GET':
        customers = Customer.query.all()
        return jsonify(customer_schema.dump(customers, many=True))
    data = request.json
    errors = customer_schema.validate(data)
    if errors:
        return jsonify(errors), 400
    customer = Customer(**data)
    db.session.add(customer)
    db.session.commit()
    return customer_schema.dump(customer), 201

@api_bp.route('/customers/<int:id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def customer_detail(id):
    customer = Customer.query.get_or_404(id)
    if request.method == 'GET':
        return customer_schema.dump(customer)
    if request.method == 'PUT':
        data = request.json
        errors = customer_schema.validate(data)
        if errors:
            return jsonify(errors), 400
        customer.name = data['name']
        customer.contact_info = data.get('contact_info', customer.contact_info)
        db.session.commit()
        return customer_schema.dump(customer)
    if request.method == 'DELETE':
        db.session.delete(customer)
        db.session.commit()
        return '', 204


@api_bp.route('/products', methods=['GET', 'POST'])
@jwt_required()
def products():
    if request.method == 'GET':
        products = Product.query.all()
        return jsonify(product_schema.dump(products, many=True))
    data = request.json
    errors = product_schema.validate(data)
    if errors:
        return jsonify(errors), 400
    product = Product(**data)
    db.session.add(product)
    db.session.commit()
    return product_schema.dump(product), 201

@api_bp.route('/products/<int:id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def product_detail(id):
    product = Product.query.get_or_404(id)
    if request.method == 'GET':
        return product_schema.dump(product)
    if request.method == 'PUT':
        data = request.json
        errors = product_schema.validate(data)
        if errors:
            return jsonify(errors), 400
        product.name = data['name']
        product.description = data.get('description', product.description)
        product.price = data['price']
        product.stock = data.get('stock', product.stock)
        product.supplier_id = data['supplier_id']
        db.session.commit()
        return product_schema.dump(product)
    if request.method == 'DELETE':
        db.session.delete(product)
        db.session.commit()
        return '', 204


@api_bp.route('/orders', methods=['GET', 'POST'])
@jwt_required()
def orders():
    if request.method == 'GET':
        orders = Order.query.all()
        return jsonify(order_schema.dump(orders, many=True))
    data = request.json
    errors = order_schema.validate(data)
    if errors:
        return jsonify(errors), 400
    order = Order(
        customer_id=data['customer_id'],
        date=datetime.utcnow(),
        status=data.get('status', 'pending')
    )
    db.session.add(order)
    db.session.flush()  
    for prod in data.get('products', []):
        db.session.execute(order_product.insert().values(
            order_id=order.id,
            product_id=prod['product_id'],
            quantity=prod['quantity']
        ))
    db.session.commit()
    return order_schema.dump(order), 201

@api_bp.route('/orders/<int:id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def order_detail(id):
    order = Order.query.get_or_404(id)
    if request.method == 'GET':
        return order_schema.dump(order)
    if request.method == 'PUT':
        data = request.json
        errors = order_schema.validate(data)
        if errors:
            return jsonify(errors), 400
        order.status = data.get('status', order.status)
        db.session.commit()
        return order_schema.dump(order)
    if request.method == 'DELETE':
        db.session.delete(order)
        db.session.commit()
        return '', 204


@api_bp.route('/some_route', methods=['GET'])
@jwt_required()
def some_route():
    user_id = get_jwt_identity()
    
    return jsonify({'user_id': user_id}), 200