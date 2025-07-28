import React, { useState, useEffect } from "react";
import { Typography, TextField, Button, Box, MenuItem } from "@mui/material";
import api from "../../api/api";

const ProductForm = ({ onSuccess }) => {
  const [form, setForm] = useState({ name: "", description: "", price: "", stock: "", supplier_id: "" });
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    api.get("/suppliers").then(res => setSuppliers(res.data));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/products", form);
    setForm({ name: "", description: "", price: "", stock: "", supplier_id: "" });
    if (onSuccess) onSuccess();
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto" }}>
      <Typography variant="h5" mb={2}>Add/Edit Product</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Description" name="description" value={form.description} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Price" name="price" value={form.price} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Stock" name="stock" value={form.stock} onChange={handleChange} fullWidth margin="normal" />
        <TextField
          select
          label="Supplier"
          name="supplier_id"
          value={form.supplier_id}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          {suppliers.map(s => (
            <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
          ))}
        </TextField>
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Submit</Button>
      </form>
    </Box>
  );
};

export default ProductForm;