import axios from "axios";

const RecruiterAPI = axios.create({
  baseURL: "http://localhost:5001/api/recruiter",
  withCredentials: true,
});

const recruiterAPI = {
  postJob: (data) => RecruiterAPI.post("/post-job", data),
  getMyJobs: () => RecruiterAPI.get("/jobs"),
  deleteJob: (id) => RecruiterAPI.delete(`/job/${id}`),
  updateJob: (id, data) => RecruiterAPI.put(`/job/${id}`, data),
  getAllJobs: () => RecruiterAPI.get("/all-jobs"),

  matchCandidates: (data) => RecruiterAPI.post("/match", data),

  dashboard: (data) => RecruiterAPI.post("/dashboard", data),
  getAnalytics: () => RecruiterAPI.get("/analytics"),
  hrAssistant: (data) => RecruiterAPI.post("/hr-assistant", data),
  
  getApplicants: (jobId) => RecruiterAPI.get(`/applicants/${jobId}`),
  updateStatus: (id, status) => RecruiterAPI.patch(`/applicants/${id}/status`, { status }),
  updateNote: (id, note) =>RecruiterAPI.patch(`/applicants/${id}/note`, { note }),
  getResume: (id) =>`http://localhost:5001/api/recruiter/application/resume/${id}`,

  saveProfile: (data) => RecruiterAPI.post("/profile/save", data),
  getProfile: () => RecruiterAPI.get("/profile/get"),

};

export default recruiterAPI;
