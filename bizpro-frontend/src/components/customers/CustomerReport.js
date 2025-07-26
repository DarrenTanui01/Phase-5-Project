import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Typography, Card } from "@mui/material";

const CustomerReport = () => {
  const [report, setReport] = useState([]);

  useEffect(() => {
    api.get("/customer_reports").then((res) => setReport(res.data));
  }, []);

  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="h5">Customer Report</Typography>
      <pre>{JSON.stringify(report, null, 2)}</pre>
    </Card>
  );
};

export default CustomerReport;