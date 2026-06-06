import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { env, validateEnv } from './src/config/env.js';
import { connectDB } from './src/config/db.js';
import { rejectMongoOperatorKeys } from './src/middleware/security.middleware.js';
import authRoutes from './src/routes/auth.routes.js';
import employeeRoutes from './src/routes/employee.routes.js';
import dashboardRoutes from './src/routes/dashboard.routes.js';
import taskRoutes from './src/routes/task.routes.js';
import projectRoutes from './src/routes/project.routes.js';
import leaveRoutes  from './src/routes/leave.routes.js';
import attendanceRoutes from './src/routes/attendance.routes.js';
import payrollRoutes from './src/routes/payroll.routes.js';
import meetingRoutes from './src/routes/meeting.routes.js';
import candidateRoutes from './src/routes/candidate.routes.js';
import notificationRoutes from './src/routes/notification.routes.js';
import analyticsRoutes from './src/routes/analytics.routes.js';
import insightRoutes from './src/routes/insight.routes.js';
import achievementRoutes from './src/routes/achievement.routes.js';

validateEnv();

const app = express();
const PORT = env.port;
const allowedOrigins = env.clientUrl.split(',').map((origin) => origin.trim()).filter(Boolean);
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 600,
  standardHeaders: true,
  legacyHeaders: false,
});

/* ── Security & Middleware ── */
app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(rejectMongoOperatorKeys);
app.use(cookieParser());
app.use(morgan('dev'));
app.use('/api', apiLimiter);

/* ── Health Check ── */
app.get('/', (_req, res) => res.json({ status: 'ok', message: 'AECCENTRIC EMS API v1.0' }));

/* ── Routes ── */
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/leaves',  leaveRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/insights', insightRoutes);
app.use('/api/achievements', achievementRoutes);

/* ── 404 Handler ── */
app.use((_req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

/* ── Global Error Handler ── */
app.use((err, _req, res, _next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: Object.values(err.errors).map((item) => item.message).join(', '),
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: `Invalid ${err.path}` });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || err.keyValue || {})[0] || 'field';
    return res.status(409).json({ success: false, message: `${field} already exists` });
  }

  const status = err.statusCode || err.status || 500;
  if (status >= 500) {
    console.error(err.stack);
  }
  res.status(status).json({ success: false, message: err.message, stack: err.stack });
});

/* ── Start ── */
connectDB().then(() => {
  app.listen(PORT, () => console.log(`AECCENTRIC EMS API listening on port ${PORT}`));
});
