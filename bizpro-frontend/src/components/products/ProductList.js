import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", stock: "", supplier_id: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    api.get("/suppliers").then(res => setSuppliers(res.data));
  }, []);

  const fetchProducts = () => {
    api.get("/products").then(res => setProducts(res.data));
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      supplier_id: product.supplier_id
    });
  };

  const handleDelete = async (id) => {
    await api.delete(`/products/${id}`);
    fetchProducts();
  };

  const handleSave = async () => {
    await api.put(`/products/${editProduct.id}`, form);
    setEditProduct(null);
    fetchProducts();
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5">Product List</Typography>
        <Button variant="contained" color="primary" onClick={() => navigate("/products/new")}>
          Add Product
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell>Supplier</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map(p => (
            <TableRow key={p.id}>
              <TableCell>{p.id}</TableCell>
              <TableCell>{p.name}</TableCell>
              <TableCell>{p.description}</TableCell>
              <TableCell>{p.price}</TableCell>
              <TableCell>{p.stock}</TableCell>
              <TableCell>{suppliers.find(s => s.id === p.supplier_id)?.name || p.supplier_id}</TableCell>
              <TableCell>
                <Button size="small" onClick={() => handleEdit(p)}>Edit</Button>
                <Button size="small" color="error" onClick={() => handleDelete(p.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={!!editProduct} onClose={() => setEditProduct(null)}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <TextField label="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} fullWidth margin="normal" />
          <TextField label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} fullWidth margin="normal" />
          <TextField label="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} fullWidth margin="normal" />
          <TextField label="Stock" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} fullWidth margin="normal" />
          <TextField
            select
            label="Supplier"
            value={form.supplier_id}
            onChange={e => setForm({ ...form, supplier_id: e.target.value })}
            fullWidth
            margin="normal"
          >
            {suppliers.map(s => (
              <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditProduct(null)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ProductList;