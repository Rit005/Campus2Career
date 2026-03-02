import express from "express";
import { protect, requireRole } from "../middleware/auth.js";
import { uploadResume } from "../middleware/upload.js";
import { uploadMarksheet } from "../middleware/uploadMarksheet.js";
import { getStudentAnalytics,getSemesterWiseAnalytics} from "../controllers/academicAnalyticsController.js";

import {
  getAllStudents,applyForJob
} from "../controllers/studentController.js";

import {
  saveStudentProfile,getStudentProfile,addSkill, removeSkill,addInterest,removeInterest
} from "../controllers/profileController.js"; 

import { getAllJobs } from "../controllers/careerGuidanceController.js";

import { mentorAssistantChat } from "../controllers/mentorAssistantController.js";

import {
  analyzeResume,getStudentResume
} from "../controllers/resumeController.js";


import {
  uploadMarksheetController,getAllMarksheets,deleteMarksheet, getAcademicDashboard
} from "../controllers/marksheetController.js";

import {
  analyzeCareer,getCareerProfile
} from "../controllers/careerGuidanceController.js";  


const router = express.Router();

// RESUME 
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

// MARKSHEET 
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

// CAREER ANALYSIS
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

// Student
router.get("/students", getAllStudents);

router.post(
  "/profile/save",
  protect,
  requireRole("student"),
  saveStudentProfile
);

router.get(
  "/profile/get",
  protect,
  requireRole("student"),
  getStudentProfile
);

router.post(
  "/profile/skill/add",
  protect,
  requireRole("student"),
  addSkill
);

router.post(
  "/profile/skill/remove",
  protect,
  requireRole("student"),
  removeSkill
);

router.post(
  "/profile/interest/add",
  protect,
  requireRole("student"),
  addInterest
);

router.post(
  "/profile/interest/remove",
  protect,
  requireRole("student"),
  removeInterest
);

// MENTOR CHAT
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

// JOBS FOR STUDENTS
router.get(
  "/jobs",
  protect,
  requireRole("student"),
  getAllJobs
);

// Dashboard
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