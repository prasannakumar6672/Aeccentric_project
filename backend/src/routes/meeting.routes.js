import { Router } from 'express';
import { getMyMeetings, getTodayMeetings, getMeetings, createMeeting } from '../controllers/meeting.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/rbac.middleware.js';

const router = Router();

router.use(protect);

router.get('/today', getTodayMeetings);
router.get('/my', getMyMeetings);
router.get('/', checkRole(['super_admin', 'admin', 'hr', 'manager']), getMeetings);
router.post('/', checkRole(['super_admin', 'admin', 'hr', 'manager']), createMeeting);

export default router;
