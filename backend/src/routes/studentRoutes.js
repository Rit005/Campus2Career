import express from "express";
import { protect, requireRole } from "../middleware/auth.js";
import { uploadResume } from "../middleware/upload.js";
import { uploadMarksheet } from "../middleware/uploadMarksheet.js";
import { getStudentAnalytics,getSemesterWiseAnalytics} from "../controllers/academicAnalyticsController.js";

import {
  getAllStudents,
  applyForJob
} from "../controllers/studentController.js";

// JOBS FOR STUDENTS
import { getAllJobs } from "../controllers/careerGuidanceController.js";

// MENTOR CHAT
import { mentorAssistantChat } from "../controllers/mentorAssistantController.js";

// RESUME MODULE
import {
  analyzeResume,
  getStudentResume
} from "../controllers/resumeController.js";

// MARKSHEET + ACADEMIC
import {
  uploadMarksheetController,
  getAllMarksheets,
  deleteMarksheet,
  getAcademicDashboard
} from "../controllers/marksheetController.js";

// CAREER ANALYSIS
import {
  analyzeCareer,
  getCareerProfile
} from "../controllers/careerGuidanceController.js";  

const router = express.Router();

router.post(
  "/resume",
  protect,
  requireRole("student"),
  uploadResume.single("resume"),
  analyzeResume
);

router.get(
  "/resume",
  protect,
  requireRole("student"),
  getStudentResume
);

router.post(
  "/marksheet",
  protect,
  requireRole("student"),
  uploadMarksheet.single("marksheet"),
  uploadMarksheetController
);

router.get(
  "/marksheet",
  protect,
  requireRole("student"),
  getAllMarksheets
);

router.delete(
  "/marksheet/:id",
  protect,
  requireRole("student"),
  deleteMarksheet
);

router.get(
  "/dashboard/academic",
  protect,
  requireRole("student"),
  getAcademicDashboard
);


router.post(
  "/career/analyze",
  protect,
  requireRole("student"),
  analyzeCareer   
);

router.get(
  "/career/profile",
  protect,
  requireRole("student"),
  getCareerProfile  
);


router.get("/students", getAllStudents);


router.post(
  "/mentor-assistant",
  protect,
  requireRole("student"),
  mentorAssistantChat
);


router.post(
  "/apply",
  protect,
  uploadResume.single("resume"),
  applyForJob
);


router.get(
  "/jobs",
  protect,
  requireRole("student"),
  getAllJobs
);


router.get(
  "/dashboard/analytics",
  protect,
  requireRole("student"),
  getStudentAnalytics
);
router.get(
  "/marksheet/semester-wise",
  protect,
  requireRole("student"),
  getSemesterWiseAnalytics
);
export default router;