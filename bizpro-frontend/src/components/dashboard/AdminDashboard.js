import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Grid, Card, Typography, Box } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const AdminDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/users/admin").then((res) => setData(res.data));
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <Box>
      <Typography variant="h4" mb={2}>Admin Dashboard</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">Stock Report</Typography>
            <pre>{JSON.stringify(data.stock_report, null, 2)}</pre>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">Sales Report</Typography>
            <pre>{JSON.stringify(data.sales_report, null, 2)}</pre>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">Trends (Last 7 Days)</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={Object.entries(data.trend_insights.orders_last_7_days).map(([date, count]) => ({ date, count }))}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">Supplier Report</Typography>
            <pre>{JSON.stringify(data.supplier_report, null, 2)}</pre>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">Supplier Analytics</Typography>
            <pre>{JSON.stringify(data.supplier_analytics, null, 2)}</pre>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">Customer Report</Typography>
            <pre>{JSON.stringify(data.customer_report, null, 2)}</pre>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">Bank Accounts</Typography>
            <pre>{JSON.stringify(data.bank_accounts, null, 2)}</pre>
          </Card>
        </Grid>
        {/* Add more cards as needed */}
      </Grid>
    </Box>
  );
};

export default AdminDashboard;