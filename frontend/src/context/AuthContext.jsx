import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { authAPI } from "../api/api";

const AuthContext = createContext(null);


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


  const refreshUser = useCallback(async () => {
    try {
      const res = await authAPI.verifyToken(); 
      const usr = res.data.data.user;

      setUser(usr);
      setAuthChecked(true);

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

  const login = useCallback(
  async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const res = await authAPI.login({ email, password });

      if (res.data.success) {
        const usr = await refreshUser();

        return {
          success: true,
          data: { user: usr }, 
        };
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

  const logout = useCallback(async () => {
    try {
      await authAPI.logout(); 
    } catch {}

    localStorage.removeItem("role");
    setUser(null);
    setAuthChecked(false);
  }, []);

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

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

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