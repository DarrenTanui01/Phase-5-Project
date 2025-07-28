import React, { useState, useEffect } from "react";
import { Typography, TextField, Button, Box, MenuItem, Checkbox, ListItemText, Select, InputLabel, FormControl } from "@mui/material";
import api from "../../api/api";

const OrderForm = ({ onSuccess }) => {
  const [form, setForm] = useState({ customer_id: "", status: "", date: "", product_ids: [] });
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/customers").then(res => setCustomers(res.data));
    api.get("/products").then(res => setProducts(res.data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProductChange = (e) => {
    setForm({ ...form, product_ids: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/orders", form);
    setForm({ customer_id: "", status: "", date: "", product_ids: [] });
    if (onSuccess) onSuccess();
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto" }}>
      <Typography variant="h5" mb={2}>Add/Edit Order</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          select
          label="Customer"
          name="customer_id"
          value={form.customer_id}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          {customers.map(c => (
            <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Status"
          name="status"
          value={form.status}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Date"
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Products</InputLabel>
          <Select
            multiple
            value={form.product_ids}
            onChange={handleProductChange}
            renderValue={selected => selected.map(id => products.find(p => p.id === id)?.name || id).join(", ")}
          >
            {products.map(p => (
              <MenuItem key={p.id} value={p.id}>
                <Checkbox checked={form.product_ids.indexOf(p.id) > -1} />
                <ListItemText primary={p.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Submit</Button>
      </form>
    </Box>
  );
};

export default OrderForm;