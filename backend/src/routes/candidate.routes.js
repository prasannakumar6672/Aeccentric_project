import { Router } from 'express';
import { getCandidates, createCandidate, updateCandidateStatus } from '../controllers/candidate.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/rbac.middleware.js';

const router = Router();

router.use(protect);

router.route('/')
  .get(checkRole(['super_admin', 'admin', 'hr']), getCandidates)
  .post(checkRole(['super_admin', 'admin', 'hr']), createCandidate);

router.route('/:id/status')
  .patch(checkRole(['super_admin', 'admin', 'hr']), updateCandidateStatus);

export default router;
