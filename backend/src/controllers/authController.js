
import { initiateLogin, completeChangePassword, refresh } from "../services/authService.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await initiateLogin(email, password);

    if (result.ChallengeName === "NEW_PASSWORD_REQUIRED") {
      return res.status(200).json({
        challenge: "NEW_PASSWORD_REQUIRED",
        session: result.Session,
        username: email,
      });
    }

    const tokens = result.AuthenticationResult;

    return res.status(200).json({
      idToken: tokens.IdToken,
      accessToken: tokens.AccessToken,
      refreshToken: tokens.RefreshToken,
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      error: err.message,
      code: err.name || "INTERNAL_SERVER_ERROR"
    });
  }
};

export const forceChangePassword = async (req, res) => {
  const { session, username, newPassword } = req.body;
  try {
    const result = await completeChangePassword(session, username, newPassword);
    const tokens = result.AuthenticationResult;
    return res.status(200).json({
      idToken: tokens.IdToken,
      accessToken: tokens.AccessToken,
      refreshToken: tokens.RefreshToken,
    });
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message, code: err.name });
  }
};

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  try {
    const result = await refresh(refreshToken);
    const tokens = result.AuthenticationResult;

    return res.status(200).json({
      idToken: tokens.IdToken,
      accessToken: tokens.AccessToken,
      refreshToken: tokens.RefreshToken,
    });
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message, code: err.name });
  }
};