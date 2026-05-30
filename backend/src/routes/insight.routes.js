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

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const [tasks, projects, attendance] = await Promise.all([
    Task.find({ assignedTo: employee._id }).populate('project', 'name endDate'),
    Project.find({ $or: [{ lead: employee._id }, { members: employee._id }], status: 'active' }),
    Attendance.find({ employee: employee._id, date: { $gte: monthStart } }),
  ]);

  const completed = tasks.filter(task => completedStatuses.includes(task.status)).length;
  const completionRate = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  const overdue = tasks.filter(task => task.dueDate && new Date(task.dueDate) < today && !completedStatuses.includes(task.status)).length;
  const streak = attendance.filter(row => ['present', 'late'].includes(row.status)).length;
  const closestProject = projects
    .filter(project => project.endDate)
    .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))[0];

  const insights = [
    overdue > 0
      ? { icon: 'AlertTriangle', tone: 'danger', title: `${overdue} overdue task${overdue > 1 ? 's' : ''}`, text: 'Review deadlines and clear blockers before new work starts.' }
      : { icon: 'Target', tone: 'success', title: `${completionRate}% sprint completion`, text: 'Your current task flow is tracking steadily this week.' },
    { icon: 'Zap', tone: 'info', title: `${streak}-day attendance streak`, text: `${Math.max(0, 30 - streak)} more days toward Monthly Champion.` },
  ];

  if (closestProject) {
    const daysLeft = Math.max(0, Math.ceil((new Date(closestProject.endDate) - today) / 86400000));
    insights.push({
      icon: 'Clock',
      tone: daysLeft < 7 ? 'warning' : 'neutral',
      title: `${closestProject.name} deadline in ${daysLeft} days`,
      text: 'Prioritize assigned project tasks with the nearest deadline first.',
    });
  }

  res.json({ success: true, insights });
}));

export default router;
