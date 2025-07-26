import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Typography, Card, Grid } from "@mui/material";

const CustomerDashboard = () => {
  const [analytics, setAnalytics] = useState([]);
  const [report, setReport] = useState([]);

  useEffect(() => {
    api.get("/customer_finances").then(res => setAnalytics(res.data));
    api.get("/customer_reports").then(res => setReport(res.data));
  }, []);

  return (
    <div>
      <Typography variant="h4" mb={2}>Customer Dashboard</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">Customer Analytics</Typography>
            <ul>
              {analytics.map(c => (
                <li key={c.customer_id}>
                  {c.name}: Orders: {c.total_orders}, Spent: ${c.total_spent}
                </li>
              ))}
            </ul>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">Customer Report</Typography>
            <pre>{JSON.stringify(report, null, 2)}</pre>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default CustomerDashboard;