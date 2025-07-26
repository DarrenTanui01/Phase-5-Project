import React from "react";
import { Typography, Grid, Card, CardActionArea } from "@mui/material";
import { useNavigate } from "react-router-dom";

const reports = [
  { title: "Stock Report", path: "/reports/stock", color: "#1976d2" },
  { title: "Sales Report", path: "/reports/sales", color: "#ff7043" },
  { title: "Dashboard Analytics", path: "/reports/dashboard", color: "#26a69a" },
  { title: "Trend Insights", path: "/reports/trends", color: "#7e57c2" }
];

const ReportsHome = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Typography variant="h4" mb={2}>Reports</Typography>
      <Grid container spacing={2}>
        {reports.map(r => (
          <Grid item xs={12} md={6} key={r.title}>
            <Card sx={{ bgcolor: r.color, color: "#fff" }}>
              <CardActionArea onClick={() => navigate(r.path)}>
                <Typography variant="h6" sx={{ p: 3 }}>{r.title}</Typography>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ReportsHome;