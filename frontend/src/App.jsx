import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./components/LoginPage";
import DashboardPage from "./components/DashboardPage";
import CallbackPage from "./components/CallbackPage";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("payman_access_token");
    if (token) {
      // Verify token is still valid
      verifyToken(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await fetch("/api/user/info", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        // Token is invalid, remove it
        localStorage.removeItem("payman_access_token");
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      localStorage.removeItem("payman_access_token");
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (token) => {
    localStorage.setItem("payman_access_token", token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("payman_access_token");
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <DashboardPage onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/callback"
          element={<CallbackPage onLogin={handleLogin} />}
        />
        <Route
          path="/"
          element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
