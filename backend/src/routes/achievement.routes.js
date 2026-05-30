import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { protect } from '../middleware/auth.middleware.js';
import Employee from '../models/Employee.js';
import Task from '../models/Task.js';
import Project from '../models/Project.js';
import Attendance from '../models/Attendance.js';

const router = Router();
const completedStatuses = ['done', 'completed'];

router.use(protect);

router.get('/me', asyncHandler(async (req, res) => {
  const employee = await Employee.findOne({ userId: req.user._id });
  if (!employee) {
    res.status(404);
    throw new Error('Employee profile not found');
  }

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [tasks, projects, attendance] = await Promise.all([
    Task.find({ assignedTo: employee._id }).select('status'),
    Project.find({ $or: [{ lead: employee._id }, { members: employee._id }] }).select('_id'),
    Attendance.find({ employee: employee._id, date: { $gte: monthStart } }).select('status'),
  ]);

  const completed = tasks.filter(task => completedStatuses.includes(task.status)).length;
  const completionRate = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  const streak = attendance.filter(row => ['present', 'late'].includes(row.status)).length;

  res.json({
    success: true,
    streak,
    recognitions: [
      { title: 'Sprint Champion', from: 'Rahul', at: new Date(Date.now() - 2 * 86400000) },
    ],
    badges: [
      { name: 'Sprint Champion', unlocked: completionRate >= 60, color: '#f59e0b' },
      { name: '5-Star Delivery', unlocked: completed >= 5, color: '#2563eb' },
      { name: 'Week Warrior', unlocked: streak >= 5, color: '#f97316' },
      { name: 'Team Player', unlocked: projects.length > 0, color: '#8b5cf6' },
      { name: 'Fast Tracker', unlocked: completed >= 10, color: '#06b6d4' },
    ],
  });
}));

export default router;
