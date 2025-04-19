import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { deleteImage } from "../api/api.js";
import { usePictures } from "../hooks/usePictures.js";
import { Box, Button, InputBase, Typography, IconButton, Tooltip } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/system";

// components
import TopBar from "../components/TopBar/TopBar.jsx";
import LoadingScreen from "../components/LoadingScreen/LoadingScreen.jsx";
import UploadOverlay from "../components/UploadOverlay/UploadOverlay.jsx";
import GroupedGallery from "../components/GroupedGallery/GroupedGallery.jsx";


const FloatingButton = styled(IconButton)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  zIndex: 999,
  color: theme.palette.background.main,
  boxShadow: theme.shadows[6],
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const PageContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  overflowY: "auto",
  background: theme.palette.primary.main,
  transition: "background-color 0.3s ease",
}));

const GalleryGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(2),
  padding: theme.spacing(3),
  marginTop: "100px",
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
    logout(queryClient);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.elements.search.value;
    setSearch(query);
  };

  const handleOverlay = () => {
    setShowOverlay(!showOverlay);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <PageContainer>
      <TopBar onSearch={handleSearch} onLogout={handleLogout} user={user} />
      <GalleryGrid>
        <GroupedGallery pictures={pictures} queryClient={queryClient} deleteImage={deleteImage} deletingId={deletingId} setDeletingId={setDeletingId} />
      </GalleryGrid>
      <UploadOverlay
        open={showOverlay}
        onClose={() => handleOverlay()}
      />
      <Tooltip title="Upload">
        <FloatingButton onClick={() => setShowOverlay(true)}>
          <CloudUploadIcon fontSize="large" />
        </FloatingButton>
      </Tooltip>
    </PageContainer >
  );
}

export default Home;