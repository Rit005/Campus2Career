import axios from "axios";

const StudentAPI = axios.create({
  baseURL: "http://localhost:5001/api/student",
  withCredentials: true,
});

export const studentAPI = {

  //profile 

  saveProfile: (data) => StudentAPI.post("/profile/save", data),
  getProfile: () => StudentAPI.get("/profile/get"),
  addSkill: (skill) => StudentAPI.post("/profile/skill/add", { skill }),
  removeSkill: (skill) => StudentAPI.post("/profile/skill/remove", { skill }),
  addInterest: (interest) => StudentAPI.post("/profile/interest/add",{ interest }),
  removeInterest: (interest) => StudentAPI.post("/profile/interest/remove", { interest }),

    // RESUME ANALYZER

  analyzeResume: (formData) => StudentAPI.post("/resume", formData, {
      headers: { "Content-Type": "multipart/form-data" }, }),
  getResume: () => StudentAPI.get("/resume"),

    // MARKSHEET

  uploadMarksheet: (formData) =>StudentAPI.post("/marksheet", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getAllMarksheets: () => StudentAPI.get("/marksheet"),
  deleteMarksheet: (id) => StudentAPI.delete(`/marksheet/${id}`),
  getSemesterWise: () => StudentAPI.get("/marksheet/semester-wise"),

   // ACADEMIC ANALYTICS
  getAcademicDashboard: () => StudentAPI.get("/dashboard/academic"),
  getAcademicAnalytics: () => StudentAPI.get("/dashboard/analytics"),

    // CAREER ANALYSIS
  analyzeCareer: () => StudentAPI.post("/career/analyze"),
  getCareerProfile: () => StudentAPI.get("/career/profile"),

    // JOBS
  getAllJobs: () => StudentAPI.get("/jobs"),
  applyForJob: (formData) =>
    StudentAPI.post("/apply", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

    // STUDENT
  getAllStudents: () => StudentAPI.get("/students"),

   // AI MENTOR
  aiMentor: (data) => StudentAPI.post("/mentor-assistant", data),
};

export default studentAPI;