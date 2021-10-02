import React from "react";
import styled from 'styled-components';
import { useAuth0 } from "@auth0/auth0-react";

const StyledButton = styled.button`
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

const Logout = () => {
  const { logout } = useAuth0();
  return <StyledButton onClick={() => logout({ returnTo: window.location.origin })}>
    Log Out
  </StyledButton>
};

export default Logout;