import React, { useState } from "react";
import { Typography, TextField, Button, Box } from "@mui/material";
import api from "../../api/api";

const PostingForm = ({ onSuccess }) => {
  const [form, setForm] = useState({ type: "", amount: "", date: "", description: "", related_id: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/postings", form);
    setForm({ type: "", amount: "", date: "", description: "", related_id: "" });
    if (onSuccess) onSuccess();
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto" }}>
      <Typography variant="h5" mb={2}>Add/Edit Posting</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Type" name="type" value={form.type} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Amount" name="amount" value={form.amount} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Date" name="date" type="date" value={form.date} onChange={handleChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
        <TextField label="Description" name="description" value={form.description} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Related ID" name="related_id" value={form.related_id} onChange={handleChange} fullWidth margin="normal" />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Submit</Button>
      </form>
    </Box>
  );
};

export default PostingForm;