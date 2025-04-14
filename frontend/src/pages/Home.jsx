import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { deleteImage } from "../api/api.js";
import { usePictures } from "../hooks/usePictures.js";
import { Box, Button, InputBase, Typography, IconButton } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from "@mui/system";
import hdate from "human-date";

// components
import LoadingScreen from "../components/LoadingScreen/LoadingScreen.jsx";
import UploadOverlay from "../components/UploadOverlay/UploadOverlay.jsx";

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
  gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))',
  gap: theme.spacing(2),
  padding: theme.spacing(3),
}));

const ImageWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  height: '450px',
  boxShadow: theme.shadows[3],
  transition: 'transform 0.3s ease',
  '&:hover img': {
    transform: 'scale(1.05)',
  },
}));

const CardWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '10px',
  overflow: 'hidden',
  boxShadow: theme.shadows[3],
  backgroundColor: theme.palette.background.paper,
  transition: 'box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[6],
  },
}));

const GalleryImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.3s ease',
});

const DetailsBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
  marginTop: '-8px',
  borderBottomLeftRadius: '10px',
  borderBottomRightRadius: '10px',
}));

const Tags = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(0.5),
  marginBottom: theme.spacing(1),
}));

const Tag = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  color: theme.palette.text.primary,
  borderRadius: theme.shape.borderRadius,
  padding: `${theme.spacing(0.25)} ${theme.spacing(1)}`,
  fontSize: '0.75rem',
  fontWeight: 500,
  textTransform: 'uppercase',
}));

const DeleteButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: theme.palette.error.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.error.dark,
  },
  padding: theme.spacing(0.5),
}));

const Home = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState(null);
  const { data: pictures, isLoading, error: usePicturesError } = usePictures(search);
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
        {pictures.map((picture) => (
          <CardWrapper key={picture.id} position="relative">
            <ImageWrapper>
              <GalleryImage src={picture.pictureUrl} alt={picture.title} loading="lazy" />
            </ImageWrapper>
            <DetailsBox>
              <Typography variant="h6" component="h3" fontWeight={600} gutterBottom>
                {picture.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {picture.caption}
              </Typography>
              {picture.tags && picture.tags.length > 0 && (
                <Tags>
                  {picture.tags.map((tag, index) => (
                    <Tag key={index}>
                      <Typography variant="caption" component="span">
                        {tag}
                      </Typography>
                    </Tag>
                  ))}
                </Tags>
              )}
              <Typography variant="caption" color="text.disabled">
                {hdate.prettyPrint(picture.date)}
              </Typography>
              <DeleteButton onClick={() => {
                queryClient.invalidateQueries(['pictures']);
                deleteImage(picture.id, picture.pictureUrl)
              }}>
                <DeleteIcon fontSize="small" />
              </DeleteButton>
            </DetailsBox>
          </CardWrapper>
        ))}
      </GalleryGrid>
      <UploadOverlay
        open={showOverlay}
        onClose={() => handleOverlaySubmit()}
      />
    </PageContainer >
  );
}

export default Home;