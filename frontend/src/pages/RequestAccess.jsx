import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/system";
import { motion } from "framer-motion";
import { Box, CardContent, TextField, Button, Typography, Link, useTheme } from "@mui/material";
// import { requestAccess } from "../api/authService.js";

const RequestContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh - 100px",
});

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

const RequestButton = styled(Button)({
  padding: "12px",
  marginTop: "12px",
});

const RequestAccess = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const redirectTo = "/login";

  const handleSubmit = async (e) => {
    // e.preventDefault();
    // setError(false);

    // const response = await requestAccess(name, email, reason);

    // if (response?.ok) {
    //   setSubmitted(true);
    //   navigate(redirectTo, { replace: true });
    // } else {
    //   setError(true);
    // }
  };

  return (
    <RequestContainer>
      <FormWrapper
        initial={{ x: 0 }}
        animate={error ? { x: [0, -10, 10, -10, 10, 0], backgroundColor: [theme.palette.background.paper, theme.palette.error.main, theme.palette.background.paper] } : {}}
        transition={{ duration: 0.5 }}
      >
        <CardContent>
          {submitted ? (
            <Typography variant="h5" align="center">
              Request Sent! 🎉
            </Typography>
          ) : (
            <>
              <Typography variant="h5" align="center" fontFamily="Pacifico, cursive" gutterBottom>
                Request Access
              </Typography>
              <form onSubmit={handleSubmit}>
                <StyledTextField
                  label="Full Name"
                  variant="outlined"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <StyledTextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <StyledTextField
                  label="Reason for Access"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                />
                <RequestButton type="submit" variant="contained" fullWidth>
                  Submit Request
                </RequestButton>
              </form>
              <Typography variant="body2" align="center" sx={{ mt: 2 }} fontWeight="bold" fontFamily="Pacifico, cursive">
                Have an account?{" "}
                <Link href="/login" underline="hover" fontFamily="Pacifico, normal">
                  Login
                </Link>
              </Typography>
            </>
          )}
        </CardContent>
      </FormWrapper>
    </RequestContainer>
  );
};

export default RequestAccess;
