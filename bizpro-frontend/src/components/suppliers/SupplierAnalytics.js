import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Typography, Card } from "@mui/material";

const SupplierAnalytics = () => {
  const [analytics, setAnalytics] = useState([]);

  useEffect(() => {
    api.get("/supplier_analytics").then((res) => setAnalytics(res.data));
  }, []);

  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="h5">Supplier Analytics</Typography>
      <ul>
        {analytics.map((s) => (
          <li key={s.supplier_id}>
            {s.name}: Total Stock: {s.total_stock}, Avg Price: ${s.average_price?.toFixed(2)}
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default SupplierAnalytics;