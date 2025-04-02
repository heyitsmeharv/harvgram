import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login, forceChangePassword } from "../api/api.js";
import { Button, Box, CircularProgress, Link, TextField, Typography, useTheme } from "@mui/material";
import { styled } from "@mui/system";
import { motion } from "framer-motion";

const LoginContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh - 100px"
}));

const FormWrapper = styled(motion.div)(({ theme }) => ({
  maxWidth: 400,
  width: "100%",
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius,
}));

const StyledTextField = styled(TextField)({
  marginBottom: "16px",
});

const LoginButton = styled(Button)({
  padding: "12px",
  marginTop: "12px",
});

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

  const redirectTo = "/home";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
      const token = await login(email, password);
      if (token) {
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
        navigate(redirectTo, { replace: true });
      } else {
        setError(true);
        setMessage("Invalid password/username.");
      }
    } catch (err) {
      setError(true);
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSetNewPassword = async () => {
    setLoading(true);
    try {
      const token = await forceChangePassword(user.session, email, newPassword);
      authLogin({
        idToken: token.idToken,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
      });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(true);
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <FormWrapper
        initial={{ x: 0 }}
        animate={error ? { x: [0, -10, 10, -10, 10, 0], backgroundColor: [theme.palette.background.paper, theme.palette.error.main, theme.palette.background.paper] } : {}}
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
          <StyledTextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
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
            {loading ? (
              <CircularProgress
                size={24}
                color="inherit"
              />
            ) : (
              "Login"
            )}
          </LoginButton>
        </form>
        <Typography variant="body2" align="center" sx={{ mt: 2 }} fontWeight="bold" fontFamily="Pacifico, cursive">
          Don't have an account?{" "}
          <Link href="/register" underline="hover" fontFamily="Pacifico, normal">
            Request Access
          </Link>
        </Typography>
      </FormWrapper>
    </LoginContainer >
  );
};

export default Login;