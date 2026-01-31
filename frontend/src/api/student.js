// src/api/student.js
import api from "./api";

export const studentAPI = {
  analyzeResume: (formData) =>
    api.post("/api/student/resume", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getResume: () => api.get("/api/student/resume"),
};
