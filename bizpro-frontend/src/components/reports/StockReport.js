import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Typography, Card, Table, TableHead, TableRow, TableCell, TableBody, Grid } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#1976d2", "#26a69a", "#ff7043", "#7e57c2", "#ec407a"];

const StockReport = () => {
  const [report, setReport] = useState({ total_stock: 0, products: [] });

  useEffect(() => {
    api.get("/stock_reports").then(res => setReport(res.data));
  }, []);

  const pieData = report.products.map(p => ({
    name: p.name,
    value: p.stock
  }));

  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="h5">Stock Report</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography>Total Stock: {report.total_stock}</Typography>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={12} md={6}>
          <Table size="small" sx={{ mt: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Supplier ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {report.products.map(p => (
                <TableRow key={p.id}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.stock}</TableCell>
                  <TableCell>{p.supplier_id}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </Card>
  );
};

export default StockReport;