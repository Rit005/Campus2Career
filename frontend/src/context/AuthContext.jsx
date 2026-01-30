import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authAPI } from "../api/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ----------------------------------
     🔄 Fetch current user from backend
  ---------------------------------- */
  const refreshUser = useCallback(async () => {
    try {
      const res = await authAPI.verifyToken();
      setUser(res.data.data.user);
      return res.data.data.user;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  /* ----------------------------------
     🔐 Check auth on app load
  ---------------------------------- */
  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  /* ----------------------------------
     🔑 Email / password login
  ---------------------------------- */
  const login = useCallback(async (email, password) => {
    try {
      setError(null);
      await authAPI.login({ email, password });
      const user = await refreshUser();
      return { success: true, user };
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setError(msg);
      return { success: false, error: msg };
    }
  }, [refreshUser]);

  /* ----------------------------------
     📝 Signup
  ---------------------------------- */
  const signup = useCallback(async (name, email, password) => {
    try {
      setError(null);
      await authAPI.signup({ name, email, password });
      const user = await refreshUser();
      return { success: true, user };
    } catch (err) {
      const msg = err.response?.data?.message || "Signup failed";
      setError(msg);
      return { success: false, error: msg };
    }
  }, [refreshUser]);

  /* ----------------------------------
     🚪 Logout
  ---------------------------------- */
  const logout = useCallback(async () => {
    await authAPI.logout();
    setUser(null);
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
    loading,
    error,
    isAuthenticated: !loading && !!user,
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
