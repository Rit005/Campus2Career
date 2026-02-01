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

// All routes require authentication
router.use(protect);

/**
 * @desc    Analyze and upload resume
 * @route   POST /resume/analyze
 * @access  Private
 * 
 * Request: multipart/form-data with 'resume' file
 * Response: JSON with extracted skills, AI summary, and suggested roles
 */
router.post('/analyze', uploadResume.single('resume'), analyzeResume);

/**
 * @desc    Get all resume analyses for current user
 * @route   GET /resume
 * @access  Private
 */
router.get('/', getMyResumes);

/**
 * @desc    Get specific resume analysis by ID
 * @route   GET /resume/:id
 * @access  Private
 */
router.get('/:id', getResumeById);

/**
 * @desc    Delete a resume analysis
 * @route   DELETE /resume/:id
 * @access  Private
 */
router.delete('/:id', deleteResume);

export default router;

