import express from "express";
import { protect, requireRole } from "../middleware/auth.js";
import { uploadResume } from "../middleware/upload.js";
import { uploadMarksheet } from "../middleware/uploadMarksheet.js";
import { getStudentAnalytics,getSemesterWiseAnalytics} from "../controllers/academicAnalyticsController.js";
// STUDENT + JOB APPLY MODULE
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

// CAREER ANALYSIS (IMPORTANT: imported from correct file!)
import {
  analyzeCareer,
  getCareerProfile
} from "../controllers/careerGuidanceController.js";  
//  ⬆️ FIXED — this was your missing import

const router = express.Router();

/* RESUME */
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

/* MARKSHEET UPLOAD */
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

/* ACADEMIC DASHBOARD */
router.get(
  "/dashboard/academic",
  protect,
  requireRole("student"),
  getAcademicDashboard
);

/* CAREER GUIDANCE */
router.post(
  "/career/analyze",
  protect,
  requireRole("student"),
  analyzeCareer   // ✔ FIXED (correct import)
);

router.get(
  "/career/profile",
  protect,
  requireRole("student"),
  getCareerProfile  // ✔ FIXED (correct import)
);

/* STUDENTS LIST */
router.get("/students", getAllStudents);

/* MENTOR ASSISTANT */
router.post(
  "/mentor-assistant",
  protect,
  requireRole("student"),
  mentorAssistantChat
);

/* JOB APPLY */
router.post(
  "/apply",
  protect,
  uploadResume.single("resume"),
  applyForJob
);

/* JOB LISTING */
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