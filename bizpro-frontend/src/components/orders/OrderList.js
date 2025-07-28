import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, Box } from "@mui/material";
import OrderForm from "./OrderForm";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [editOrder, setEditOrder] = useState(null);
  const [form, setForm] = useState({ customer_id: "", status: "", date: "", product_ids: [] });
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    fetchOrders();
    api.get("/customers").then(res => setCustomers(res.data));
    api.get("/products").then(res => setProducts(res.data));
  }, []);

  const fetchOrders = () => {
    api.get("/orders").then(res => setOrders(res.data));
  };

  const handleEdit = (order) => {
    setEditOrder(order);
    setForm({
      customer_id: order.customer_id,
      status: order.status,
      date: order.date,
      product_ids: order.product_ids || []
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
    <Paper sx={{ p: 2, filter: openForm ? "blur(4px)" : "none" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5">Order List</Typography>
        <Button variant="contained" color="primary" onClick={() => setOpenForm(true)}>
          Add Order
        </Button>
      </Box>
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
                {(o.product_ids || []).map(pid => products.find(p => p.id === pid)?.name || pid).join(", ")}
              </TableCell>
              <TableCell>
                <Button size="small" onClick={() => handleEdit(o)}>Edit</Button>
                <Button size="small" color="error" onClick={() => handleDelete(o.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <OrderForm onSuccess={() => { setOpenForm(false); fetchOrders(); }} />
      </Dialog>
      <Dialog open={!!editOrder} onClose={() => setEditOrder(null)}>
        <DialogTitle>Edit Order</DialogTitle>
        <DialogContent>
          {/* You can add form fields for editing here, similar to OrderForm */}
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