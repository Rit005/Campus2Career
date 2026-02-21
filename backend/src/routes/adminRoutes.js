// backend/src/routes/adminRoutes.js
import express from 'express';
import { 
  getOverview, 
  getUsers, 
  toggleUserBlock, 
  deleteUser, 
  getAtRiskStudents, 
  getSkillTrends,
  getGrowthAnalytics 
} from '../controllers/adminController.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All admin routes are protected and require admin role
router.use(protect);
router.use(requireRole('admin'));

// ============================================================
// ADMIN DASHBOARD ROUTES
// ============================================================

/**
 * @desc    Get admin dashboard overview
 * @route   GET /api/admin/overview
 * @access  Admin
 */
router.get('/overview', getOverview);

/**
 * @desc    Get all users with pagination and filters
 * @route   GET /api/admin/users
 * @access  Admin
 * 
 * Query params:
 * - page: page number (default: 1)
 * - limit: items per page (default: 10)
 * - role: filter by role (student, recruiter, admin)
 * - status: filter by status (active, blocked)
 * - search: search by name or email
 */
router.get('/users', getUsers);

/**
 * @desc    Block or unblock a user
 * @route   PATCH /api/admin/users/:id/block
 * @access  Admin
 * 
 * Body: { block: true } or { block: false }
 */
router.patch('/users/:id/block', toggleUserBlock);

/**
 * @desc    Delete a user
 * @route   DELETE /api/admin/users/:id
 * @access  Admin
 */
router.delete('/users/:id', deleteUser);

/**
 * @desc    Get at-risk students (low CGPA or no marksheets)
 * @route   GET /api/admin/students/at-risk
 * @access  Admin
 */
router.get('/students/at-risk', getAtRiskStudents);

/**
 * @desc    Get skill trends (top 10 skills from resumes)
 * @route   GET /api/admin/skill-trends
 * @access  Admin
 */
router.get('/skill-trends', getSkillTrends);

/**
 * @desc    Get growth analytics for charts
 * @route   GET /api/admin/analytics/growth
 * @access  Admin
 * 
 * Query params:
 * - period: number of days (default: 30)
 */
router.get('/analytics/growth', getGrowthAnalytics);

export default router;

