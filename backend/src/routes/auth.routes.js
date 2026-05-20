import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { signup, login, logout, refresh, forgotPassword, resetPassword, getMe } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

/* Rate limiter: max 10 login attempts per 15 min per IP */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many login attempts. Try again in 15 minutes.' },
  standardHeaders: true, legacyHeaders: false,
});

/* ─── Public Routes ─────────────────────────────────── */
router.post('/signup', signup);
router.post('/login', loginLimiter, login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

/* ─── Protected Routes ──────────────────────────────── */
router.get('/me', protect, getMe);

export default router;
