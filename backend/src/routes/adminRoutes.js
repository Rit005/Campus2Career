import express from 'express';
import { 
  getOverview, 
  getUsers, 
  toggleUserBlock, 
  deleteUser, 
  getAtRiskStudents, 
  getSkillTrends,
  getGrowthAnalytics,
  getAdmins
} from '../controllers/adminController.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(requireRole('admin'));

router.get('/overview', getOverview);

router.get('/users', getUsers);

router.patch('/users/:id/block', toggleUserBlock);

router.delete('/users/:id', deleteUser);

router.get('/students/at-risk', getAtRiskStudents);

router.get('/skill-trends', getSkillTrends);

router.get('/analytics/growth', getGrowthAnalytics);

router.get('/admins', getAdmins);

export default router;

