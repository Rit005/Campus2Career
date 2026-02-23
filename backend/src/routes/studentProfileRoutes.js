import express from "express";
import {
  saveStudentProfile,
  getStudentProfile,
  addSkill,
  removeSkill,
  addInterest,
  removeInterest
} from "../controllers/profileController.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/save", auth, saveStudentProfile);
router.get("/get", auth, getStudentProfile);

router.post("/skill/add", auth, addSkill);
router.post("/skill/remove", auth, removeSkill);

router.post("/interest/add", auth, addInterest);
router.post("/interest/remove", auth, removeInterest);

export default router;
