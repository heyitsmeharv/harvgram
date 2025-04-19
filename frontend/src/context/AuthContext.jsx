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

  const logout = ({ queryClient }) => {
    queryClient.clear();
    setUser(null);
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  useEffect(() => {
    if (!user?.refreshToken) return;

    const interval = setInterval(async () => {
      try {
        const res = await refreshToken(user.refreshToken);

        const decoded = parseJwt(res.IdToken);

        const updatedUser = {
          ...user,
          email: decoded.email || user.email,
          idToken: res.IdToken,
          accessToken: res.AccessToken,
        };

        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } catch (err) {
        logout();
      }
    }, 30 * 60 * 1000); // every 30 mins

    return () => clearInterval(interval);
  }, [user?.refreshToken]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);