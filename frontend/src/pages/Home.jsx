import { Box, Button, InputBase, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const PageContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  background: theme.palette.primary.main,
  transition: "background-color 0.3s ease",
}));

const TopBar = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-evenly",
  alignItems: "center",
  padding: theme.spacing(2),
  background: theme.palette.background.main,
  color: theme.palette.text.primary,
  transition: "background-color 0.3s ease",
}));

const SearchInput = styled(InputBase)(({ theme }) => ({
  color: theme.palette.text.main,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1, 2),
  flex: 0.2,
  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(2),
  minWidth: "220px"
}));

const LogoutButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.button.main,
  color: theme.palette.text.main,
  borderColor: theme.palette.button.border,
  border: "2px solid",
  fontWeight: "bold",
  "&:hover": {
    backgroundColor: theme.palette.button.highlight,
    borderColor: theme.palette.button.border,
    transition: "background-color 0.3s ease",
  }
}));

const GalleryGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
  gap: theme.spacing(2),
  padding: theme.spacing(3),
}));

const GalleryImage = styled("img")(({ theme }) => ({
  width: "100%",
  height: "auto",
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

const Home = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const images = [];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <PageContainer>
      <TopBar>
        <Typography variant="h5" align="center" fontWeight="bold" fontFamily="Pacifico, cursive" gutterBottom>
          Harvgram
        </Typography>
        <SearchInput
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Typography variant="body1" sx={{ mr: 2 }}>
          {user?.email}
        </Typography>
        <LogoutButton variant="contained" onClick={handleLogout}>
          Logout
        </LogoutButton>
      </TopBar>
      <GalleryGrid>
        {images.map((src, index) => (
          <GalleryImage key={index} src={src} alt={`Gallery ${index}`} />
        ))}
      </GalleryGrid>
    </PageContainer>
  );
}

export default Home;