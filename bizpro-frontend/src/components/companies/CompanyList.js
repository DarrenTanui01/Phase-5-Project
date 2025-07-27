import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [editCompany, setEditCompany] = useState(null);
  const [form, setForm] = useState({ name: "", address: "", contact_info: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = () => {
    api.get("/companies").then(res => setCompanies(res.data));
  };

  const handleEdit = (company) => {
    setEditCompany(company);
    setForm({
      name: company.name,
      address: company.address,
      contact_info: company.contact_info
    });
  };

  const handleDelete = async (id) => {
    await api.delete(`/companies/${id}`);
    fetchCompanies();
  };

  const handleSave = async () => {
    await api.put(`/companies/${editCompany.id}`, form);
    setEditCompany(null);
    fetchCompanies();
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5">Company List</Typography>
        <Button variant="contained" color="primary" onClick={() => navigate("/companies/new")}>
          Add Company
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Contact Info</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {companies.map(c => (
            <TableRow key={c.id}>
              <TableCell>{c.id}</TableCell>
              <TableCell>{c.name}</TableCell>
              <TableCell>{c.address}</TableCell>
              <TableCell>{c.contact_info}</TableCell>
              <TableCell>
                <Button size="small" onClick={() => handleEdit(c)}>Edit</Button>
                <Button size="small" color="error" onClick={() => handleDelete(c.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={!!editCompany} onClose={() => setEditCompany(null)}>
        <DialogTitle>Edit Company</DialogTitle>
        <DialogContent>
          <TextField label="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} fullWidth margin="normal" />
          <TextField label="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} fullWidth margin="normal" />
          <TextField label="Contact Info" value={form.contact_info} onChange={e => setForm({ ...form, contact_info: e.target.value })} fullWidth margin="normal" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditCompany(null)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default CompanyList;