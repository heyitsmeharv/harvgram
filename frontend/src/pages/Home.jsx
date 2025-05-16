import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { deleteImage } from "../api/api.js";
import { usePictures } from "../hooks/usePictures.js";
import { useDebounce } from "../hooks/useDebounce";
import { Box, IconButton, Tooltip, useTheme } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/system";
import { motion } from "framer-motion";

// components
import TopBar from "../components/TopBar/TopBar.jsx";
import LoadingScreen from "../components/LoadingScreen/LoadingScreen.jsx";
import UploadOverlay from "../components/UploadOverlay/UploadOverlay.jsx";
import GroupedGallery from "../components/Gallery/GroupedGallery/GroupedGallery.jsx";

const MotionBox = motion(Box);

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

const PageContainer = styled(MotionBox)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  overflowY: "auto",
}));

const GalleryGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(2),
  padding: theme.spacing(3),
  marginTop: "100px",
}));

const Home = () => {
  const theme = useTheme();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const { data: pictures, isLoading, error: usePicturesError } = usePictures(debouncedSearch);
  const [deletingId, setDeletingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);

  const filterPictures = useMemo(() => {
    if (!debouncedSearch.trim()) return pictures;
    return pictures?.filter((picture) => {
      const query = debouncedSearch.toLowerCase();
      return (
        picture.title?.toLowerCase().includes(query) ||
        picture.caption?.toLowerCase().includes(query) ||
        (picture.tag && picture.tag.some((tag) => tag.toLowerCase().includes(query)))
      );
    });
  }, [pictures, debouncedSearch]);

  const handleLogout = () => {
    logout(queryClient);
  };

  const handleOverlay = () => {
    setShowOverlay(!showOverlay);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <PageContainer
      animate={{
        background: theme.palette.mode === "light"
          ? "linear-gradient(to bottom, #f5f7fa, #c3cfe2)"
          : "linear-gradient(to bottom, #232526, #414345)",
      }}
      transition={{ duration: 0.5 }}
    >
      <TopBar search={search} setSearch={setSearch} onLogout={handleLogout} user={user} />
      <GalleryGrid>
        <GroupedGallery pictures={pictures ? pictures : []} filterPictures={filterPictures} search={search} queryClient={queryClient} deleteImage={deleteImage} deletingId={deletingId} setDeletingId={setDeletingId} />
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