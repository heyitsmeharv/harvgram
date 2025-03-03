import { useState, useEffect } from "react";
import { Button, Container, Card, CardMedia, Box, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./styles/themes/theme.jsx";
import './App.css';

import image from "./assets/profile-portrait.jpeg";

import { Header } from "./components/Header/Header.jsx";
import { Photo } from "./components/Photo/Photo.jsx";

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
            : <Dialog open={!isLoggedIn} onClose={() => setIsLoggedIn(true)}>
              <DialogTitle>Welcome!</DialogTitle>
              <DialogContent>
                <p>Please log in or sign up to continue.</p>
              </DialogContent>
              <DialogActions>
                <Button variant="contained" color="primary">Login</Button>
                <Button variant="contained" color="secondary">Request Access</Button>
                <Button onClick={() => setIsLoggedIn(true)} color="inherit">Close</Button>
              </DialogActions>
            </Dialog>
          }
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default App
