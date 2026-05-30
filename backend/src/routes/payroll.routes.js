import { Router } from 'express';
import { getMyPayroll, getPayrolls, createOrUpdatePayroll } from '../controllers/payroll.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/rbac.middleware.js';

const router = Router();

router.use(protect);

router.get('/my', getMyPayroll);
router.get('/', checkRole(['super_admin', 'admin', 'hr']), getPayrolls);
router.post('/', checkRole(['super_admin', 'admin', 'hr']), createOrUpdatePayroll);

export default router;
