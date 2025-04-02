import { createTheme } from "@mui/material/styles";

const theme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: "#1B262C",
    },
    secondary: {
      main: "#0F4C75",
    },
    accent: {
      main: "#3282B8",
    },
    highlight: {
      main: "#BBE1FA",
    },
    error: {
      main: "#D31717"
    },
    background: {
      default: mode === "light" ? "#f5f5f5" : "#121212",
      paper: mode === "light" ? "#ffffff" : "#1e1e1e",
    },
    text: {
      primary: mode === "light" ? "#333" : "#fff",
      secondary: mode === "light" ? "#666" : "#bbb",
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    fontSize: 14,
    h1: { fontSize: "2rem", fontWeight: 600 },
    h2: { fontSize: "1.8rem", fontWeight: 500 },
    h3: { fontSize: "1.6rem", fontWeight: 500 },
  },
  shape: {
    borderRadius: 10,
  },
  shadows: [
    "none",
    "0px 2px 4px rgba(0,0,0,0.1)",  // Shadow level 1
    "0px 3px 6px rgba(0,0,0,0.15)", // Shadow level 2
    "0px 4px 8px rgba(0,0,0,0.2)",  // Shadow level 3 (default)
    "0px 5px 10px rgba(0,0,0,0.25)", 
    "0px 6px 12px rgba(0,0,0,0.3)", 
  ],
  breakpoints: {
    values: {
      xs: 0,   // Mobile
      sm: 600, // Tablet
      md: 960, // Small Desktop
      lg: 1280, // Large Desktop
      xl: 1920, // 4K Screens
    },
  },
});

export default theme;