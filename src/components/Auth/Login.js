import React from "react";
import styled from 'styled-components/macro';
import { useAuth0 } from "@auth0/auth0-react";

import { LogIn } from "@styled-icons/boxicons-regular/LogIn"

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


const Login = () => {
  const { loginWithRedirect } = useAuth0();
  return <StyledButton startIcon={<LogIn />} onClick={() => loginWithRedirect()}>Log In</StyledButton>;
};

export default Login;