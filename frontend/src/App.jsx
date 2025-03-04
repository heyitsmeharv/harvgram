import { useState, useEffect } from "react";
import { Button, Container, Card, CardMedia, Box, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { styled } from "@mui/system";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./styles/themes/theme.jsx";
import './App.css';

import image from "./assets/profile-portrait.jpeg";

import { Header } from "./components/Header/Header.jsx";
import { Photo } from "./components/Photo/Photo.jsx";

const StyledDialog = styled(Dialog)({
  "& .MuiPaper-root": {
    borderRadius: "16px",
    padding: "20px",
    background: "#ffffff",
    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
    textAlign: "center"
  }
});

const StyledButton = styled(Button)({
  padding: "10px 20px",
  borderRadius: "8px",
  fontWeight: "bold",
  textTransform: "none",
  boxShadow: "none"
});

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [images, setImages] = useState([{ id: 1, date: '20/02/2025', pictureUrl: image, title: "test", tag: "test", caption: "test" }]);

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
          {isLoggedIn ?
            <Container sx={{ flexGrow: 1 }}>
              {images.map(img => {
                return <Photo key={img.id} date={img.createdAt} image={img.pictureUrl} title={img.title} tag={img.tag} caption={img.caption} />
              })}
            </Container>
            : <StyledDialog open={!isLoggedIn} onClose={() => setIsLoggedIn(true)}>
              <DialogTitle style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Welcome!</DialogTitle>
              <DialogContent>
                <p style={{ color: "#666", marginBottom: "20px" }}>Please log in or request access to continue.</p>
              </DialogContent>
              <DialogActions style={{ justifyContent: "center" }}>
                <StyledButton variant="contained" color="primary">Login</StyledButton>
                <StyledButton variant="contained" color="secondary">Request Access</StyledButton>
                <StyledButton onClick={() => setIsLoggedIn(true)} color="inherit">Close</StyledButton>
              </DialogActions>
            </StyledDialog>
          }
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default App
