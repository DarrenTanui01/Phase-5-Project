import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Typography, Card, Grid, Paper } from "@mui/material";

const DashboardAnalytics = () => {
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    api.get("/dashboard_analytics").then(res => setAnalytics(res.data));
  }, []);

  const summary = [
    { label: "Products", value: analytics.num_products, color: "#1976d2" },
    { label: "Orders", value: analytics.num_orders, color: "#26a69a" },
    { label: "Companies", value: analytics.num_companies, color: "#ff7043" },
    { label: "Customers", value: analytics.num_customers, color: "#7e57c2" },
    { label: "Suppliers", value: analytics.num_suppliers, color: "#ec407a" },
    { label: "Total Postings", value: analytics.total_postings, color: "#8bc34a" },
    { label: "Total Bank Transactions", value: analytics.total_bank_transactions, color: "#fbc02d" }
  ];

  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="h5">Dashboard Analytics</Typography>
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
    </Card>
  );
};

export default DashboardAnalytics;