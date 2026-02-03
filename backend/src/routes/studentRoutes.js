import express from "express";
import { protect, requireRole } from "../middleware/auth.js";
import { uploadResume } from "../middleware/upload.js";
import { uploadMarksheet } from "../middleware/uploadMarksheet.js";
import {getAllStudents  } from "../controllers/studentController.js"

import {
  analyzeResume,
  getStudentResume
} from "../controllers/resumeController.js";

import {
  uploadMarksheet as uploadMarksheetController,
  getAllMarksheets,
  deleteMarksheet,
  getAcademicDashboard,
  analyzeCareer,
  getCareerProfile
} from "../controllers/marksheetController.js";

const router = express.Router();

router.post("/resume", protect, requireRole("student"), uploadResume.single("resume"), analyzeResume);
router.get("/resume", protect, requireRole("student"), getStudentResume);

router.post("/marksheet", protect, requireRole("student"), uploadMarksheet.single("marksheet"), uploadMarksheetController);
router.get("/marksheet", protect, requireRole("student"), getAllMarksheets);
router.delete("/marksheet/:id", protect, requireRole("student"), deleteMarksheet);

router.get("/dashboard/academic", protect, requireRole("student"), getAcademicDashboard);

router.post("/career/analyze", protect, requireRole("student"), analyzeCareer);
router.get("/career/profile", protect, requireRole("student"), getCareerProfile);

router.get("/students", getAllStudents);
export default router;