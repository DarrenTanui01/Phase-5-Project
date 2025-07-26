import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Typography, Card, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

const StockReport = () => {
  const [report, setReport] = useState({ total_stock: 0, products: [] });

  useEffect(() => {
    api.get("/stock_reports").then(res => setReport(res.data));
  }, []);

  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="h5">Stock Report</Typography>
      <Typography>Total Stock: {report.total_stock}</Typography>
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
    </Card>
  );
};

export default StockReport;