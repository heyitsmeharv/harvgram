import React from "react";
import { Box, Typography, IconButton, CircularProgress } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from "@mui/system";
import { motion } from "framer-motion";
import hdate from "human-date";

const MotionBox = motion(Box);

const CardWrapper = styled(MotionBox)(({ theme }) => ({
  position: 'relative',
  overflow: 'visible',
  borderRadius: '10px',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: theme.shadows[3],
  transition: 'box-shadow 0.3s ease',
  maxWidth: "450px",
  minWidth: "450px",
  maxHeight: "666px",
  '&:hover': {
    boxShadow: theme.shadows[6],
  },
}));

const ImageWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  height: '450px',
  boxShadow: theme.shadows[3],
  transition: 'transform 0.3s ease',

  '&:hover img': {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) scale(1.1)',
    width: '80vw',
    height: 'auto',
    maxHeight: '80vh',
    objectFit: 'contain',
    zIndex: 2000,
    borderRadius: '12px',
    boxShadow: theme.shadows[12],
    backgroundColor: theme.palette.background.paper,
  },
}));

const GalleryImage = styled(motion.img)({
   width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'all 0.5s ease',
  position: 'relative',
  zIndex: 1,
});

const DetailsBox = styled(Box)(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.main,
  marginTop: '-8px',
  borderBottomLeftRadius: '10px',
  borderBottomRightRadius: '10px',
  minHeight: "220px",
}));

const Title = styled(Typography)(({ theme }) => ({
}));

const Description = styled(Typography)(({ theme }) => ({
  margin: "20px 0",
}));

const Date = styled(Typography)(({ theme }) => ({
  position: "absolute",
  bottom: 16,
  left: 16,
}));

const Tags = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(0.5),
}));

const Tag = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[300] : theme.palette.grey[800],
  color: theme.palette.text.primary,
  borderRadius: theme.shape.borderRadius,
  padding: `${theme.spacing(0.5)} ${theme.spacing(1)}`,
  fontSize: "12px",
  fontWeight: 500,
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

const LoadingBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(255,255,255,0.6)",
  borderRadius: theme.shape.borderRadius,
  zIndex: 2,
}));

const GalleryItem = ({ picture, deletingId, deleteImage, queryClient, setDeletingId }) => {
  return (
    <CardWrapper
      key={picture.id}
      position="relative"
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <ImageWrapper>
        <GalleryImage
          src={picture.pictureUrl}
          alt={picture.title}
          style={{ opacity: deletingId === picture.id ? 0.3 : 1 }}
          loading="lazy"
        />
        {deletingId === picture.id && (
          <LoadingBox>
            <CircularProgress color="primary" />
          </LoadingBox>
        )}
      </ImageWrapper>
      <DetailsBox>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Title variant="h6" component="h3" fontWeight={600}>
            {picture.title}
          </Title>
          {picture.tag.filter(Boolean).length > 0 && (
            <Tags>
              {picture.tag.map((tag, index) => (
                <Tag key={index}>
                  <Typography variant="body2">
                    {tag}
                  </Typography>
                </Tag>
              ))}
            </Tags>
          )}
        </Box>
        <Description variant="body2">
          {picture.caption}
        </Description>

        <Date variant="caption" color="text.disabled">
          {hdate.prettyPrint(picture.createdAt)}
        </Date>
        <DeleteButton
          onClick={async () => {
            setDeletingId(picture.id);
            await deleteImage(picture.id, picture.pictureUrl);
            queryClient.invalidateQueries(["pictures"]);
          }}
        >
          <DeleteIcon fontSize="medium" />
        </DeleteButton>
      </DetailsBox>
    </CardWrapper>
  );
};

export default React.memo(GalleryItem);