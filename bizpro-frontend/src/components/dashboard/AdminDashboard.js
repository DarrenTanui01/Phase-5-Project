import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Grid, Card, Typography, Box, Paper, Divider } from "@mui/material";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area, CartesianGrid } from "recharts";
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

  // Stacked area chart data
  const stackedTrendData = (() => {
    const orders = data.trend_insights?.orders_last_7_days || {};
    const postings = data.trend_insights?.postings_last_7_days || {};
    const transactions = data.trend_insights?.bank_transactions_last_7_days || {};
    // Get all unique dates
    const allDates = Array.from(new Set([
      ...Object.keys(orders),
      ...Object.keys(postings),
      ...Object.keys(transactions)
    ])).sort();
    // Build array for chart
    return allDates.map(date => ({
      date,
      orders: orders[date] || 0,
      postings: postings[date] || 0,
      transactions: transactions[date] || 0
    }));
  })();

  return (
    <Card sx={{ p: 2 }}>
      {/* Admin Profile Card */}
      <Box sx={{ mb: 4 }}>
        <Paper sx={{ p: 2, bgcolor: "#f5f6fa", color: "#333", textAlign: "left" }}>
          <Typography variant="h6" mb={1}>Admin Profile</Typography>
          <Typography><strong>Username:</strong> {data.admin_profile?.username}</Typography>
          <Typography><strong>Email:</strong> {data.admin_profile?.email}</Typography>
          <Typography><strong>Role:</strong> {data.admin_profile?.role}</Typography>
        </Paper>
      </Box>

      <Typography variant="h4" mb={2}>Admin Dashboard</Typography>

      {/* Summary Cards Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" mb={2}>Summary</Typography>
        <Grid container spacing={2}>
          {summary.map((item, idx) => (
            <Grid item xs={12} md={4} key={item.label}>
              <Paper sx={{ p: 2, bgcolor: item.color, color: "#fff", textAlign: "center" }}>
                <Typography variant="h6">{item.label}</Typography>
                <Typography variant="h4">{item.value}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Stock Distribution by Supplier (Pie Chart) */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" mb={2}>Stock Distribution by Supplier</Typography>
        <Box sx={{ width: "100%", height: 420 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={supplierPieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={170}
                label
              >
                {supplierPieData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Sales Report (Line Chart) */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" mb={2}>Sales Report (Orders & Payments)</Typography>
        <Box sx={{ width: "100%", height: 420 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={customerBarData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="orders" stroke="#1976d2" name="Orders" />
              <Line type="monotone" dataKey="spent" stroke="#ff7043" name="Spent" />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Trends Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" mb={2}>Trends (Last 7 Days)</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1">Order Trends</Typography>
            <Box sx={{ width: "100%", height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formatTrendData(data.trend_insights?.orders_last_7_days)}>
                  <defs>
                    <linearGradient id="ordersColorDash" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1976d2" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#1976d2" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#1976d2" fill="url(#ordersColorDash)" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1">Postings Trends</Typography>
            <Box sx={{ width: "100%", height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formatTrendData(data.trend_insights?.postings_last_7_days)}>
                  <defs>
                    <linearGradient id="postingsColorDash" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#26a69a" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#26a69a" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#26a69a" fill="url(#postingsColorDash)" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1">Bank Transactions Trends</Typography>
            <Box sx={{ width: "100%", height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formatTrendData(data.trend_insights?.bank_transactions_last_7_days)}>
                  <defs>
                    <linearGradient id="bankColorDash" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff7043" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ff7043" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#ff7043" fill="url(#bankColorDash)" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
        </Grid>
        {/* Stacked Area Chart for all trends */}
        <Box sx={{ mt: 4, width: "100%", height: 320 }}>
          <Typography variant="subtitle1" mb={2}>All Trends Comparison (Stacked Area Chart)</Typography>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stackedTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="orders" stackId="1" stroke="#1976d2" fill="#1976d2" fillOpacity={0.4} name="Orders" />
              <Area type="monotone" dataKey="postings" stackId="1" stroke="#26a69a" fill="#26a69a" fillOpacity={0.4} name="Postings" />
              <Area type="monotone" dataKey="transactions" stackId="1" stroke="#ff7043" fill="#ff7043" fillOpacity={0.4} name="Bank Transactions" />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Supplier Analytics Table */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" mb={2}>Supplier Analytics</Typography>
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
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Customer Report Table */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" mb={2}>Customer Report</Typography>
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
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Bank Accounts Table */}
      <Box>
        <Typography variant="h6" mb={2}>Bank Accounts</Typography>
        <DataGrid
          rows={bankTableRows}
          columns={bankTableColumns}
          autoHeight
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </Box>
    </Card>
  );
};

export default AdminDashboard;