import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";

const PostingList = () => {
  const [postings, setPostings] = useState([]);
  const [editPosting, setEditPosting] = useState(null);
  const [form, setForm] = useState({ posting_type: "", amount: "", date: "", description: "", related_id: "" });

  useEffect(() => {
    fetchPostings();
  }, []);

  const fetchPostings = () => {
    api.get("/postings").then(res => setPostings(res.data));
  };

  const handleEdit = (posting) => {
    setEditPosting(posting);
    setForm({
      posting_type: posting.posting_type,
      amount: posting.amount,
      date: posting.date,
      description: posting.description,
      related_id: posting.related_id
    });
  };

  const handleDelete = async (id) => {
    await api.delete(`/postings/${id}`);
    fetchPostings();
  };

  const handleSave = async () => {
    await api.put(`/postings/${editPosting.id}`, form);
    setEditPosting(null);
    fetchPostings();
  };

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
            <TableCell>Related ID</TableCell>
            <TableCell>Actions</TableCell>
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
              <TableCell>
                <Button size="small" onClick={() => handleEdit(p)}>Edit</Button>
                <Button size="small" color="error" onClick={() => handleDelete(p.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={!!editPosting} onClose={() => setEditPosting(null)}>
        <DialogTitle>Edit Posting</DialogTitle>
        <DialogContent>
          <TextField label="Type" value={form.posting_type} onChange={e => setForm({ ...form, posting_type: e.target.value })} fullWidth margin="normal" />
          <TextField label="Amount" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} fullWidth margin="normal" />
          <TextField label="Date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} fullWidth margin="normal" />
          <TextField label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} fullWidth margin="normal" />
          <TextField label="Related ID" value={form.related_id} onChange={e => setForm({ ...form, related_id: e.target.value })} fullWidth margin="normal" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditPosting(null)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default PostingList;