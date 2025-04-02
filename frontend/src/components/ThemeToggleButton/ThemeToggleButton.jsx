import { useContext } from "react";
import { IconButton, Tooltip } from "@mui/material";
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { ThemeContext } from "../../context/ThemeContext";

const ThemeToggleButton = () => {
  const { mode, toggleTheme } = useContext(ThemeContext);

  return (
    <Tooltip title={mode === "light" ? "Toggle Dark Mode" : "Toggle Light Mode"}>
      <IconButton color="inherit" onClick={toggleTheme} sx={{ position: "fixed", top: 20, right: 20 }}>
        {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggleButton;