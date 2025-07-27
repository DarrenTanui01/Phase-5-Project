import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout/Layout"; 
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import SupplierDashboard from "./components/Dashboard/SupplierDashboard";
import CustomerDashboard from "./components/Dashboard/CustomerDashboard";
import BankDashboard from "./components/Dashboard/BankDashboard";
import UserList from "./components/users/UserList";
import SupplierList from "./components/suppliers/SupplierList";
import SupplierForm from "./components/suppliers/SupplierForm";
import SupplierAnalytics from "./components/suppliers/SupplierAnalytics";
import CustomerList from "./components/customers/CustomerList";
import CustomerForm from "./components/customers/CustomerForm";
import CustomerReport from "./components/customers/CustomerReport";
import ProductList from "./components/products/ProductList";
import ProductForm from "./components/products/ProductForm";
import ProductAnalytics from "./components/products/ProductAnalytics";
import OrderList from "./components/orders/OrderList";
import OrderForm from "./components/orders/OrderForm";
import BankAccountList from "./components/bank/BankAccountList";
import BankTransactionList from "./components/bank/BankTransactionList";
import BankTransactionForm from "./components/bank/BankTransactionForm";
import PostingList from "./components/bank/PostingList";
import StockReport from "./components/reports/StockReport";
import SalesReport from "./components/reports/SalesReport";
import DashboardAnalytics from "./components/reports/DashboardAnalytics";
import TrendInsights from "./components/reports/TrendInsights";
import NotFound from "./components/NotFound";
import ReportsHome from "./components/reports/ReportsHome";
import CompanyList from "./components/companies/CompanyList";
import CompanyForm from "./components/companies/CompanyForm";
import './App.css';

function PrivateRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  // If not logged in, redirect to login
  if (!user || !token) return <Navigate to="/login" />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/supplier" element={<SupplierDashboard />} />
                    <Route path="/customer" element={<CustomerDashboard />} />
                    <Route path="/bank" element={<BankDashboard />} />
                    <Route path="/users" element={<UserList />} />
                    <Route path="/suppliers" element={<SupplierList />} />
                    <Route path="/suppliers/new" element={<SupplierForm />} />
                    <Route path="/supplier-analytics" element={<SupplierAnalytics />} />
                    <Route path="/customers" element={<CustomerList />} />
                    <Route path="/customers/new" element={<CustomerForm />} />
                    <Route path="/customer-report" element={<CustomerReport />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/products/new" element={<ProductForm />} />
                    <Route path="/product-analytics" element={<ProductAnalytics />} />
                    <Route path="/orders" element={<OrderList />} />
                    <Route path="/orders/new" element={<OrderForm />} />
                    <Route path="/bank/accounts" element={<BankAccountList />} />
                    <Route path="/bank/transactions" element={<BankTransactionList />} />
                    <Route path="/bank/transactions/new" element={<BankTransactionForm />} />
                    <Route path="/bank/postings" element={<PostingList />} />
                    <Route path="/reports" element={<ReportsHome />} />
                    <Route path="/reports/stock" element={<StockReport />} />
                    <Route path="/reports/sales" element={<SalesReport />} />
                    <Route path="/reports/dashboard" element={<DashboardAnalytics />} />
                    <Route path="/reports/trends" element={<TrendInsights />} />
                    <Route path="/companies" element={<CompanyList />} />
                    <Route path="/companies/new" element={<CompanyForm />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
