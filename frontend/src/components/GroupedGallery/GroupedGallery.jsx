import { Box, Typography, IconButton, CircularProgress, useTheme } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from "@mui/system";
import hdate from "human-date";
import { format } from "date-fns";

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
  backgroundColor: theme.palette.background.main,
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
  backgroundColor: theme.palette.background.main,
  marginTop: '-8px',
  borderBottomLeftRadius: '10px',
  borderBottomRightRadius: '10px',
}));

const Tags = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(0.5),
  fontSize: "12px",
}));

const Tag = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  color: theme.palette.text.primary,
  borderRadius: theme.shape.borderRadius,
  fontWeight: 500,
  textTransform: 'uppercase',
  padding: `${theme.spacing(1)} ${theme.spacing(1)}`,
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

const GroupedGallery = ({ pictures, deleteImage, queryClient, deletingId, setDeletingId }) => {
  const theme = useTheme();
  const groupByMonth = (items) => {
    return items.reduce((acc, picture) => {
      const key = format(new Date(picture.createdAt), "yyyy/MM");
      if (!acc[key]) acc[key] = [];
      acc[key].push(picture);
      return acc;
    }, {});
  };

  const grouped = groupByMonth(pictures);

  const TAG_COLORS = [
    "#FF6B6B", "#6BCB77", "#4D96FF", "#FFD93D", "#F38BA0", "#9D4EDD", "#43AA8B", "#F4A261"
  ];

  const getTagColor = tag => {
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
      hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % TAG_COLORS.length;
    return TAG_COLORS[index];
  };

  return (
    <Box sx={{ px: 2 }}>
      {Object.entries(grouped).map(([key, items]) => {
        const label = format(new Date(items[0].createdAt), "MMMM yyyy");
        return (
          <Box key={key} sx={{ mb: 6 }}>
            <Typography variant="h5" color={theme.palette.text.secondary} fontFamily="Pacifico, cursive" sx={{ mb: 2 }}>{label}</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {items.map((picture) => (
                <CardWrapper key={picture.id} position="relative">
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
                    <Typography variant="h6" component="h3" fontWeight={600} gutterBottom>
                      {picture.title}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {picture.caption}
                    </Typography>
                    {picture.tag.filter(Boolean).length > 0 && (
                      <Tags>
                        {picture.tag.map((tag, index) => (
                          <Tag key={index} sx={{ backgroundColor: getTagColor(tag) }}>
                            <Typography variant="body2">
                              {tag}
                            </Typography>
                          </Tag>
                        ))}
                      </Tags>
                    )}
                    <Typography variant="caption" color="text.disabled">
                      {hdate.prettyPrint(picture.date)}
                    </Typography>
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
              ))}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

export default GroupedGallery;