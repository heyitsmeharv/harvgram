import React, { useState, useEffect } from "react";
import { Button, Container, Card, CardMedia, Box } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./styles/themes/theme.jsx";
import './App.css';

import { Header } from "./components/Header/Header.jsx";

function App() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
  };

  const handleUpload = async (event) => {
    console.log("Upload button clicked");
  };

  const handleLogin = () => {
    console.log("Login button clicked");
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh - 64px" }}>
        <Header onUpload={handleUpload} onLogin={handleLogin} />
        <Box sx={{ flexGrow: 1, marginTop: "64px", padding: 2, backgroundColor: "primary.accent" }}>
          <Container sx={{ backgroundColor: "accent.main", flexGrow: 1 }}>
            {images.map((url, index) => (
              {}
            ))}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default App
