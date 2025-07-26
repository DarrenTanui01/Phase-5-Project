import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => (
  <Box sx={{ bgcolor: "#1976d2", color: "#fff", p: 2, textAlign: "center" }}>
    <Typography variant="body2">© {new Date().getFullYear()} BizPro. All rights reserved.</Typography>
  </Box>
);

export default Footer;