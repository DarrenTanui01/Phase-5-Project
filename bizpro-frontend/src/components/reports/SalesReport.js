import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Typography, Card } from "@mui/material";

const SalesReport = () => {
  const [report, setReport] = useState({ total_orders: 0, total_products_sold: 0, total_payments_received: 0 });

  useEffect(() => {
    api.get("/sales_reports").then(res => setReport(res.data));
  }, []);

  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="h5">Sales Report</Typography>
      <Typography>Total Orders: {report.total_orders}</Typography>
      <Typography>Total Products Sold: {report.total_products_sold}</Typography>
      <Typography>Total Payments Received: ${report.total_payments_received}</Typography>
    </Card>
  );
};

export default SalesReport;