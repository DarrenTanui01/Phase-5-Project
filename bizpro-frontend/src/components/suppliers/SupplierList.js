import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [editSupplier, setEditSupplier] = useState(null);
  const [form, setForm] = useState({ name: "", contact_info: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = () => {
    api.get("/suppliers").then(res => setSuppliers(res.data));
  };

  const handleEdit = (supplier) => {
    setEditSupplier(supplier);
    setForm({ name: supplier.name, contact_info: supplier.contact_info });
  };

  const handleDelete = async (id) => {
    await api.delete(`/suppliers/${id}`);
    fetchSuppliers();
  };

  const handleSave = async () => {
    await api.put(`/suppliers/${editSupplier.id}`, form);
    setEditSupplier(null);
    fetchSuppliers();
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5">Supplier List</Typography>
        <Button variant="contained" color="primary" onClick={() => navigate("/suppliers/new")}>
          Add Supplier
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Contact Info</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {suppliers.map(s => (
            <TableRow key={s.id}>
              <TableCell>{s.id}</TableCell>
              <TableCell>{s.name}</TableCell>
              <TableCell>{s.contact_info}</TableCell>
              <TableCell>
                <Button size="small" onClick={() => handleEdit(s)}>Edit</Button>
                <Button size="small" color="error" onClick={() => handleDelete(s.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={!!editSupplier} onClose={() => setEditSupplier(null)}>
        <DialogTitle>Edit Supplier</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Contact Info"
            value={form.contact_info}
            onChange={e => setForm({ ...form, contact_info: e.target.value })}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditSupplier(null)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default SupplierList;