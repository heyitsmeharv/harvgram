import { Box, CircularProgress, Typography } from "@mui/material";
import { styled } from "@mui/system";

const ContentBox = styled(Box)(({ theme }) => ({
  height: "100vh",
  width: "100vw",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: theme.palette.background.main,
}));

const StyledText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.main,
}));



export default function LoadingScreen() {
  return (
    <ContentBox>
      <CircularProgress color="primary" thickness={5} size={60} />
      <StyledText variant="h6" sx={{ mt: 2 }}>
        Loading...
      </StyledText>
    </ContentBox>
  );
}
