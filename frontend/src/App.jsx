import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ThemeProvider from "./context/ThemeContext";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute.jsx";
import ThemeToggleButton from "./components/ThemeToggleButton/ThemeToggleButton.jsx";
import Login from "./pages/Login";
import RequestAccess from "./pages/RequestAccess";
import Home from "./pages/Home";
import theme from "./styles/themes/theme.jsx";
import './App.css';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <ThemeToggleButton />
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RequestAccess />} />
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            {/* Redirect any unknown route to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;