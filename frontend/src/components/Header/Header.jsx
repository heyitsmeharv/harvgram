import { Box, Button, Typography, AppBar, Toolbar } from "@mui/material";

export const Header = ({ onUpload, onLogin }) => {
  return (
    <AppBar position="fixed" sx={{ backgroundColor: "background.main", width: "100%", top: 0 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ color: "text.primary", fontFamily: "Pacifico, cursive", fontSize: "1.5rem" }}>
          Harvgram
        </Typography>
        <Box>
          <input
            accept="image/*"
            id="upload-button"
            type="file"
            onChange={onUpload}
            style={{ display: "none" }}
          />
          <label htmlFor="upload-button">
            <Button variant="contained" component="span" color="accent" sx={{ marginRight: 2 }}>
              Upload Photo
            </Button>
          </label>
          <Button variant="contained" color="accent" onClick={onLogin}>
            Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};