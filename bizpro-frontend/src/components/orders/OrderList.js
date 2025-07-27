import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from "@mui/material";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [editOrder, setEditOrder] = useState(null);
  const [form, setForm] = useState({ customer_id: "", status: "", products: [] });

  useEffect(() => {
    fetchOrders();
    api.get("/customers").then(res => setCustomers(res.data));
  }, []);

  const fetchOrders = () => {
    api.get("/orders").then(res => setOrders(res.data));
  };

  const handleEdit = (order) => {
    setEditOrder(order);
    setForm({
      customer_id: order.customer_id,
      status: order.status,
      products: order.products_with_quantities || []
    });
  };

  const handleDelete = async (id) => {
    await api.delete(`/orders/${id}`);
    fetchOrders();
  };

  const handleSave = async () => {
    await api.put(`/orders/${editOrder.id}`, form);
    setEditOrder(null);
    fetchOrders();
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" mb={2}>Order List</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Products</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map(o => (
            <TableRow key={o.id}>
              <TableCell>{o.id}</TableCell>
              <TableCell>{customers.find(c => c.id === o.customer_id)?.name || o.customer_id}</TableCell>
              <TableCell>{o.status}</TableCell>
              <TableCell>{o.date}</TableCell>
              <TableCell>
                {(o.products_with_quantities || []).map(p => (
                  <div key={p.product_id}>{p.name} x {p.quantity}</div>
                ))}
              </TableCell>
              <TableCell>
                <Button size="small" onClick={() => handleEdit(o)}>Edit</Button>
                <Button size="small" color="error" onClick={() => handleDelete(o.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={!!editOrder} onClose={() => setEditOrder(null)}>
        <DialogTitle>Edit Order</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Customer"
            value={form.customer_id}
            onChange={e => setForm({ ...form, customer_id: e.target.value })}
            fullWidth
            margin="normal"
          >
            {customers.map(c => (
              <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
            ))}
          </TextField>
          <TextField label="Status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} fullWidth margin="normal" />
          {/* For simplicity, editing products is omitted here. Use OrderForm for adding products. */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOrder(null)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default OrderList;