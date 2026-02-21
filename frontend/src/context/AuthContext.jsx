// src/context/AuthContext.jsx
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { authAPI } from "../api/api";  // MUST use withCredentials:true inside api.js

const AuthContext = createContext(null);

// Hook
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* -----------------------------------------------------
     REFRESH USER — Reads JWT COOKIE sent by backend
  ------------------------------------------------------ */
  const refreshUser = useCallback(async () => {
    try {
      const res = await authAPI.verifyToken(); // cookie-based auth
      const usr = res.data.data.user;

      setUser(usr);
      setAuthChecked(true);

      // Save role only (role is harmless & needed in UI)
      if (usr?.role) {
        localStorage.setItem("role", usr.role);
      }

      return usr;
    } catch (err) {
      setUser(null);
      setAuthChecked(true);
      return null;
    }
  }, []);

  /* -----------------------------------------------------
     LOGIN — COOKIE IS SET AUTOMATICALLY
  ------------------------------------------------------ */
  const login = useCallback(
    async (email, password) => {
      try {
        setLoading(true);
        setError(null);

        // Sends cookie due to withCredentials:true inside api.js
        const res = await authAPI.login({ email, password });

        if (res.data.success) {
          // user is stored in cookie, NOT localStorage
          await refreshUser();
          return { success: true };
        }

        return {
          success: false,
          error: res.data.message || "Login failed",
        };
      } catch (err) {
        const msg = err.response?.data?.message || "Login failed";
        setError(msg);
        return { success: false, error: msg };
      } finally {
        setLoading(false);
      }
    },
    [refreshUser]
  );

  /* -----------------------------------------------------
     SIGNUP — Same logic as login
  ------------------------------------------------------ */
  const signup = useCallback(
    async (name, email, password) => {
      try {
        setLoading(true);
        setError(null);

        const res = await authAPI.signup({ name, email, password });

        if (res.data.success) {
          await refreshUser();
          return { success: true };
        }

        return {
          success: false,
          error: res.data.message || "Signup failed",
        };
      } catch (err) {
        const msg = err.response?.data?.message || "Signup failed";
        setError(msg);
        return { success: false, error: msg };
      } finally {
        setLoading(false);
      }
    },
    [refreshUser]
  );

  /* -----------------------------------------------------
     LOGOUT — Clears cookie server-side
  ------------------------------------------------------ */
  const logout = useCallback(async () => {
    try {
      await authAPI.logout(); // backend clears cookie
    } catch {}

    localStorage.removeItem("role");
    setUser(null);
    setAuthChecked(false);
  }, []);

  /* -----------------------------------------------------
     OAUTH support
  ------------------------------------------------------ */
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

  const loginWithGoogle = () => {
    window.location.href = `${API_BASE}/auth/google`;
  };

  const loginWithGithub = () => {
    window.location.href = `${API_BASE}/auth/github`;
  };

  const handleOAuthCallback = useCallback(async () => {
    const usr = await refreshUser();
    if (!usr) window.location.href = "/login";
    else window.location.href = "/choose-dashboard";
  }, [refreshUser]);

  const clearError = () => setError(null);

  /* -----------------------------------------------------
     AUTO VERIFY ON PAGE LOAD
  ------------------------------------------------------ */
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  /* -----------------------------------------------------
     PROVIDER VALUE
  ------------------------------------------------------ */
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        authChecked,
        isAuthenticated: !!user,

        login,
        signup,
        logout,
        refreshUser,
        clearError,

        loginWithGoogle,
        loginWithGithub,
        handleOAuthCallback,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};