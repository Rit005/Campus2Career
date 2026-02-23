import express from 'express';
import { protect } from '../middleware/auth.js';
import uploadResume from '../middleware/upload.js';
import {
  analyzeResume,
  getMyResumes,
  getResumeById,
  deleteResume,
} from '../controllers/resumeController.js';

const router = express.Router();

router.post('/analyze', uploadResume.single('resume'), analyzeResume);

router.get('/', getMyResumes);

router.get('/:id', getResumeById);

router.delete('/:id', deleteResume);

export default router;

