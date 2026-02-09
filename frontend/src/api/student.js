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
  // Students (Recruiter Dashboard)
  // -------------------------
  getAllStudents: () => StudentAPI.get("/students"),

  // -------------------------
  // AI Mentor
  // -------------------------
  aiMentor: (data) => StudentAPI.post("/mentor-assistant", data),

  // -------------------------
  // ✅ APPLY FOR JOB
  // -------------------------
  applyForJob: (formData) =>
    StudentAPI.post("/apply", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // =========================
  // ⭐ NEW: VIEW ALL JOBS
  // =========================
  getAllJobs: () => StudentAPI.get("/jobs"),

  getAcademicAnalytics: () => StudentAPI.get("/dashboard/analytics"),

  getSemesterWise: () => StudentAPI.get("/marksheet/semester-wise"),

};


export default studentAPI;
