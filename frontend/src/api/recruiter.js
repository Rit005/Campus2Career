import api from "./api";

/* ================================
   RECRUITER API
================================ */
export const recruiterAPI = {
  dashboard: (data) => api.post("/api/recruiter/dashboard", data),
  matching: (data) => api.post("/api/recruiter/matching", data),
  analytics: (data) => api.post("/api/recruiter/analytics", data),
  hrAssistant: (data) => api.post("/api/recruiter/hr-assistant", data),
};
