import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, Box, TextField } from "@mui/material";
import BankAccountForm from "./BankAccountForm";

const BankAccountList = () => {
  const [accounts, setAccounts] = useState([]);
  const [editAccount, setEditAccount] = useState(null);
  const [form, setForm] = useState({ account_name: "", account_number: "", bank_name: "", balance: "" });
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = () => {
    api.get("/bank_accounts").then(res => setAccounts(res.data));
  };

  const handleEdit = (account) => {
    setEditAccount(account);
    setForm({
      account_name: account.account_name,
      account_number: account.account_number,
      bank_name: account.bank_name,
      balance: account.balance
    });
  };

  const handleDelete = async (id) => {
    await api.delete(`/bank_accounts/${id}`);
    fetchAccounts();
  };

  const handleSave = async () => {
    await api.put(`/bank_accounts/${editAccount.id}`, form);
    setEditAccount(null);
    fetchAccounts();
  };

  return (
    <Paper sx={{ p: 2, filter: openForm ? "blur(4px)" : "none" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5">Bank Accounts</Typography>
        <Button variant="contained" color="primary" onClick={() => setOpenForm(true)}>
          Add Account
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Account Name</TableCell>
            <TableCell>Account Number</TableCell>
            <TableCell>Bank Name</TableCell>
            <TableCell>Balance</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {accounts.map(a => (
            <TableRow key={a.id}>
              <TableCell>{a.id}</TableCell>
              <TableCell>{a.account_name}</TableCell>
              <TableCell>{a.account_number}</TableCell>
              <TableCell>{a.bank_name}</TableCell>
              <TableCell>{a.balance}</TableCell>
              <TableCell>
                <Button size="small" onClick={() => handleEdit(a)}>Edit</Button>
                <Button size="small" color="error" onClick={() => handleDelete(a.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <BankAccountForm onSuccess={() => { setOpenForm(false); fetchAccounts(); }} />
      </Dialog>
      <Dialog open={!!editAccount} onClose={() => setEditAccount(null)}>
        <DialogTitle>Edit Account</DialogTitle>
        <DialogContent>
          <TextField label="Account Name" value={form.account_name} onChange={e => setForm({ ...form, account_name: e.target.value })} fullWidth margin="normal" />
          <TextField label="Account Number" value={form.account_number} onChange={e => setForm({ ...form, account_number: e.target.value })} fullWidth margin="normal" />
          <TextField label="Bank Name" value={form.bank_name} onChange={e => setForm({ ...form, bank_name: e.target.value })} fullWidth margin="normal" />
          <TextField label="Balance" value={form.balance} onChange={e => setForm({ ...form, balance: e.target.value })} fullWidth margin="normal" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditAccount(null)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default BankAccountList;