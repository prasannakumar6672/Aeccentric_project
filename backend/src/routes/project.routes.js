import { Router } from 'express';
import {
  getProjects,
  getMyProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
} from '../controllers/project.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/rbac.middleware.js';

const router = Router();

router.use(protect);

router.get('/my', getMyProjects);

router.route('/')
  .get(getProjects)
  .post(checkRole(['super_admin', 'admin', 'hr', 'manager']), createProject);

router.route('/:id')
  .get(getProject)
  .put(checkRole(['super_admin', 'admin', 'hr', 'manager']), updateProject)
  .delete(checkRole(['super_admin', 'admin', 'hr', 'manager']), deleteProject);

export default router;
