import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [editCustomer, setEditCustomer] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    api.get("/customers").then(res => setCustomers(res.data));
  };

  const handleEdit = (customer) => {
    setEditCustomer(customer);
    setForm({ name: customer.name, email: customer.email, phone: customer.phone });
  };

  const handleDelete = async (id) => {
    await api.delete(`/customers/${id}`);
    fetchCustomers();
  };

  const handleSave = async () => {
    await api.put(`/customers/${editCustomer.id}`, form);
    setEditCustomer(null);
    fetchCustomers();
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5">Customer List</Typography>
        <Button variant="contained" color="primary" onClick={() => navigate("/customers/new")}>
          Add Customer
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customers.map(c => (
            <TableRow key={c.id}>
              <TableCell>{c.id}</TableCell>
              <TableCell>{c.name}</TableCell>
              <TableCell>{c.email}</TableCell>
              <TableCell>{c.phone}</TableCell>
              <TableCell>
                <Button size="small" onClick={() => handleEdit(c)}>Edit</Button>
                <Button size="small" color="error" onClick={() => handleDelete(c.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={!!editCustomer} onClose={() => setEditCustomer(null)}>
        <DialogTitle>Edit Customer</DialogTitle>
        <DialogContent>
          <TextField label="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} fullWidth margin="normal" />
          <TextField label="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} fullWidth margin="normal" />
          <TextField label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} fullWidth margin="normal" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditCustomer(null)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default CustomerList;