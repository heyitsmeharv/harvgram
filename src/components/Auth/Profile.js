import React, { useState, useEffect } from "react";
// import { useApi } from '../../hooks/use-api';
import { useAuth0 } from "@auth0/auth0-react";
import styled from 'styled-components/macro';

import Login from '../Auth/Login';
import Logout from '../Auth/Logout';

import { Avatar, Badge, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@material-ui/core';

import { PersonCircle } from '@styled-icons/bootstrap/PersonCircle'
import { Camera } from '@styled-icons/boxicons-regular/Camera'
import { LogOut, LogIn } from "@styled-icons/boxicons-regular";

const Icon = styled.span`
  svg {
    width: 25px;
    fill: black;
  }
  @media only screen and (max-width: 375px) {
    margin-right: 10px;
  }
`;

const MenuItemText = styled.button`
  border: 1px solid transparent;
  border-radius: 4px;
  color: black;
  appearance: none;
  background: 0 0;
  border: 0;
  box-sizing: border-box;
  display: block;
  font-weight: 600;
  padding: 5px 9px;
  text-align: center;
  text-overflow: ellipsis;
  cursor: pointer;
`;

const Profile = ({ setUpload, userMetadata }) => {
  const { user, isAuthenticated } = useAuth0();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    isAuthenticated ? (
      <>
        <IconButton
          onClick={handleClick}
        >
          <Badge
            overlap="circle"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            variant="dot"
            css={`
              span {
                background: green;
              }
            `}
          >
            <Avatar style={{ width: '25px', height: '25px' }} alt={user.name} src={user.picture} />
          </Badge>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem>
            <Icon><LogOut /></Icon>
            <Logout />
          </MenuItem>
          <MenuItem onClick={() => setUpload(true)}>
            <Icon><Camera /></Icon>
            <MenuItemText>Upload Picture</MenuItemText>
          </MenuItem>
        </Menu>
      </>
    ) : (
        <>
          <IconButton
            onClick={handleClick}
          >
            <Icon><PersonCircle /></Icon>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem>
              <Icon><LogIn /></Icon>
              <Login />
            </MenuItem>
          </Menu>
        </>
      )
  );
};

export default Profile;