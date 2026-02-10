// src/api/student.js
import axios from "axios";

// Create dedicated axios instance for student APIs
const StudentAPI = axios.create({
  baseURL: "http://localhost:5001/api/student",
  withCredentials: true,
});

export const studentAPI = {
  /* ============================================================
     RESUME
  ============================================================ */
  analyzeResume: (formData) =>
    StudentAPI.post("/resume", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getResume: () => StudentAPI.get("/resume"),

  /* ============================================================
     MARKSHEET
  ============================================================ */
  uploadMarksheet: (formData) =>
    StudentAPI.post("/marksheet", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getAllMarksheets: () => StudentAPI.get("/marksheet"),

  deleteMarksheet: (id) => StudentAPI.delete(`/marksheet/${id}`),

  getSemesterWise: () => StudentAPI.get("/marksheet/semester-wise"),

  /* ============================================================
     ACADEMIC DASHBOARD
  ============================================================ */
  getAcademicDashboard: () => StudentAPI.get("/dashboard/academic"),

  getAcademicAnalytics: () => StudentAPI.get("/dashboard/analytics"),

  /* ============================================================
     CAREER GUIDANCE
  ============================================================ */
  analyzeCareer: () => StudentAPI.post("/career/analyze"),

  getCareerProfile: () => StudentAPI.get("/career/profile"),

  /* ============================================================
     JOBS (Student + Recruiter)
  ============================================================ */
  getAllJobs: () => StudentAPI.get("/jobs"),

  applyForJob: (formData) =>
    StudentAPI.post("/apply", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  /* ============================================================
     STUDENTS (Recruiter Dashboard)
  ============================================================ */
  getAllStudents: () => StudentAPI.get("/students"),

  /* ============================================================
     AI MENTOR
  ============================================================ */
  aiMentor: (data) => StudentAPI.post("/mentor-assistant", data),
};

export default studentAPI;
