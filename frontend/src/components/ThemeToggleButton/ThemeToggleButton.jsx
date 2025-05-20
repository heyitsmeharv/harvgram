import { useContext } from "react";
import { IconButton, Tooltip, useTheme } from "@mui/material";
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { ThemeContext } from "../../context/ThemeContext";

const ThemeToggleButton = () => {
  const { mode, toggleTheme } = useContext(ThemeContext);
  const theme = useTheme();

  return (
    <Tooltip title={mode === "light" ? "Toggle Dark Mode" : "Toggle Light Mode"}>
      <IconButton color="inherit" onClick={toggleTheme} sx={{ position: "fixed", bottom: 20, left: 20, zIndex: 100, color: theme.palette.background.text }}>
        {mode === "light" ? <DarkModeIcon fontSize="large" /> : <LightModeIcon fontSize="large" />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggleButton;