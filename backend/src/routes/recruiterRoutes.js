import express from "express";
import { protect, requireRole } from "../middleware/auth.js";
import { getRecruiterAnalytics } from "../controllers/recruiterAnalyticsController.js";

import { 
  postJob, 
  getMyJobs, 
  deleteJob,
  updateJob,
  getAllJobs
} from "../controllers/JobController.js";

import { matchCandidates } from "../controllers/matchingController.js";
import { getHiringDashboard } from "../controllers/dashboardController.js";
import { hrAssistantChat } from "../controllers/hrAssistantController.js";

const router = express.Router();

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


// HR Chatbot
router.post("/hr-assistant", hrAssistantChat);

router.get("/analytics", protect, requireRole("recruiter"), getRecruiterAnalytics);

export default router;
