import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, Box, TextField, MenuItem } from "@mui/material";
import BankTransactionForm from "./BankTransactionForm";

const BankTransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [editTransaction, setEditTransaction] = useState(null);
  const [form, setForm] = useState({ account_id: "", type: "", amount: "", date: "", description: "" });
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    fetchTransactions();
    api.get("/bank_accounts").then(res => setAccounts(res.data));
  }, []);

  const fetchTransactions = () => {
    api.get("/bank_transactions").then(res => setTransactions(res.data));
  };

  const handleEdit = (transaction) => {
    setEditTransaction(transaction);
    setForm({
      account_id: transaction.account_id,
      type: transaction.type,
      amount: transaction.amount,
      date: transaction.date,
      description: transaction.description
    });
  };

  const handleDelete = async (id) => {
    await api.delete(`/bank_transactions/${id}`);
    fetchTransactions();
  };

  const handleSave = async () => {
    await api.put(`/bank_transactions/${editTransaction.id}`, form);
    setEditTransaction(null);
    fetchTransactions();
  };

  return (
    <Paper sx={{ p: 2, filter: openForm ? "blur(4px)" : "none" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5">Bank Transactions</Typography>
        <Button variant="contained" color="primary" onClick={() => setOpenForm(true)}>
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
              <TableCell>{accounts.find(a => a.id === t.account_id)?.account_name || t.account_id}</TableCell>
              <TableCell>{t.type}</TableCell>
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
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <BankTransactionForm onSuccess={() => { setOpenForm(false); fetchTransactions(); }} accounts={accounts} />
      </Dialog>
      <Dialog open={!!editTransaction} onClose={() => setEditTransaction(null)}>
        <DialogTitle>Edit Transaction</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Account"
            value={form.account_id}
            onChange={e => setForm({ ...form, account_id: e.target.value })}
            fullWidth
            margin="normal"
          >
            {accounts.map(a => (
              <MenuItem key={a.id} value={a.id}>{a.account_name}</MenuItem>
            ))}
          </TextField>
          <TextField label="Type" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} fullWidth margin="normal" />
          <TextField label="Amount" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} fullWidth margin="normal" />
          <TextField label="Date" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
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