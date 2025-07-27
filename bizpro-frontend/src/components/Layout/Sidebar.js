import React from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import StoreIcon from "@mui/icons-material/Store";
import AssessmentIcon from "@mui/icons-material/Assessment";
import BusinessIcon from "@mui/icons-material/Business";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const menu = {
  admin: [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
    { text: "Users", icon: <PeopleIcon />, path: "/users" },
    { text: "Suppliers", icon: <StoreIcon />, path: "/suppliers" },
    { text: "Customers", icon: <PeopleIcon />, path: "/customers" },
    { text: "Products", icon: <StoreIcon />, path: "/products" },
    { text: "Orders", icon: <AssessmentIcon />, path: "/orders" },
    { text: "Bank", icon: <AssessmentIcon />, path: "/bank" },
    { text: "Companies", icon: <BusinessIcon />, path: "/companies" },
    { text: "Reports", icon: <AssessmentIcon />, path: "/reports" },
  ],
  supplier: [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/supplier" },
    { text: "Products", icon: <StoreIcon />, path: "/products" },
    { text: "Analytics", icon: <AssessmentIcon />, path: "/supplier-analytics" },
  ],
  customer: [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/customer" },
    { text: "Orders", icon: <AssessmentIcon />, path: "/orders" },
  ],
  bank: [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/bank" },
    { text: "Accounts", icon: <AssessmentIcon />, path: "/bank/accounts" },
    { text: "Transactions", icon: <AssessmentIcon />, path: "/bank/transactions" },
    { text: "Postings", icon: <AssessmentIcon />, path: "/bank/postings" },
  ],
};

const Sidebar = () => {
  const { user } = useAuth();
  if (!user) return null;
  const items = menu[user.role] || [];
  return (
    <Drawer variant="permanent" sx={{ width: 220, flexShrink: 0 }}>
      <List>
        {items.map((item) => (
          <ListItem button key={item.text} component={Link} to={item.path}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;