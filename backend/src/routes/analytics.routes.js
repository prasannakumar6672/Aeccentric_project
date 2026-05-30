import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { protect } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/rbac.middleware.js';
import Employee from '../models/Employee.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import Leave from '../models/Leave.js';
import Attendance from '../models/Attendance.js';

const router = Router();

router.use(protect);

const completedStatuses = ['done', 'completed'];

const getEmployeeForRequest = async (req, res) => {
  const employee = await Employee.findOne({ userId: req.user._id });
  if (!employee) {
    res.status(404);
    throw new Error('Employee profile not found');
  }
  return employee;
};

const getWeekBounds = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  return { start, end, today };
};

const buildWeeklyActivity = (tasks, attendanceRows, start) => {
  const weekdayMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyActivity = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({ day, tasks: 0, hours: 0 }));

  attendanceRows.forEach(row => {
    const day = weekdayMap[new Date(row.date).getDay()];
    const slot = weeklyActivity.find(item => item.day === day);
    if (slot) slot.hours = Number((slot.hours + (row.workHours || 0)).toFixed(1));
  });

  tasks.forEach(task => {
    if (!completedStatuses.includes(task.status) || !task.updatedAt || new Date(task.updatedAt) < start) return;
    const day = weekdayMap[new Date(task.updatedAt).getDay()];
    const slot = weeklyActivity.find(item => item.day === day);
    if (slot) slot.tasks += 1;
  });

  return weeklyActivity;
};

router.get('/my-performance', asyncHandler(async (req, res) => {
  const employee = await getEmployeeForRequest(req, res);
  const { start, end, today } = getWeekBounds();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const [tasks, weekAttendance, monthAttendance] = await Promise.all([
    Task.find({ assignedTo: employee._id }).select('status updatedAt'),
    Attendance.find({ employee: employee._id, date: { $gte: start, $lt: end } }),
    Attendance.find({ employee: employee._id, date: { $gte: monthStart, $lt: new Date(today.getFullYear(), today.getMonth() + 1, 1) } }),
  ]);

  const completed = tasks.filter(task => completedStatuses.includes(task.status)).length;
  const weeklyActivity = buildWeeklyActivity(tasks, weekAttendance, start);

  res.json({
    success: true,
    taskCompletionRate: tasks.length ? Math.round((completed / tasks.length) * 100) : 0,
    weeklyTrend: weeklyActivity.map(item => item.tasks),
    workedThisWeek: weeklyActivity.reduce((sum, item) => sum + item.hours, 0),
    tasksCompletedThisWeek: weeklyActivity.reduce((sum, item) => sum + item.tasks, 0),
    attendanceRate: Math.round((monthAttendance.filter(a => ['present', 'late'].includes(a.status)).length / Math.max(today.getDate(), 1)) * 100),
  });
}));

router.get('/my-weekly', asyncHandler(async (req, res) => {
  const employee = await getEmployeeForRequest(req, res);
  const { start, end } = getWeekBounds();

  const [tasks, attendanceRows] = await Promise.all([
    Task.find({ assignedTo: employee._id }).select('status updatedAt'),
    Attendance.find({ employee: employee._id, date: { $gte: start, $lt: end } }),
  ]);

  const weeklyActivity = buildWeeklyActivity(tasks, attendanceRows, start);

  res.json({
    success: true,
    range: req.query.range || 'current',
    data: weeklyActivity,
    summary: {
      workedHours: weeklyActivity.reduce((sum, item) => sum + item.hours, 0),
      completedTasks: weeklyActivity.reduce((sum, item) => sum + item.tasks, 0),
    },
  });
}));

router.use(checkRole('super_admin', 'admin', 'hr'));

router.get('/overview', asyncHandler(async (_req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const [
    totalEmployees,
    activeProjects,
    activeBudget,
    presentToday,
    pendingLeaves,
    tasksCompletedThisWeek,
    completedProjects,
    totalProjects,
    monthlyAttendance,
  ] = await Promise.all([
    Employee.countDocuments({ status: { $ne: 'inactive' } }),
    Project.countDocuments({ status: 'active' }),
    Project.aggregate([{ $match: { status: 'active' } }, { $group: { _id: null, total: { $sum: '$budget' } } }]),
    Attendance.countDocuments({ date: today, status: { $in: ['present', 'late'] } }),
    Leave.countDocuments({ status: 'pending' }),
    Task.countDocuments({ status: { $in: ['done', 'completed'] }, updatedAt: { $gte: weekStart } }),
    Project.countDocuments({ status: 'completed' }),
    Project.countDocuments(),
    Attendance.find({ date: { $gte: monthStart }, status: { $in: ['present', 'late'] } }).select('employee'),
  ]);

  const projectCompletionRate = totalProjects ? ((completedProjects / totalProjects) * 100).toFixed(1) : '0.0';
  const avgAttendanceThisMonth = totalEmployees
    ? ((monthlyAttendance.length / (totalEmployees * Math.max(today.getDate(), 1))) * 100).toFixed(1)
    : '0.0';

  res.json({
    success: true,
    data: {
      totalEmployees,
      activeProjects,
      revenueThisMonth: activeBudget[0]?.total || 0,
      presentToday,
      pendingLeaves,
      tasksCompletedThisWeek,
      projectCompletionRate,
      avgAttendanceThisMonth,
    },
  });
}));

router.get('/projects', asyncHandler(async (_req, res) => {
  const statusBreakdown = await Project.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  res.json({
    success: true,
    data: statusBreakdown.reduce((acc, row) => ({ ...acc, [row._id]: row.count }), {}),
  });
}));

router.get('/attendance', asyncHandler(async (req, res) => {
  const year = Number(req.query.year || new Date().getFullYear());
  const month = Number(req.query.month || new Date().getMonth() + 1);
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  const rows = await Attendance.aggregate([
    { $match: { date: { $gte: start, $lt: end } } },
    {
      $group: {
        _id: { date: '$date', status: '$status' },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.date': 1 } },
  ]);

  const byDate = new Map();
  rows.forEach((row) => {
    const key = row._id.date.toISOString().slice(0, 10);
    const current = byDate.get(key) || { date: key, present: 0, late: 0, absent: 0 };
    current[row._id.status] = row.count;
    byDate.set(key, current);
  });

  res.json({ success: true, data: [...byDate.values()] });
}));

export default router;
