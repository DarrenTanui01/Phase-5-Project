import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Typography, Card, Grid } from "@mui/material";

const DashboardAnalytics = () => {
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    api.get("/dashboard_analytics").then(res => setAnalytics(res.data));
  }, []);

  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="h5">Dashboard Analytics</Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography>Products: {analytics.num_products}</Typography>
          <Typography>Orders: {analytics.num_orders}</Typography>
          <Typography>Companies: {analytics.num_companies}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>Customers: {analytics.num_customers}</Typography>
          <Typography>Suppliers: {analytics.num_suppliers}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>Total Postings: ${analytics.total_postings}</Typography>
          <Typography>Total Bank Transactions: ${analytics.total_bank_transactions}</Typography>
        </Grid>
      </Grid>
    </Card>
  );
};

export default DashboardAnalytics;