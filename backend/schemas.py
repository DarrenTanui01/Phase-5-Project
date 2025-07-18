from marshmallow import Schema, fields, validate

class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    username = fields.Str(required=True, validate=validate.Length(min=3))
    email = fields.Email(required=True)
    role = fields.Str(required=True)
    password = fields.Str(load_only=True, required=True, validate=validate.Length(min=6))

class SupplierSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    contact_info = fields.Str()
    products = fields.Nested('ProductSchema', many=True, dump_only=True)  

class CustomerSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    contact_info = fields.Str()
    orders = fields.Nested('OrderSchema', many=True, dump_only=True) 

class ProductSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    description = fields.Str()
    price = fields.Float(required=True)
    stock = fields.Int()
    supplier_id = fields.Int(required=True)

class OrderProductSchema(Schema):
    product_id = fields.Int(required=True)
    quantity = fields.Int(required=True)

class OrderSchema(Schema):
    id = fields.Int(dump_only=True)
    customer_id = fields.Int(required=True)
    date = fields.DateTime()
    status = fields.Str()
    products = fields.List(fields.Nested(OrderProductSchema), load_only=True)
    products_with_quantities = fields.Method("get_products_with_quantities", dump_only=True)

    def get_products_with_quantities(self, obj):
        return obj.products_with_quantities()

class RoleSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)

class PermissionSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    role_id = fields.Int()

class BankTransactionSchema(Schema):
    id = fields.Int(dump_only=True)
    bank_account_id = fields.Int(required=True)
    amount = fields.Float(required=True)
    transaction_type = fields.Str(required=True)
    date = fields.DateTime()
    description = fields.Str()

class BankAccountSchema(Schema):
    id = fields.Int(dump_only=True)
    account_name = fields.Str(required=True)
    account_number = fields.Str(required=True)
    bank_name = fields.Str(required=True)
    balance = fields.Float()
    transactions = fields.Nested('BankTransactionSchema', many=True, dump_only=True)  

class PostingSchema(Schema):
    id = fields.Int(dump_only=True)
    posting_type = fields.Str(required=True)
    amount = fields.Float(required=True)
    date = fields.DateTime()
    description = fields.Str()
    related_id = fields.Int()

class CompanySchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    address = fields.Str()
    contact_info = fields.Str()