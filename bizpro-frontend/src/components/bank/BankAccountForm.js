import React, { useState } from "react";
import { Typography, TextField, Button, Box } from "@mui/material";
import api from "../../api/api";

const BankAccountForm = () => {
  const [form, setForm] = useState({ account_name: "", account_number: "", bank_name: "", balance: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/bank_accounts", form);
    setForm({ account_name: "", account_number: "", bank_name: "", balance: "" });
    alert("Bank account added!");
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto" }}>
      <Typography variant="h5" mb={2}>Add/Edit Bank Account</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Account Name" name="account_name" value={form.account_name} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Account Number" name="account_number" value={form.account_number} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Bank Name" name="bank_name" value={form.bank_name} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Balance" name="balance" value={form.balance} onChange={handleChange} fullWidth margin="normal" />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Submit</Button>
      </form>
    </Box>
  );
};

export default BankAccountForm;