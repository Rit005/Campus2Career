import express from "express";
import { protect, requireRole } from "../middleware/auth.js";

import { 
  postJob, 
  getMyJobs, 
  deleteJob,
  updateJob,
  getAllJobs
} from "../controllers/JobController.js";

import { matchCandidates } from "../controllers/matchingController.js";
import { getHiringDashboard } from "../controllers/dashboardController.js";
import { analyzeWorkforce } from "../controllers/analyticsController.js";
import { hrAssistantChat } from "../controllers/hrAssistantController.js";

const router = express.Router();

// ALL recruiter routes protected
router.use(protect, requireRole("recruiter"));

// JOB ROUTES
router.post("/post-job", postJob);
router.get("/jobs", getMyJobs);
router.delete("/job/:id", deleteJob);
router.put("/job/:id", updateJob);

// GET ALL JOBS (fixed)
router.get("/all-jobs", getAllJobs);

// MATCHING
router.post("/match", matchCandidates);

// DASHBOARD
router.post("/dashboard", getHiringDashboard);

// ANALYTICS
router.post("/analytics", analyzeWorkforce);

// HR Chatbot
router.post("/hr-assistant", hrAssistantChat);

export default router;
