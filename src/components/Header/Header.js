import React, { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import styled from 'styled-components/macro';

import {
  Box,
} from "@material-ui/core";

import Profile from '../Auth/Profile';

const Container = styled.section`
  max-width: 100%;
  background: white;
  border: 1px solid rgba(219,219,219,1);
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 1;
  margin-bottom: 20px;
  @media only screen and (max-width: 375px) {
    padding: 10px;
  }
`;

const Title = styled.h1`
  font-family: 'Oleo Script', cursive;
  font-size: 4rem;
  color: black;
  @media only screen and (max-width: 375px) {
    font-size: 2.5rem;
  }
`;

const Searchbar = styled.input`
  padding: 1rem;
`;

const Header = ({ userMetadata, setUpload, setSearchValue }) => {

  const handleChange = e => {
    setSearchValue({ value: e.target.value });
  }
  return (
    <Container>
      <Title>Harvgram </Title>
      <Searchbar
        placeholder="Search"
        type="search"
        onChange={(e) => handleChange(e)}
      />
      <Box>
        <input
          accept="image/*"
          multiple
          type="file"
          style={{ display: 'none' }}
        />
      </Box>
      <Profile setUpload={setUpload} userMetadata={userMetadata} />
    </Container>
  )
}

export default Header;