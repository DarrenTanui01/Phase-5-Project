import React, { useState, useEffect } from "react";
import { Typography, TextField, Button, MenuItem, Box } from "@mui/material";
import api from "../../api/api";

const OrderForm = () => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    customer_id: "",
    products: [],
    status: "pending"
  });

  useEffect(() => {
    api.get("/customers").then(res => setCustomers(res.data));
    api.get("/products").then(res => setProducts(res.data));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleProductChange = (index, field, value) => {
    const updated = [...form.products];
    updated[index][field] = value;
    setForm({ ...form, products: updated });
  };

  const addProduct = () => {
    setForm({ ...form, products: [...form.products, { product_id: "", quantity: 1 }] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/orders", form);
    setForm({ customer_id: "", products: [], status: "pending" });
    alert("Order created!");
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto" }}>
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
        {form.products.map((prod, idx) => (
          <Box key={idx} sx={{ display: "flex", gap: 2, mb: 1 }}>
            <TextField
              select
              label="Product"
              value={prod.product_id}
              onChange={e => handleProductChange(idx, "product_id", e.target.value)}
              sx={{ flex: 2 }}
            >
              {products.map(p => (
                <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Quantity"
              type="number"
              value={prod.quantity}
              onChange={e => handleProductChange(idx, "quantity", e.target.value)}
              sx={{ flex: 1 }}
            />
          </Box>
        ))}
        <Button onClick={addProduct} sx={{ mb: 2 }}>Add Product</Button>
        <TextField
          label="Status"
          name="status"
          value={form.status}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Submit</Button>
      </form>
    </Box>
  );
};

export default OrderForm;