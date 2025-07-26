import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Typography, Card } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#1976d2", "#26a69a", "#ff7043", "#7e57c2", "#ec407a"];

const ProductAnalytics = () => {
  const [analysis, setAnalysis] = useState({ average_price: 0, low_stock_products: [] });

  useEffect(() => {
    api.get("/stock_analysis").then(res => setAnalysis(res.data));
  }, []);

  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="h5">Product Analytics</Typography>
      <Typography>Average Price: ${analysis.average_price?.toFixed(2)}</Typography>
      <Typography mt={2}>Low Stock Products:</Typography>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={analysis.low_stock_products}
            dataKey="stock"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={60}
            fill="#8884d8"
            label
          >
            {analysis.low_stock_products.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default ProductAnalytics;