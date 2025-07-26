import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper, Link as MuiLink } from "@mui/material";
import api from "../../api/api";
import useAuth from "../../hooks/useAuth";
import { useNavigate, Link as RouterLink } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/login", form);
      login(res.data.user, res.data.access_token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
      <Paper sx={{ p: 4, minWidth: 320 }}>
        <Typography variant="h5" mb={2}>Login</Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Username" name="username" fullWidth margin="normal" onChange={handleChange} />
          <TextField label="Password" name="password" type="password" fullWidth margin="normal" onChange={handleChange} />
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Login</Button>
        </form>
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <MuiLink component={RouterLink} to="/register" underline="hover">
            Don't have an account? Register
          </MuiLink>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;