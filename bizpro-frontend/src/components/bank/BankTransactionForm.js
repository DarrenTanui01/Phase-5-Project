import React, { useState, useEffect } from "react";
import { Typography, TextField, Button, Box, MenuItem } from "@mui/material";
import api from "../../api/api";

const BankTransactionForm = () => {
  const [form, setForm] = useState({ bank_account_id: "", amount: "", transaction_type: "", date: "", description: "" });
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    api.get("/bank_accounts").then(res => setAccounts(res.data));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/bank_transactions", form);
    setForm({ bank_account_id: "", amount: "", transaction_type: "", date: "", description: "" });
    alert("Bank transaction added!");
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto" }}>
      <Typography variant="h5" mb={2}>Add Bank Transaction</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          select
          label="Account"
          name="bank_account_id"
          value={form.bank_account_id}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          {accounts.map(a => (
            <MenuItem key={a.id} value={a.id}>{a.account_name}</MenuItem>
          ))}
        </TextField>
        <TextField label="Type" name="transaction_type" value={form.transaction_type} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Amount" name="amount" value={form.amount} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Date" name="date" value={form.date} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Description" name="description" value={form.description} onChange={handleChange} fullWidth margin="normal" />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Submit</Button>
      </form>
    </Box>
  );
};

export default BankTransactionForm;