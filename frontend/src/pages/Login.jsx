import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login, forceChangePassword } from "../api/api.js";
import { Button, Box, Link, TextField, Typography, InputAdornment, IconButton, OutlinedInput, InputLabel, FormControl, useTheme } from "@mui/material";
import { styled } from "@mui/system";
import { motion } from "framer-motion";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff'

import LoadingScreen from "../components/LoadingScreen/LoadingScreen.jsx";

const LoginContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh - 100px",
}));

const FormWrapper = styled(motion.div)(({ theme }) => ({
  maxWidth: 400,
  width: "100%",
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.main,
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius,
  transition: "background-color 0.3s ease",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: "16px",
  color: theme.palette.text.main,
}));

const StyledOutlineInput = styled(OutlinedInput)(({ theme }) => ({
  marginBottom: "16px",
  color: theme.palette.text.main,
}));

const LoginButton = styled(Button)(({ theme }) => ({
  padding: "12px",
  marginTop: "12px",
  backgroundColor: theme.palette.button.main,
  color: theme.palette.text.main,
  borderColor: theme.palette.button.border,
  border: "2px solid",
  fontWeight: "bold",
  "&:hover": {
    backgroundColor: theme.palette.button.highlight,
    borderColor: theme.palette.button.border,
    transition: "background-color 0.3s ease",
  }
}));

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, login: authLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isNewPasswordRequired, setIsNewPasswordRequired] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disableLoading, setDisableLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const redirectTo = "/home";

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setDisableLoading(false);
    try {
      const token = await login(email, password);
      if (token) {
        setDisableLoading(true);
        if (token.challenge === "NEW_PASSWORD_REQUIRED") {
          authLogin({
            idToken: token.idToken,
            accessToken: token.accessToken,
            refreshToken: token.refreshToken,
            session: token.session
          });
          setIsNewPasswordRequired(true);
          return;
        }
        authLogin({
          idToken: token.idToken,
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
        });
        setTimeout(() => {
          navigate(redirectTo, { replace: true });
        }, 2000);
      } else {
        setLoading(false);
        setError(true);
        setMessage("Invalid password/username.");
      }
    } catch (err) {
      setLoading(false);
      setError(true);
      setMessage(err.message);
    }
  };

  const handleSetNewPassword = async () => {
    setLoading(true);
    setDisableLoading(false);
    try {
      const token = await forceChangePassword(user.session, email, newPassword);
      authLogin({
        idToken: token.idToken,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
      });
      setDisableLoading(true);
      setTimeout(() => {
        navigate(redirectTo, { replace: true });
      }, 2000);
    } catch (err) {
      setLoading(false);
      setError(true);
      setMessage(err.message);
    }
  };

  if (loading && disableLoading) {
    return <LoadingScreen />;
  }

  return (
    <LoginContainer>
      <FormWrapper
        initial={{ x: 0 }}
        animate={error ? { x: [0, -10, 10, -10, 10, 0], backgroundColor: [theme.palette.background.main, theme.palette.error.main, theme.palette.background.main] } : {}}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h5" align="center" fontWeight="bold" fontFamily="Pacifico, cursive" gutterBottom>
          Harvgram
        </Typography>
        <form onSubmit={!isNewPasswordRequired ? handleLogin : handleSetNewPassword}>
          <StyledTextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
          <FormControl required fullWidth variant="outlined">
            <InputLabel>Password</InputLabel>
            <StyledOutlineInput
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)}
              endAdornment={
                <InputAdornment sx={{ marginRight: "10px" }}  position="end">
                  <IconButton
                    aria-label={
                      showPassword ? 'hide the password' : 'display the password'
                    }
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          {isNewPasswordRequired && (
            <>
              <Typography variant="body" align="center" color={theme.palette.error.main}>Password Reset Required</Typography>
              <StyledTextField
                label="New Password"
                type="password"
                variant="outlined"
                fullWidth
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
                required
              />
            </>
          )}
          {error && <Typography variant="body" align="center" color={theme.palette.error.main}>{message}</Typography>}
          <LoginButton type="submit" variant="contained" disabled={loading} fullWidth>
            Login
          </LoginButton>
        </form>
        <Typography variant="body2" align="center" sx={{ mt: 2 }} fontWeight="bold" fontFamily="Pacifico, cursive">
          Don't have an account?{" "}
          <Link href="/register" underline="hover" fontFamily="Pacifico, normal" color={theme.palette.text.main}>
            Request Access
          </Link>
        </Typography>
      </FormWrapper>
    </LoginContainer >
  );
};

export default Login;