import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          BizPro
        </Typography>
        {user && (
          <>
            <Typography variant="body1" sx={{ mr: 2 }}>
              {user.username} ({user.role})
            </Typography>
            <Button color="inherit" onClick={logout}>Logout</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;