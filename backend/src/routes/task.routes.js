import { Router } from 'express';
import {
  getTasks,
  getMyTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
} from '../controllers/task.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/rbac.middleware.js';

const router = Router();

router.use(protect);

router.get('/my', getMyTasks);

router.route('/')
  .get(getTasks)
  .post(checkRole(['super_admin', 'admin', 'hr', 'manager']), createTask);

router.route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(checkRole(['super_admin', 'admin', 'hr', 'manager']), deleteTask);

export default router;
