import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Typography, Card, Grid, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";

const BankDashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [postings, setPostings] = useState([]);

  useEffect(() => {
    api.get("/bank_accounts").then(res => setAccounts(res.data));
    api.get("/bank_transactions").then(res => setTransactions(res.data));
    api.get("/postings").then(res => setPostings(res.data));
  }, []);

  return (
    <div>
      <Typography variant="h4" mb={2}>Bank Dashboard</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">Bank Accounts</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Account Name</TableCell>
                  <TableCell>Bank Name</TableCell>
                  <TableCell>Current Balance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {accounts.map(a => (
                  <TableRow key={a.id}>
                    <TableCell>{a.id}</TableCell>
                    <TableCell>{a.account_name}</TableCell>
                    <TableCell>{a.bank_name}</TableCell>
                    <TableCell>{a.current_balance ?? a.balance}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">Bank Transactions</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Account</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map(t => (
                  <TableRow key={t.id}>
                    <TableCell>{t.id}</TableCell>
                    <TableCell>{t.bank_account_id}</TableCell>
                    <TableCell>{t.transaction_type}</TableCell>
                    <TableCell>{t.amount}</TableCell>
                    <TableCell>{t.date}</TableCell>
                    <TableCell>{t.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">Postings</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Related ID</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {postings.map(p => (
                  <TableRow key={p.id}>
                    <TableCell>{p.id}</TableCell>
                    <TableCell>{p.posting_type}</TableCell>
                    <TableCell>{p.amount}</TableCell>
                    <TableCell>{p.date}</TableCell>
                    <TableCell>{p.description}</TableCell>
                    <TableCell>{p.related_id}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default BankDashboard;