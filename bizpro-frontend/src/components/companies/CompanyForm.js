import React, { useState } from "react";
import { Typography, TextField, Button, Box } from "@mui/material";
import api from "../../api/api";

const CompanyForm = ({ onSuccess }) => {
  const [form, setForm] = useState({ name: "", address: "", contact_info: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/companies", form);
    setForm({ name: "", address: "", contact_info: "" });
    if (onSuccess) onSuccess();
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto" }}>
      <Typography variant="h5" mb={2}>Add/Edit Company</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Address" name="address" value={form.address} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Contact Info" name="contact_info" value={form.contact_info} onChange={handleChange} fullWidth margin="normal" />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Submit</Button>
      </form>
    </Box>
  );
};

export default CompanyForm;