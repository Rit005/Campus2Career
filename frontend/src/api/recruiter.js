import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api/recruiter",
  withCredentials: true,
});

const recruiterAPI = {
  postJob: (data) => API.post("/post-job", data),
  getMyJobs: () => API.get("/jobs"),
  deleteJob: (id) => API.delete(`/job/${id}`),
  matchCandidates: (data) => API.post("/match", data),
  dashboard: (data) => API.post("/dashboard", data),

  // ✅ Correct GET request
  getAnalytics: () => API.get("/analytics"),

  hrAssistant: (data) => API.post("/hr-assistant", data),
  
  updateJob: (id, data) => API.put(`/job/${id}`, data),
  getAllJobs: () => API.get("/all-jobs"),
};

export default recruiterAPI;
