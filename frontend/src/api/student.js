// src/api/student.js
import api from "./api";

export const studentAPI = {
  // Resume
  analyzeResume: (formData) =>
    api.post("/api/student/resume", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getResume: () => api.get("/api/student/resume"),

  // Marksheet
  uploadMarksheet: (formData) =>
    api.post("/api/student/marksheet", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getAllMarksheets: () => api.get("/api/student/marksheet"),
  deleteMarksheet: (id) => api.delete(`/api/student/marksheet/${id}`),

  // Academic Dashboard
  getAcademicDashboard: () => api.get("/api/student/dashboard/academic"),

  // Career
  analyzeCareer: () => api.post("/api/student/career/analyze"),
  getCareerProfile: () => api.get("/api/student/career/profile"),
};
