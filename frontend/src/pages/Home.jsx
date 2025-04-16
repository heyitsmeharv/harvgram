import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { deleteImage } from "../api/api.js";
import { usePictures } from "../hooks/usePictures.js";
import { Box, Button, InputBase, Typography, IconButton } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/system";

// components
import LoadingScreen from "../components/LoadingScreen/LoadingScreen.jsx";
import UploadOverlay from "../components/UploadOverlay/UploadOverlay.jsx";
import GroupedGallery from "../components/GroupedGallery/GroupedGallery.jsx";

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

const StyledButton = styled(Button)(({ theme }) => ({
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

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.button.main,
  color: theme.palette.text.main,
  fontWeight: "bold",
  "&:hover": {
    backgroundColor: theme.palette.button.highlight,
    borderColor: theme.palette.button.border,
    transition: "background-color 0.3s ease",
  }
}));

const GalleryGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(2),
  padding: theme.spacing(3),
}));

const Home = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState(null);
  const { data: pictures, isLoading, error: usePicturesError } = usePictures(search);
  const [deletingId, setDeletingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleOverlaySubmit = () => {
    setShowOverlay(!showOverlay);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

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
        <StyledButton variant="contained" onClick={handleLogout}>
          Logout
        </StyledButton>
        <StyledIconButton>
          <CloudUploadIcon
            onClick={() => setShowOverlay(true)}
          />
        </StyledIconButton>
      </TopBar>
      <GalleryGrid>
        <GroupedGallery pictures={pictures} queryClient={queryClient} deleteImage={deleteImage} deletingId={deletingId} setDeletingId={setDeletingId} />
      </GalleryGrid>
      <UploadOverlay
        open={showOverlay}
        onClose={() => handleOverlaySubmit()}
      />
    </PageContainer >
  );
}

export default Home;