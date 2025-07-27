import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Typography, Card, Grid } from "@mui/material";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

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
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={formatData(trends.orders_last_7_days)}>
              <defs>
                <linearGradient id="ordersColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1976d2" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#1976d2" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#1976d2" fill="url(#ordersColor)" />
            </AreaChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1">Postings</Typography>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={formatData(trends.postings_last_7_days)}>
              <defs>
                <linearGradient id="postingsColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#26a69a" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#26a69a" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#26a69a" fill="url(#postingsColor)" />
            </AreaChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1">Bank Transactions</Typography>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={formatData(trends.bank_transactions_last_7_days)}>
              <defs>
                <linearGradient id="bankColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff7043" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ff7043" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#ff7043" fill="url(#bankColor)" />
            </AreaChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </Card>
  );
};

export default TrendInsights;