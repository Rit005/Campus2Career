import express from "express";
import { protect, requireRole } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

import {
  analyzeResume,
  getStudentResume
} from "../controllers/resumeController.js";

const router = express.Router();

/**  
 * STUDENT RESUME ANALYZER ROUTES  
 */
router.post(
  "/resume",
  protect,
  requireRole("student"),
  upload.single("resume"),
  analyzeResume
);

router.get(
  "/resume",
  protect,
  requireRole("student"),
  getStudentResume
);

export default router;
