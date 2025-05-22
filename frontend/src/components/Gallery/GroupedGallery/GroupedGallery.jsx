import React from "react";
import { AnimatePresence } from "framer-motion";
import { Box, Typography, useTheme } from "@mui/material";
import { format } from "date-fns";

import GalleryItem from "../GalleryItem/GalleryItem";

const GroupedGallery = ({ pictures, filterPictures, search, deleteImage, queryClient, deletingId, setDeletingId, user, setIsEdit, setData, setShowOverlay }) => {
  const theme = useTheme();

  const groupByMonth = (items) => {
    return items?.reduce((acc, picture) => {
      const key = format(new Date(picture.createdAt), "yyyy/MM");
      if (!acc[key]) acc[key] = [];
      acc[key].push(picture);
      return acc;
    }, {});
  };

  const grouped = groupByMonth(filterPictures?.length ? filterPictures : pictures);

  return (
    <Box sx={{ px: 2 }}>
      {pictures?.length === 0 && search !== "" ? (
        <Box
          sx={{
            minHeight: "50vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            color: theme.palette.text.disabled,
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            No results found.
          </Typography>
          <Typography variant="body2">
            Try adjusting your search or filters.
          </Typography>
        </Box>
      ) : (
        Object.entries(grouped).map(([key, items]) => {
          const label = format(new Date(items[0].createdAt), "MMMM yyyy");
          return (
            <Box key={key} sx={{ mb: 6 }}>
              <Typography variant="h5" color={theme.palette.text.main} fontFamily="Pacifico, cursive" sx={{ mb: 2 }}>{label}</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                <AnimatePresence mode="popLayout">
                  {items.map((picture) => (
                    <GalleryItem
                      key={picture.id}
                      picture={picture}
                      deletingId={deletingId}
                      deleteImage={deleteImage}
                      queryClient={queryClient}
                      setDeletingId={setDeletingId}
                      user={user}
                      setIsEdit={setIsEdit}
                      setData={setData}
                      setShowOverlay={setShowOverlay}
                    />
                  ))}
                </AnimatePresence>
              </Box>
            </Box>
          );
        })
      )}
    </Box>
  )
};

export default React.memo(GroupedGallery);