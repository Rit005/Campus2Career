import express from "express";
import { matchCandidate } from "../controllers/matchingController.js";
import { getHiringDashboard } from "../controllers/dashboardController.js";
import { analyzeWorkforce } from "../controllers/analyticsController.js";
import { hrAssistantChat } from "../controllers/hrAssistantController.js";


const router = express.Router();

router.post("/matching", matchCandidate);
router.post("/dashboard", getHiringDashboard);
router.post("/analytics", analyzeWorkforce);
router.post("/hr-assistant", hrAssistantChat);

export default router;
