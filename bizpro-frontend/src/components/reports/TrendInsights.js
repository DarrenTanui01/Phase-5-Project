import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Typography, Card, Grid } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const TrendInsights = () => {
  const [trends, setTrends] = useState({
    orders_last_7_days: {},
    postings_last_7_days: {},
    bank_transactions_last_7_days: {}
  });

  useEffect(() => {
    api.get("/trend_insights").then(res => setTrends(res.data));
  }, []);

  const formatData = (obj) =>
    Object.entries(obj).map(([date, value]) => ({ date, value }));

  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="h5">Trend Insights (Last 7 Days)</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1">Orders</Typography>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={formatData(trends.orders_last_7_days)}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1">Postings</Typography>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={formatData(trends.postings_last_7_days)}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#26a69a" />
            </BarChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1">Bank Transactions</Typography>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={formatData(trends.bank_transactions_last_7_days)}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#ff7043" />
            </BarChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </Card>
  );
};

export default TrendInsights;