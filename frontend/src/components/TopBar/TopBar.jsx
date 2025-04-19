import { Box, IconButton, InputBase, Menu, MenuItem, Avatar, Tooltip, Typography, useTheme } from "@mui/material";
import { styled } from "@mui/system";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

const TopBarContainer = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: theme.zIndex.appBar,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  padding: theme.spacing(2, 4),
  backgroundColor: theme.palette.background.main,
  boxShadow: theme.shadows[2],
}));

const SearchBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1),
  width: "100%",

  [theme.breakpoints.up("xs")]: {
    maxWidth: 200,
  },


  [theme.breakpoints.up("sm")]: {
    maxWidth: 400,
  },

  [theme.breakpoints.up("md")]: {
    maxWidth: 600,
  },
}));

const StyledInput = styled(InputBase)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  flex: 1,
  color: theme.palette.text.primary,
}));

const TopBar = ({ onSearch, onLogout, user }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const initial = user?.email.charAt(0).toUpperCase() || "U";

  return (
    <TopBarContainer>
      <Typography variant="h5" align="center" fontWeight="bold" fontFamily="Pacifico, cursive" gutterBottom>
        Harvgram
      </Typography>

      <SearchBox>
        <SearchIcon color="action" />
        <StyledInput
          placeholder="Search by title, tag..."
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </SearchBox>

      <Box>
        <Tooltip title="Profile">
          <IconButton onClick={handleMenuOpen} size="small">
            <Avatar sx={{ width: 32, height: 32, background: theme.palette.text.main }}>{initial}</Avatar>
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => { onLogout(); handleMenuClose(); }}>Logout</MenuItem>
        </Menu>
      </Box>
    </TopBarContainer>
  );
}

export default TopBar;