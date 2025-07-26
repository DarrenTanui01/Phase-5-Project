import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";

const PostingList = () => {
  const [postings, setPostings] = useState([]);

  useEffect(() => {
    api.get("/postings").then(res => setPostings(res.data));
  }, []);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" mb={2}>Posting List</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Description</TableCell>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default PostingList;