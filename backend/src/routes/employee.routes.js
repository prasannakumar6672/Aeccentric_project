import { Router } from 'express';
import {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getStats,
} from '../controllers/employee.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/rbac.middleware.js';

const router = Router();

// All employee routes require authentication
router.use(protect);

/* ─── Stats Route ─────────────────────────────────────────── */
router.get('/stats', checkRole(['super_admin', 'admin', 'hr', 'manager']), getStats);

/* ─── Standard CRUD ───────────────────────────────────────── */
router.route('/')
  .get(getEmployees) // any authenticated user can list (controller filters by role)
  .post(checkRole(['super_admin', 'admin', 'hr']), createEmployee);

router.route('/:id')
  .get(getEmployee) // any authenticated user can view (controller filters by role)
  .put(updateEmployee) // self or admin/hr
  .delete(checkRole(['super_admin', 'admin']), deleteEmployee);

export default router;
