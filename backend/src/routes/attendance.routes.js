import { Router } from 'express';
import { checkIn, checkOut, getMyAttendance, getAttendanceLogs, getTodayStatus } from '../controllers/attendance.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/rbac.middleware.js';

const router = Router();

router.use(protect);

router.post('/check-in', checkIn);
router.post('/check-out', checkOut);
router.post('/clock-in', checkIn);
router.put('/clock-out', checkOut);
router.get('/today/status', getTodayStatus);
router.get('/my', getMyAttendance);
router.get('/', checkRole(['super_admin', 'admin', 'hr']), getAttendanceLogs);

export default router;
