import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 🔥 required for cookie-based auth
});

/* ================================
   REQUEST INTERCEPTOR
================================ */
api.interceptors.request.use(
  (config) => {
    // ❌ DO NOT attach token if using cookies
    // Backend already reads token from HTTP-only cookie
    return config;
  },
  (error) => Promise.reject(error)
);

/* ================================
   RESPONSE INTERCEPTOR
================================ */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🚫 DO NOT redirect here
    // Let React Router decide navigation
    return Promise.reject(error);
  }
);

/* ================================
   AUTH API
================================ */
export const authAPI = {
  signup: (data) => api.post("/auth/signup", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  verifyToken: () => api.get("/auth/verify"),
  selectRole: (data) => api.post("/auth/select-role", data),
};

export default api;
