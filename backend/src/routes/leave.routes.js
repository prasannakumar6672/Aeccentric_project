import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/rbac.middleware.js';
import {
  getLeaves,
  getMyLeaves,
  applyLeave,
  cancelLeave,
  reviewLeave,
  getLeaveAnalytics,
} from '../controllers/leave.controller.js';

const router = express.Router();

/* All routes require authentication */
router.use(protect);

/* ── Employee routes ── */
router.get('/my',      getMyLeaves);
router.post('/',       applyLeave);
router.delete('/:id',  cancelLeave);

/* ── Admin / HR routes ── */
const adminOnly = checkRole(['super_admin', 'admin', 'hr']);
router.get('/',             adminOnly, getLeaves);
router.get('/analytics',    adminOnly, getLeaveAnalytics);
router.patch('/:id/review', adminOnly, reviewLeave);

export default router;
