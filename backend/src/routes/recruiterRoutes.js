import express from "express";
import { protect, requireRole } from "../middleware/auth.js";

import { 
  postJob, 
  getMyJobs, 
  deleteJob,
  updateJob,
  getAllJobs
} from "../controllers/JobController.js";

import {
  saveRecruiterProfile,
  getRecruiterProfile,
} from "../controllers/recruiterProfileController.js";

import {
  getApplicantsForJob,
  updateApplicationStatus,updateRecruiterNote ,getResumeByApplicationId 
} from "../controllers/applicationController.js";

import { matchCandidates } from "../controllers/matchingController.js";
import { getHiringDashboard } from "../controllers/dashboardController.js";
import { hrAssistantChat } from "../controllers/hrAssistantController.js";
import { getRecruiterAnalytics } from "../controllers/recruiterAnalyticsController.js";

const router = express.Router();

router.use(protect, requireRole("recruiter"));

// JOB ROUTES
router.post("/post-job", postJob);
router.get("/jobs", getMyJobs);
router.delete("/job/:id", deleteJob);
router.put("/job/:id", updateJob);

// GET ALL JOBS 
router.get("/all-jobs", getAllJobs);

// MATCHING
router.post("/match", matchCandidates);

// DASHBOARD
router.post("/dashboard", getHiringDashboard);

// HR Chatbot
router.post("/hr-assistant", hrAssistantChat);

// ANALYTICS 
router.get("/analytics", getRecruiterAnalytics);

// APPLICANTS 
router.get("/applicants/:jobId", getApplicantsForJob);
router.patch("/applicants/:id/status", updateApplicationStatus);
router.patch("/applicants/:id/note",protect,requireRole("recruiter"),updateRecruiterNote);
router.get("/application/resume/:id",getResumeByApplicationId);

//recruiter profile
router.post("/profile/save",protect,requireRole("recruiter"),saveRecruiterProfile);

router.get("/profile/get",protect,requireRole("recruiter"),getRecruiterProfile);


export default router;