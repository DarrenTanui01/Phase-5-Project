import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Grid, Card, Typography, Box, Paper } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import { DataGrid } from "@mui/x-data-grid";

const COLORS = ["#1976d2", "#26a69a", "#ff7043", "#7e57c2", "#ec407a"];

const AdminDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/users/admin").then((res) => setData(res.data));
  }, []);

  if (!data) return <div>Loading...</div>;

  // Prepare data for charts
  const supplierPieData = Array.isArray(data.supplier_report)
    ? data.supplier_report.map(s => ({
        name: s.name,
        value: Array.isArray(s.products) ? s.products.reduce((sum, p) => sum + (p.stock || 0), 0) : 0
      }))
    : [];

  const customerBarData = Array.isArray(data.customer_report)
    ? data.customer_report.map(c => ({
        name: c.name,
        orders: c.total_orders,
        spent: c.total_spent
      }))
    : [];

  const bankTableRows = Array.isArray(data.bank_accounts)
    ? data.bank_accounts.map((b, idx) => ({
        id: b.id || idx,
        account_name: b.account_name || b.name,
        bank_name: b.bank_name || "",
        balance: b.current_balance ?? b.balance
      }))
    : [];

  const bankTableColumns = [
    { field: "account_name", headerName: "Account Name", flex: 1 },
    { field: "bank_name", headerName: "Bank Name", flex: 1 },
    { field: "balance", headerName: "Balance", flex: 1, type: "number" }
  ];

  // Dashboard summary cards
  const summary = [
    { label: "Products", value: data.dashboard_analytics?.num_products, color: "#1976d2" },
    { label: "Orders", value: data.dashboard_analytics?.num_orders, color: "#26a69a" },
    { label: "Companies", value: data.dashboard_analytics?.num_companies, color: "#ff7043" },
    { label: "Customers", value: data.dashboard_analytics?.num_customers, color: "#7e57c2" },
    { label: "Suppliers", value: data.dashboard_analytics?.num_suppliers, color: "#ec407a" },
    { label: "Total Postings", value: data.dashboard_analytics?.total_postings, color: "#8bc34a" },
    { label: "Total Bank Transactions", value: data.dashboard_analytics?.total_bank_transactions, color: "#fbc02d" }
  ];

  // Trend data
  const formatTrendData = (obj) =>
    obj ? Object.entries(obj).map(([date, value]) => ({ date, value })) : [];

  return (
    <Box>
      <Typography variant="h4" mb={2}>Admin Dashboard</Typography>
      <Grid container spacing={2}>
        {/* Dashboard summary cards */}
        {summary.map((item, idx) => (
          <Grid item xs={12} md={4} key={item.label}>
            <Paper sx={{ p: 2, bgcolor: item.color, color: "#fff", textAlign: "center" }}>
              <Typography variant="h6">{item.label}</Typography>
              <Typography variant="h4">{item.value}</Typography>
            </Paper>
          </Grid>
        ))}

        {/* Stock Distribution by Supplier (Pie Chart) */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">Stock Distribution by Supplier</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={supplierPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {supplierPieData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Sales Report (Line Chart) */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">Sales Report (Orders & Payments)</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={customerBarData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="orders" stroke="#1976d2" name="Orders" />
                <Line type="monotone" dataKey="spent" stroke="#ff7043" name="Spent" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Trends (Last 7 Days) */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">Order Trends (Last 7 Days)</Typography>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={formatTrendData(data.trend_insights?.orders_last_7_days)}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#1976d2" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">Postings Trends (Last 7 Days)</Typography>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={formatTrendData(data.trend_insights?.postings_last_7_days)}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#26a69a" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">Bank Transactions Trends (Last 7 Days)</Typography>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={formatTrendData(data.trend_insights?.bank_transactions_last_7_days)}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#ff7043" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Supplier Analytics Table */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">Supplier Analytics</Typography>
            <DataGrid
              rows={Array.isArray(data.supplier_analytics) ? data.supplier_analytics.map((s, idx) => ({
                id: s.supplier_id || idx,
                name: s.name,
                total_stock: s.total_stock,
                average_price: s.average_price
              })) : []}
              columns={[
                { field: "name", headerName: "Supplier", flex: 1 },
                { field: "total_stock", headerName: "Total Stock", flex: 1, type: "number" },
                { field: "average_price", headerName: "Avg Price", flex: 1, type: "number" }
              ]}
              autoHeight
              pageSize={5}
              rowsPerPageOptions={[5]}
            />
          </Card>
        </Grid>

        {/* Customer Report Table */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">Customer Report</Typography>
            <DataGrid
              rows={Array.isArray(data.customer_report) ? data.customer_report.map((c, idx) => ({
                id: c.customer_id || idx,
                name: c.name,
                total_orders: c.total_orders,
                total_spent: c.total_spent
              })) : []}
              columns={[
                { field: "name", headerName: "Customer", flex: 1 },
                { field: "total_orders", headerName: "Orders", flex: 1, type: "number" },
                { field: "total_spent", headerName: "Spent", flex: 1, type: "number" }
              ]}
              autoHeight
              pageSize={5}
              rowsPerPageOptions={[5]}
            />
          </Card>
        </Grid>

        {/* Bank Accounts Table */}
        <Grid item xs={12}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">Bank Accounts</Typography>
            <DataGrid
              rows={bankTableRows}
              columns={bankTableColumns}
              autoHeight
              pageSize={5}
              rowsPerPageOptions={[5]}
            />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;