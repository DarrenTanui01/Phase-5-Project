import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Typography, Card, Grid } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const SupplierDashboard = () => {
  const [analytics, setAnalytics] = useState([]);
  const [report, setReport] = useState([]);

  useEffect(() => {
    api.get("/supplier_analytics").then(res => setAnalytics(res.data));
    api.get("/supplier_reports").then(res => setReport(res.data));
  }, []);

  return (
    <div>
      <Typography variant="h4" mb={2}>Supplier Dashboard</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">Supplier Analytics</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analytics}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total_stock" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">Supplier Report</Typography>
            <pre>{JSON.stringify(report, null, 2)}</pre>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default SupplierDashboard;