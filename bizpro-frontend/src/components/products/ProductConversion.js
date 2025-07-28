import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, MenuItem, Button, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import api from "../../api/api";

const ProductConversion = ({ role }) => {
  const [products, setProducts] = useState([]);
  const [conversions, setConversions] = useState([]);
  const [form, setForm] = useState({ from_product_id: "", to_product_id: "", quantity: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/products").then(res => setProducts(res.data));
    if (role === "admin") {
      api.get("/product_conversions").then(res => setConversions(res.data));
    }
  }, [role]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/product_conversions", form);
      setForm({ from_product_id: "", to_product_id: "", quantity: "" });
      // Optionally refresh products/conversions
      api.get("/products").then(res => setProducts(res.data));
    } catch (err) {
      setError(err.response?.data?.error || "Conversion failed");
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
      <Typography variant="h5" mb={2}>Product Conversion</Typography>
      {role === "supplier" && (
        <form onSubmit={handleSubmit}>
          <TextField
            select
            label="From Product"
            name="from_product_id"
            value={form.from_product_id}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            {products.map(p => (
              <MenuItem key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="To Product"
            name="to_product_id"
            value={form.to_product_id}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            {products.map(p => (
              <MenuItem key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Quantity"
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Convert</Button>
        </form>
      )}
      {role === "admin" && (
        <Paper sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ p: 2 }}>Product Conversion List</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Stock</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {conversions.map(c => (
                <TableRow key={c.product_id}>
                  <TableCell>{c.product_id}</TableCell>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.stock}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
      {role !== "admin" && role !== "supplier" && (
        <Typography color="error" sx={{ mt: 2 }}>You do not have permission to access product conversions.</Typography>
      )}
    </Box>
  );
};

export default ProductConversion;