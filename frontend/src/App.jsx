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
      <Container>
        <Header onUpload={handleUpload} onLogin={handleLogin} />
        <Box display="flex" flexWrap="wrap" gap={2} sx={{ background: "primary", width: '200px', height: '200px' }}>
          {images.map((url, index) => (
            <Card key={index} sx={{ width: 200, border: `2px solid primary` }}>
              <CardMedia component="img" height="200" image={url} alt="Uploaded" />
            </Card>
          ))}
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default App
