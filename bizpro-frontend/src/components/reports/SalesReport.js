import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Typography, Card, Grid } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const SalesReport = () => {
  const [report, setReport] = useState({ total_orders: 0, total_products_sold: 0, total_payments_received: 0 });

  useEffect(() => {
    api.get("/sales_reports").then(res => setReport(res.data));
  }, []);

  const barData = [
    { name: "Orders", value: report.total_orders },
    { name: "Products Sold", value: report.total_products_sold },
    { name: "Payments Received", value: report.total_payments_received }
  ];

  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="h5">Sales Report</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography>Total Orders: {report.total_orders}</Typography>
          <Typography>Total Products Sold: {report.total_products_sold}</Typography>
          <Typography>Total Payments Received: ${report.total_payments_received}</Typography>
        </Grid>
      </Grid>
    </Card>
  );
};

export default SalesReport;