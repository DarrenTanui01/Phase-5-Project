import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";

const getInitials = (name = "") => {
  const parts = name.split(" ");
  return parts.length === 1
    ? parts[0][0]?.toUpperCase() || ""
    : (parts[0][0] + parts[1][0]).toUpperCase();
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); 
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <AppBar position="static" color="primary" sx={{ zIndex: 1201 }}>
      <Toolbar sx={{ minHeight: 72, px: 3 }}>
        {user && (
          <Button
            onClick={handleBack}
            variant="outlined"
            color="inherit"
            startIcon={<ArrowBackIcon />}
            sx={{
              mr: 3,
              borderColor: "#fff",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              px: 2,
              py: 1,
              '&:hover': { borderColor: "#90caf9", background: "#1565c0" }
            }}
          >
            Back
          </Button>
        )}
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <BusinessCenterIcon sx={{ fontSize: 40, mr: 1, color: "#fff" }} />
          <Typography
            variant="h4"
            sx={{
              fontFamily: "'Montserrat', 'Roboto', 'Segoe UI', sans-serif",
              fontWeight: 700,
              letterSpacing: 2,
              color: "#fff",
              fontSize: { xs: "2rem", md: "2.5rem" },
              textShadow: "0 2px 8px rgba(0,0,0,0.18)"
            }}
          >
            BizPro
          </Typography>
        </Box>
        {user && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar sx={{ bgcolor: "#26a69a", mr: 1, width: 36, height: 36 }}>
              {getInitials(user.username)}
            </Avatar>
            <Typography variant="body1" sx={{ mr: 2 }}>
              {user.username} ({user.role})
            </Typography>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;