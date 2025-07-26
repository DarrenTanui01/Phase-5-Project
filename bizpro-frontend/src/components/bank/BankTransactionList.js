import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";

const BankTransactionList = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    api.get("/bank_transactions").then(res => setTransactions(res.data));
  }, []);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" mb={2}>Bank Transaction List</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Account</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map(t => (
            <TableRow key={t.id}>
              <TableCell>{t.id}</TableCell>
              <TableCell>{t.account_name}</TableCell>
              <TableCell>{t.amount}</TableCell>
              <TableCell>{t.date}</TableCell>
              <TableCell>{t.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default BankTransactionList;