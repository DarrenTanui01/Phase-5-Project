import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { Box } from "@mui/material";

const Layout = ({ children }) => (
  <Box sx={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}>
    <Navbar />
    <Box sx={{ display: "flex", flex: 1 }}>
      <Sidebar />
      <Box component="main" sx={{ flex: 1, p: 3, bgcolor: "#f5f6fa" }}>
        {children}
      </Box>
    </Box>
    <Footer />
  </Box>
);

export default Layout;