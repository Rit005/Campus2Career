import { createContext, useContext, useState, useCallback } from "react";
import { authAPI } from "../api/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // ONLY during actions
  const [authChecked, setAuthChecked] = useState(false); // 🔑 KEY FIX

  /* ----------------------------------
     🔄 Verify token (MANUAL / LAZY)
  ---------------------------------- */
  const refreshUser = useCallback(async () => {
    try {
      const res = await authAPI.verifyToken();
      setUser(res.data.data.user);
      setAuthChecked(true);
      return res.data.data.user;
    } catch {
      setUser(null);
      setAuthChecked(true);
      return null;
    }
  }, []);

  /* ----------------------------------
     🔑 Email / Password Login
  ---------------------------------- */
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      await authAPI.login({ email, password });
      const user = await refreshUser();

      return { success: true, user };
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, [refreshUser]);

  /* ----------------------------------
     📝 Signup
  ---------------------------------- */
  const signup = useCallback(async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);

      await authAPI.signup({ name, email, password });
      const user = await refreshUser();

      return { success: true, user };
    } catch (err) {
      const msg = err.response?.data?.message || "Signup failed";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, [refreshUser]);

  /* ----------------------------------
     🚪 Logout
  ---------------------------------- */
  const logout = useCallback(async () => {
    await authAPI.logout();
    setUser(null);
    setAuthChecked(false);
  }, []);

  /* ----------------------------------
     🌐 OAuth
  ---------------------------------- */
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

  const loginWithGoogle = () => {
    window.location.href = `${API_BASE}/auth/google`;
  };

  const loginWithGithub = () => {
    window.location.href = `${API_BASE}/auth/github`;
  };

  // 🔥 OAuth callback MUST verify token ONCE
  const handleOAuthCallback = useCallback(async () => {
    const user = await refreshUser();
    if (!user) {
      window.location.href = "/login";
      return;
    }
    window.location.href = "/choose-dashboard";
  }, [refreshUser]);

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        error,
        loading,
        authChecked,        // 🔑 exposed for ProtectedRoute
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        loginWithGoogle,
        loginWithGithub,
        handleOAuthCallback,
        refreshUser,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
