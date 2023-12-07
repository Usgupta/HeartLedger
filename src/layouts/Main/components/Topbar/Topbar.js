import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
} from "@mui/material";

import { alpha, useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import { NavItem } from "./components";
import ThemeModeToggler from "components/ThemeModeToggler";
import Login from "web4/Login";

const Topbar = ({ onSidebarOpen, pages, colorInvert = true }) => {
  const theme = useTheme();
  const { mode } = theme.palette;
  const [showRegisterWindow, setShowRegisterWindow] = useState(false);
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("");

  const clickRegister = () => {
    setShowRegisterWindow(true);
  };

  const handleRegister = () => {
    // 这里添加提交注册信息的逻辑
    console.log("address", address, role);
    setShowRegisterWindow(false);
    // navigate('/projects');
  };

  const handleClose = () => {
    setShowRegisterWindow(false);
  };

  // function handleClose(){

  // }

  for (let page of pages) {
    if (page.title === "Register") {
      page.onClick = clickRegister;
    }
  }

  return (
    <Box
      display={"flex"}
      justifyContent={"space-between"}
      alignItems={"center"}
      width={1}
    >
      <Box
        display={"flex"}
        component="a"
        href="/"
        title="HeartLedger"
        width={{ xs: 360, md: 360 }}
      >
        <Box
          component={"img"}
          src={
            mode === "light" && !colorInvert
              ? "https://github.com/Dr-Lazarus/DApp/blob/integration/images/image-removebg-preview%20(4).png?raw=true"
              : "https://github.com/Dr-Lazarus/DApp/blob/integration/images/image-removebg-preview%20(5).png?raw=true"
          }
          height={0.4}
          width={0.4}
        />
      </Box>
      <Box sx={{ display: { xs: "none", md: "flex" } }} alignItems={"center"}>
        <Box>
          <NavItem items={pages} colorInvert={colorInvert} />
        </Box>
        <Box marginLeft={4}>
          <Login />
        </Box>
        <Box marginLeft={4}>
          <ThemeModeToggler />
        </Box>
      </Box>

      <Box sx={{ display: { xs: "flex", md: "none" } }} alignItems={"center"}>
        <Box>
          <Login />
        </Box>
        <Box marginLeft={1}>
          <Button
            onClick={() => onSidebarOpen()}
            aria-label="Menu"
            variant={"outlined"}
            sx={{
              borderRadius: 2,
              minWidth: "auto",
              padding: 1,
              borderColor: alpha(theme.palette.divider, 0.2),
            }}
          >
            <MenuIcon />
          </Button>
        </Box>
      </Box>

      <Dialog open={showRegisterWindow} onClose={handleClose}>
        <DialogTitle>Register</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="address"
            label="Address"
            type="text"
            fullWidth
            variant="outlined"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <TextField
            margin="dense"
            id="role"
            label="Role"
            type="text"
            fullWidth
            variant="outlined"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleRegister}>Register</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

Topbar.propTypes = {
  onSidebarOpen: PropTypes.func,
  pages: PropTypes.array,
  colorInvert: PropTypes.bool,
};

export default Topbar;
