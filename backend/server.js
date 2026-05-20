import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './src/config/db.js';
import authRoutes from './src/routes/auth.routes.js';
import employeeRoutes from './src/routes/employee.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* ── Security & Middleware ── */
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

/* ── Health Check ── */
app.get('/', (_req, res) => res.json({ status: 'ok', message: 'AECCENTRIC EMS API v1.0' }));

/* ── Routes ── */
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);

/* ── 404 Handler ── */
app.use((_req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

/* ── Global Error Handler ── */
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  const status = err.statusCode || 500;
  res.status(status).json({ success: false, message: err.message || 'Internal server error' });
});

/* ── Start ── */
connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 AECCENTRIC EMS API running on http://localhost:${PORT}`));
});
