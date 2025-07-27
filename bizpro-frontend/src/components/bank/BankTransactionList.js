import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const BankTransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [editTransaction, setEditTransaction] = useState(null);
  const [form, setForm] = useState({ bank_account_id: "", amount: "", transaction_type: "", date: "", description: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
    api.get("/bank_accounts").then(res => setAccounts(res.data));
  }, []);

  const fetchTransactions = () => {
    api.get("/bank_transactions").then(res => setTransactions(res.data));
  };

  const handleEdit = (t) => {
    setEditTransaction(t);
    setForm({
      bank_account_id: t.bank_account_id,
      amount: t.amount,
      transaction_type: t.transaction_type,
      date: t.date,
      description: t.description
    });
  };

  const handleDelete = async (id) => {
    // Only DELETE if your backend supports it
    // await api.delete(`/bank_transactions/${id}`);
    // fetchTransactions();
    alert("Delete not implemented for transactions (usually for audit reasons)");
  };

  const handleSave = async () => {
    // Only PUT if your backend supports it
    // await api.put(`/bank_transactions/${editTransaction.id}`, form);
    // setEditTransaction(null);
    // fetchTransactions();
    alert("Edit not implemented for transactions (usually for audit reasons)");
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5">Bank Transaction List</Typography>
        <Button variant="contained" color="primary" onClick={() => navigate("/bank/transactions/new")}>
          Add Transaction
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Account</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map(t => (
            <TableRow key={t.id}>
              <TableCell>{t.id}</TableCell>
              <TableCell>{accounts.find(a => a.id === t.bank_account_id)?.account_name || t.bank_account_id}</TableCell>
              <TableCell>{t.transaction_type}</TableCell>
              <TableCell>{t.amount}</TableCell>
              <TableCell>{t.date}</TableCell>
              <TableCell>{t.description}</TableCell>
              <TableCell>
                <Button size="small" onClick={() => handleEdit(t)}>Edit</Button>
                <Button size="small" color="error" onClick={() => handleDelete(t.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={!!editTransaction} onClose={() => setEditTransaction(null)}>
        <DialogTitle>Edit Bank Transaction</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Account"
            value={form.bank_account_id}
            onChange={e => setForm({ ...form, bank_account_id: e.target.value })}
            fullWidth
            margin="normal"
          >
            {accounts.map(a => (
              <MenuItem key={a.id} value={a.id}>{a.account_name}</MenuItem>
            ))}
          </TextField>
          <TextField label="Type" value={form.transaction_type} onChange={e => setForm({ ...form, transaction_type: e.target.value })} fullWidth margin="normal" />
          <TextField label="Amount" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} fullWidth margin="normal" />
          <TextField label="Date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} fullWidth margin="normal" />
          <TextField label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} fullWidth margin="normal" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditTransaction(null)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default BankTransactionList;