import React, { useState } from "react";
import { Typography, TextField, Button, Box, MenuItem } from "@mui/material";
import api from "../../api/api";

const BankTransactionForm = ({ onSuccess, accounts = [] }) => {
  const [form, setForm] = useState({ account_id: "", type: "", amount: "", date: "", description: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/bank_transactions", form);
    setForm({ account_id: "", type: "", amount: "", date: "", description: "" });
    if (onSuccess) onSuccess();
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto" }}>
      <Typography variant="h5" mb={2}>Add/Edit Bank Transaction</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          select
          label="Account"
          name="account_id"
          value={form.account_id}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          {accounts.map(a => (
            <MenuItem key={a.id} value={a.id}>{a.account_name}</MenuItem>
          ))}
        </TextField>
        <TextField label="Type" name="type" value={form.type} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Amount" name="amount" value={form.amount} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Date" name="date" type="date" value={form.date} onChange={handleChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
        <TextField label="Description" name="description" value={form.description} onChange={handleChange} fullWidth margin="normal" />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Submit</Button>
      </form>
    </Box>
  );
};

export default BankTransactionForm;