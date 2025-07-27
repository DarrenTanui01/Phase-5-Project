import React from "react";
import LockIcon from "@mui/icons-material/Lock";
import { Modal, Box, Typography } from "@mui/material";
import ReactDOM from "react-dom";

let modalRoot = document.getElementById("modal-root");
if (!modalRoot) {
  modalRoot = document.createElement("div");
  modalRoot.id = "modal-root";
  document.body.appendChild(modalRoot);
}

export function showPermissionModal(message) {
  const modal = (
    <Modal open={true}>
      <Box sx={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: "background.paper", p: 4, borderRadius: 2, boxShadow: 24,
        display: "flex", flexDirection: "column", alignItems: "center"
      }}>
        <LockIcon sx={{ fontSize: 60, color: "#1976d2", mb: 2 }} />
        <Typography variant="h6" sx={{ mb: 2 }}>{message}</Typography>
      </Box>
    </Modal>
  );
  ReactDOM.render(modal, modalRoot);
  setTimeout(() => ReactDOM.unmountComponentAtNode(modalRoot), 3000);
}