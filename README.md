# BizPro Backend

A Flask-based backend for managing users, suppliers, customers, products, orders, bank accounts, and analytics for a business platform.

## Features

- User authentication (JWT)
- Role-based access control (admin, supplier, customer, bank, company)
- CRUD operations for users, suppliers, customers, products, orders, bank accounts
- Financial transactions and postings
- Analytics and reporting endpoints for admins
- Modular API structure using Flask MethodViews

## Getting Started

### Requirements

- Python 3.8+
- Flask
- Flask-JWT-Extended
- Flask-SQLAlchemy
- Marshmallow

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/DarrenTanui01/Phase-5-Project.git
   cd Phase-5-Project/backend
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Set environment variables (optional):
   ```
   set JWT_SECRET_KEY=your-secret-key
   ```

### Configuration

- Edit `config.py` for database and JWT settings.
- Default DB: SQLite (`bizpro.db`).

### Running the Server

```
python run.py
```

Server runs at `http://localhost:5000/api/`

## API Endpoints

### Authentication

- `POST /api/register` — Register a new user
- `POST /api/login` — Login and get JWT token

### Users

- `GET /api/users` — List all users (admin only)
- `GET /api/users/<user_id>` — Get user by ID (admin only)
- `DELETE /api/users/<user_id>` — Delete user (admin only)

### Admin Dashboard

- `GET /api/users/admin` — Get admin profile, all reports, analytics, supplier/customer/bank data (admin only)

### Suppliers

- `GET /api/suppliers` — List suppliers
- `POST /api/suppliers` — Create supplier
- `GET /api/suppliers/<supplier_id>` — Get supplier by ID
- `PUT /api/suppliers/<supplier_id>` — Update supplier
- `DELETE /api/suppliers/<supplier_id>` — Delete supplier

### Customers

- `GET /api/customers` — List customers
- `POST /api/customers` — Create customer
- `GET /api/customers/<customer_id>` — Get customer by ID
- `PUT /api/customers/<customer_id>` — Update customer
- `DELETE /api/customers/<customer_id>` — Delete customer

### Products

- `GET /api/products` — List products
- `POST /api/products` — Create product
- `GET /api/products/<product_id>` — Get product by ID
- `PUT /api/products/<product_id>` — Update product
- `DELETE /api/products/<product_id>` — Delete product

### Orders

- `GET /api/orders` — List orders
- `POST /api/orders` — Create order
- `GET /api/orders/<order_id>` — Get order by ID
- `PUT /api/orders/<order_id>` — Update order
- `DELETE /api/orders/<order_id>` — Delete order

### Bank Accounts & Transactions

- `GET /api/bank_accounts` — List bank accounts
- `POST /api/bank_accounts` — Create bank account
- `GET /api/bank_accounts/<account_id>` — Get bank account by ID
- `PUT /api/bank_accounts/<account_id>` — Update bank account
- `DELETE /api/bank_accounts/<account_id>` — Delete bank account

- `GET /api/bank_transactions` — List bank transactions
- `POST /api/bank_transactions` — Create bank transaction

- `GET /api/postings` — List postings
- `POST /api/postings` — Create posting

### Reports & Analytics

- `GET /api/stock_reports` — Stock report
- `GET /api/stock_analysis` — Stock analysis
- `GET /api/sales_reports` — Sales report
- `GET /api/dashboard_analytics` — Dashboard analytics
- `GET /api/trend_insights` — Trend insights

- `GET /api/supplier_reports` — Supplier report
- `GET /api/supplier_analytics` — Supplier analytics

- `GET /api/customer_reports` — Customer report

## Models

- User, Supplier, Customer, Product, Order, Role, Permission, BankAccount, BankTransaction, Posting, Company

## Schemas

- Marshmallow schemas for serialization and validation

## Role-Based Access

- Admin: Full access
- Supplier: Supplier data and products
- Customer: Customer data and orders
- Bank: Bank accounts and transactions
- Company: Company data and analytics

## Development

- All API logic is in `/backend/views/`
- Routes are registered in `/backend/routes.py`
- App factory in `/backend/app.py`
- Database models in `/backend/models.py`

## Author

Darren Tanui