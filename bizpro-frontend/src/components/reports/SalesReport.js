import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Typography, Card, Box, Divider, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["#1976d2", "#26a69a", "#ff7043"];

const SalesReport = () => {
  const [report, setReport] = useState({ total_orders: 0, total_products_sold: 0, total_payments_received: 0, orders: [] });

  useEffect(() => {
    api.get("/sales_reports").then(res => setReport(res.data));
  }, []);

  const barData = [
    { name: "Orders", value: report.total_orders },
    { name: "Products Sold", value: report.total_products_sold },
    { name: "Payments Received", value: report.total_payments_received }
  ];

  const pieData = [
    { name: "Orders", value: report.total_orders },
    { name: "Products Sold", value: report.total_products_sold },
    { name: "Payments Received", value: report.total_payments_received }
  ];

  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="h5" mb={2}>Sales Report</Typography>

      {/* Bar Chart Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" mb={2}>Sales Breakdown (Bar Chart)</Typography>
        <Box sx={{ width: "100%", height: 340 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Pie Chart Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" mb={2}>Sales Distribution (Pie Chart)</Typography>
        <Box sx={{ width: "100%", height: 340 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                {pieData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Tabular Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" mb={2}>Sales Table</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Products Sold</TableCell>
              <TableCell>Payment Received</TableCell>
              <TableCell>Total Due</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(report.orders) && report.orders.length > 0 ? (
              report.orders.map(order => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customer_name}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.products_sold}</TableCell>
                  <TableCell>{order.payment_received}</TableCell>
                  <TableCell>{order.total_due}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">No sales data available</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Summary Cards Section */}
      <Box>
        <Typography variant="h6" mb={2}>Summary</Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Paper sx={{ p: 2, bgcolor: "#1976d2", color: "#fff", textAlign: "center", flex: 1, minWidth: 180 }}>
            <Typography variant="h6">Total Orders</Typography>
            <Typography variant="h4">{report.total_orders}</Typography>
          </Paper>
          <Paper sx={{ p: 2, bgcolor: "#26a69a", color: "#fff", textAlign: "center", flex: 1, minWidth: 180 }}>
            <Typography variant="h6">Products Sold</Typography>
            <Typography variant="h4">{report.total_products_sold}</Typography>
          </Paper>
          <Paper sx={{ p: 2, bgcolor: "#ff7043", color: "#fff", textAlign: "center", flex: 1, minWidth: 180 }}>
            <Typography variant="h6">Payments Received</Typography>
            <Typography variant="h4">${report.total_payments_received}</Typography>
          </Paper>
        </Box>
      </Box>
    </Card>
  );
};

export default SalesReport;