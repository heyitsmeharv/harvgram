import { createContext, useContext, useEffect, useState } from "react";
import { refreshToken } from "../api/api.js";

export const AuthContext = createContext();

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return {};
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });

  const login = ({ idToken, accessToken, refreshToken, session = null }) => {
    const decoded = parseJwt(idToken);
    const userData = {
      email: decoded.email,
      idToken,
      accessToken,
      refreshToken,
      session
    };

    setUser(userData);
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(userData));
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
    window.location.href = "/login";
  };

  useEffect(() => {
    if (!user?.refreshToken) return;

    const interval = setInterval(async () => {
      try {
        const res = await refreshToken(user.refreshToken);
        login({
          idToken: res.IdToken,
          accessToken: res.AccessToken,
          refreshToken: user.refreshToken,
        });
      } catch (err) {
        logout();
      }
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user?.refreshToken]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);