# Getting Started with BizPro React App

This project was bootstrapped with [Create React App]

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).



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

- **Admin:** Full access to all CRUD for users, suppliers, customers, products, companies, and reports. Can read and delete orders, read bank accounts and transactions.
- **Supplier:** Can create suppliers and full CRUD for products.
- **Customer:** Can create customers and full CRUD for their own orders.
- **Bank:** Can create bank accounts, transactions, and postings. No update or delete.
- **Company:** Can access company data and analytics.
- **Other roles:** No access to restricted endpoints.

### Permission Details

- **Suppliers:** Admin can perform all CRUD. Supplier can only create. Others denied.
- **Customers:** Admin can perform all CRUD. Customer can only create. Others denied.
- **Products:** Admin and supplier have full CRUD. Others denied.
- **Orders:** Admin can read and delete. Customer can create, edit, and delete. Others denied.
- **Bank Accounts & Transactions:** Bank can create. Admin can read. Others denied.
- **Reports & Analytics:** Only admin can read. Others denied.

If a user tries to access a forbidden endpoint, a friendly message and padlock icon will be shown.

## Development

- All API logic is in `/backend/views/`
- Routes are registered in `/backend/routes.py`
- App factory in `/backend/app.py`
- Database models in `/backend/models.py`

## Author

Darren Tanui