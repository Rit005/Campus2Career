// src/api/student.js
import axios from "axios";

// Create dedicated axios instance for student APIs
const StudentAPI = axios.create({
  baseURL: "http://localhost:5001/api/student",
  withCredentials: true,
});

export const studentAPI = {
  // -------------------------
  // Resume
  // -------------------------
  analyzeResume: (formData) =>
    StudentAPI.post("/resume", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getResume: () => StudentAPI.get("/resume"),

  // -------------------------
  // Marksheet
  // -------------------------
  uploadMarksheet: (formData) =>
    StudentAPI.post("/marksheet", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getAllMarksheets: () => StudentAPI.get("/marksheet"),
  deleteMarksheet: (id) => StudentAPI.delete(`/marksheet/${id}`),

  // -------------------------
  // Academic Dashboard
  // -------------------------
  getAcademicDashboard: () => StudentAPI.get("/dashboard/academic"),

  // -------------------------
  // Career
  // -------------------------
  analyzeCareer: () => StudentAPI.post("/career/analyze"),
  getCareerProfile: () => StudentAPI.get("/career/profile"),

  // -------------------------
  // Students List (Recruiter View)
  // -------------------------
  getAllStudents: () => StudentAPI.get("/students"),

  aiMentor: (data) => StudentAPI.post("/mentor-assistant", data),
};

export default studentAPI;
