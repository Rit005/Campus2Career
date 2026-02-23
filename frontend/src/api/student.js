
import axios from "axios";

const StudentAPI = axios.create({
  baseURL: "http://localhost:5001/api/student",
  withCredentials: true,
});

export const studentAPI = {

saveProfile: (data) => axios.post("/api/profile/save", data),
  getProfile: () => axios.get("/api/profile/get"),
  addSkill: (skill) => axios.post("/api/profile/skill/add", { skill }),
  removeSkill: (skill) => axios.post("/api/profile/skill/remove", { skill }),
  addInterest: (interest) => axios.post("/api/profile/interest/add", { interest }),
  removeInterest: (interest) => axios.post("/api/profile/interest/remove", { interest }),

  analyzeResume: (formData) =>
    StudentAPI.post("/resume", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getResume: () => StudentAPI.get("/resume"),

  uploadMarksheet: (formData) =>
    StudentAPI.post("/marksheet", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getAllMarksheets: () => StudentAPI.get("/marksheet"),

  deleteMarksheet: (id) => StudentAPI.delete(`/marksheet/${id}`),

  getSemesterWise: () => StudentAPI.get("/marksheet/semester-wise"),

  getAcademicDashboard: () => StudentAPI.get("/dashboard/academic"),

  getAcademicAnalytics: () => StudentAPI.get("/dashboard/analytics"),

  analyzeCareer: () => StudentAPI.post("/career/analyze"),

  getCareerProfile: () => StudentAPI.get("/career/profile"),

  getAllJobs: () => StudentAPI.get("/jobs"),

  applyForJob: (formData) =>
    StudentAPI.post("/apply", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getAllStudents: () => StudentAPI.get("/students"),


  aiMentor: (data) => StudentAPI.post("/mentor-assistant", data),
};

export default studentAPI;
