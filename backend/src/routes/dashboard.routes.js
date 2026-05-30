import { Router } from 'express';
import {
  getAICopilot,
  createAICopilotPrompt,
  getReports,
  createReport,
  getFinance,
  createFinanceTransaction,
  getSecurity,
  createSecurityLog,
  getMessages,
  createMessage,
  getCalendar,
  createCalendarEvent,
  getIntegrations,
  toggleIntegrationStatus,
  getSettings,
  updateSettings,
  getAdminOverview,
  getEmployeeOverview,
  getAnalytics,
} from '../controllers/dashboard.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/rbac.middleware.js';

const router = Router();

// Protect all routes with JWT token verification
router.use(protect);

/* Employee Dashboard Overview (Accessible to all authenticated users) */
router.get('/employee-overview', getEmployeeOverview);

/* Messages (Accessible to all protected users) */
router.route('/messages')
  .get(getMessages)
  .post(createMessage);

// Restrict subsequent routes to admins / HR
router.use(checkRole(['super_admin', 'admin', 'hr']));

/* Admin Dashboard Overview */
router.get('/admin-overview', getAdminOverview);

/* Analytics */
router.get('/analytics', getAnalytics);

/* AI Copilot */
router.route('/ai-copilot')
  .get(getAICopilot)
  .post(createAICopilotPrompt);

/* Reports */
router.route('/reports')
  .get(getReports)
  .post(createReport);

/* Finance */
router.route('/finance')
  .get(getFinance)
  .post(createFinanceTransaction);

/* Security */
router.route('/security')
  .get(getSecurity)
  .post(createSecurityLog);

/* Calendar */
router.route('/calendar')
  .get(getCalendar)
  .post(createCalendarEvent);

/* Integrations */
router.route('/integrations')
  .get(getIntegrations);
router.route('/integrations/:id/toggle')
  .put(toggleIntegrationStatus);

/* Settings */
router.route('/settings')
  .get(getSettings)
  .put(updateSettings);

export default router;
