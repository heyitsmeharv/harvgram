import { createTheme } from "@mui/material/styles";

const theme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: mode === "light" ? "#000" : "#edf2f4",
      border: mode === "light" ? "#edf2f4" : "#000",
      highlight: mode === "light" ? "#edf2f4" : "#000",
    },
    secondary: {
      main: mode === "light" ? "#FCA311" : "#fff",
      border: mode === "light" ? "#000" : "#f5f5f5",
      highlight: mode === "light" ? "#000" : "#f5f5f5",
    },
    button: {
      main: mode === "light" ? "#FCA311" : "#FCA311",
      border: mode === "light" ? "#000" : "#fff",
      highlight: mode === "light" ? "#f5f5f5" : "#0d1b2a",
    },
    error: {
      main: "#D31717"
    },
    background: {
      main: mode === "light" ? "#f5f5f5" : "#000"
    },
    text: {
      main: mode === "light" ? "#333" : "#fff",
      secondary: mode === "light" ? "#fff" : "#000",
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
    borderRadiusTag: 3,
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