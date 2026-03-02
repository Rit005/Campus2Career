import axios from "axios";

const StudentAPI = axios.create({
  baseURL: "http://localhost:5001/api/student",
  withCredentials: true,
});

export const studentAPI = {

  saveProfile: (data) => StudentAPI.post("/profile/save", data),
  getProfile: () => StudentAPI.get("/profile/get"),

  addSkill: (skill) => StudentAPI.post("/profile/skill/add", { skill }),
  removeSkill: (skill) => StudentAPI.post("/profile/skill/remove", { skill }),

  addInterest: (interest) =>
    StudentAPI.post("/profile/interest/add", { interest }),
  removeInterest: (interest) =>
    StudentAPI.post("/profile/interest/remove", { interest }),

  analyzeResume: (formData) =>
    StudentAPI.post("/resume", formData, {
      headers: { /* let axios auto set */ },
    }),

  getResume: () => StudentAPI.get("/resume"),

  uploadMarksheet: (formData) =>
    StudentAPI.post("/marksheet", formData),

  getAllMarksheets: () => StudentAPI.get("/marksheet"),

  deleteMarksheet: (id) => StudentAPI.delete(`/marksheet/${id}`),

  getSemesterWise: () => StudentAPI.get("/marksheet/semester-wise"),

  getAcademicDashboard: () => StudentAPI.get("/dashboard/academic"),

  getAcademicAnalytics: () => StudentAPI.get("/dashboard/analytics"),

  analyzeCareer: () => StudentAPI.post("/career/analyze"),

  getCareerProfile: () => StudentAPI.get("/career/profile"),

  getAllJobs: () => StudentAPI.get("/jobs"),

  applyForJob: (formData) =>
    StudentAPI.post("/apply", formData),   // FIXED

  getAllStudents: () => StudentAPI.get("/students"),

  aiMentor: (data) => StudentAPI.post("/mentor-assistant", data),
};

export default studentAPI;