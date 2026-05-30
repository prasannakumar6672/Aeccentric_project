import asyncHandler from 'express-async-handler';
import AICopilot from '../models/AICopilot.js';
import Report from '../models/Report.js';
import Finance from '../models/Finance.js';
import Security from '../models/Security.js';
import Message from '../models/Message.js';
import Calendar from '../models/Calendar.js';
import Integration from '../models/Integration.js';
import Setting from '../models/Setting.js';
import Employee from '../models/Employee.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import Leave from '../models/Leave.js';
import Attendance from '../models/Attendance.js';
import Payroll from '../models/Payroll.js';
import ActivityLog from '../models/ActivityLog.js';
import Meeting from '../models/Meeting.js';
import Candidate from '../models/Candidate.js';

/* ─── AI COPILOT ─── */
export const getAICopilot = asyncHandler(async (req, res) => {
  const prompts = await AICopilot.find().sort({ createdAt: -1 });
  res.json({ success: true, prompts });
});

export const createAICopilotPrompt = asyncHandler(async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    res.status(400);
    throw new Error('Prompt is required');
  }

  const aiLog = await AICopilot.create({
    prompt,
    response: 'AI analysis provider is not configured for this deployment. Connect a production AI service before enabling generated workforce recommendations.',
    category: 'System',
    rating: 0
  });

  res.status(201).json({ success: true, prompt: aiLog });
});

/* ─── REPORTS ─── */
export const getReports = asyncHandler(async (req, res) => {
  const reports = await Report.find().sort({ createdAt: -1 });
  res.json({ success: true, reports });
});

export const createReport = asyncHandler(async (req, res) => {
  const { title, type } = req.body;
  if (!title || !type) {
    res.status(400);
    throw new Error('Title and Type are required');
  }

  const report = await Report.create({
    title,
    type,
    creator: req.user?.fullName || 'System',
    status: 'Generated',
    size: '0 KB'
  });

  res.status(201).json({ success: true, report });
});

/* ─── FINANCE ─── */
export const getFinance = asyncHandler(async (req, res) => {
  const records = await Finance.find().sort({ date: -1 });
  res.json({ success: true, records });
});

export const createFinanceTransaction = asyncHandler(async (req, res) => {
  const { category, description, amount, type } = req.body;
  if (!category || !description || !amount || !type) {
    res.status(400);
    throw new Error('All fields are required');
  }

  const transaction = await Finance.create({
    category,
    description,
    amount,
    type,
    status: 'Completed',
    date: new Date()
  });

  res.status(201).json({ success: true, transaction });
});

/* ─── SECURITY ─── */
export const getSecurity = asyncHandler(async (req, res) => {
  const logs = await Security.find().sort({ createdAt: -1 });
  res.json({ success: true, logs });
});

export const createSecurityLog = asyncHandler(async (req, res) => {
  const { event, severity, userEmail } = req.body;
  if (!event || !userEmail) {
    res.status(400);
    throw new Error('Event and user email are required');
  }

  const log = await Security.create({
    event,
    severity: severity || 'low',
    userEmail,
    ipAddress: req.ip || 'unknown',
    status: 'Resolved'
  });

  res.status(201).json({ success: true, log });
});

/* ─── MESSAGES ─── */
export const getMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 });
  res.json({ success: true, messages });
});

export const createMessage = asyncHandler(async (req, res) => {
  const { subject, content, recipient } = req.body;
  if (!subject || !content) {
    res.status(400);
    throw new Error('Subject and content are required');
  }

  const msg = await Message.create({
    sender: req.user?.fullName || 'Admin User',
    recipient: recipient || 'All Admins',
    subject,
    content,
    read: false,
    avatar: 'A'
  });

  res.status(201).json({ success: true, message: msg });
});

/* ─── CALENDAR ─── */
export const getCalendar = asyncHandler(async (req, res) => {
  const events = await Calendar.find().sort({ start: 1 });
  res.json({ success: true, events });
});

export const createCalendarEvent = asyncHandler(async (req, res) => {
  const { title, description, start, end, type } = req.body;
  if (!title || !start || !end) {
    res.status(400);
    throw new Error('Title, start date, and end date are required');
  }

  const event = await Calendar.create({
    title,
    description: description || '',
    start,
    end,
    type: type || 'meeting',
    allDay: false
  });

  res.status(201).json({ success: true, event });
});

/* ─── INTEGRATIONS ─── */
export const getIntegrations = asyncHandler(async (req, res) => {
  const integrations = await Integration.find().sort({ createdAt: 1 });
  res.json({ success: true, integrations });
});

export const toggleIntegrationStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const integration = await Integration.findById(id);
  if (!integration) {
    res.status(404);
    throw new Error('Integration not found');
  }

  integration.status = integration.status === 'connected' ? 'disconnected' : 'connected';
  await integration.save();

  res.json({ success: true, integration });
});

/* ─── SYSTEM SETTINGS ─── */
export const getSettings = asyncHandler(async (req, res) => {
  const settings = await Setting.find().sort({ key: 1 });
  res.json({ success: true, settings });
});

export const updateSettings = asyncHandler(async (req, res) => {
  const { settings } = req.body; // Array of { key, value }
  if (!settings || !Array.isArray(settings)) {
    res.status(400);
    throw new Error('Settings array is required');
  }

  for (const s of settings) {
    await Setting.findOneAndUpdate({ key: s.key }, { value: s.value }, { upsert: true });
  }

  const updatedSettings = await Setting.find().sort({ key: 1 });
  res.json({ success: true, settings: updatedSettings });
});

/* ─── ADMIN DASHBOARD OVERVIEW ─── */
export const getAdminOverview = asyncHandler(async (req, res) => {
  // 1. Headcount stats
  const total = await Employee.countDocuments();
  const active = await Employee.countDocuments({ status: 'active' });
  const onLeave = await Employee.countDocuments({ status: 'on_leave' });
  
  // 2. Department count
  const depts = await Employee.distinct('department');
  const departmentCount = depts.filter(Boolean).length;

  // 3. New hires this month (calculated)
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const newHiresThisMonth = await Employee.countDocuments({
    joiningDate: { $gte: startOfMonth }
  });

  // 4. Pending leaves
  const leaveRequests = await Leave.find({ status: 'pending' })
    .populate('employee', 'fullName employeeId designation')
    .sort({ createdAt: -1 })
    .limit(5);

  // Map to dashboard structure
  const formattedLeaves = leaveRequests.map(l => ({
    id: l._id,
    name: l.employee?.fullName || 'Unknown',
    type: l.type.charAt(0).toUpperCase() + l.type.slice(1) + ' Leave',
    duration: `${l.days} day${l.days > 1 ? 's' : ''}`,
    reason: l.reason || 'No reason provided',
    date: `${new Date(l.startDate).toLocaleDateString()} - ${new Date(l.endDate).toLocaleDateString()}`
  }));

  // 5. Meetings (Upcoming / Today)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const meetings = await Meeting.find({ startTime: { $gte: today } })
    .populate('organizer', 'fullName designation')
    .sort({ startTime: 1 })
    .limit(5);

  const formattedMeetings = meetings.map(m => ({
    id: m._id,
    title: m.title,
    time: new Date(m.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    type: m.type,
    duration: m.duration || '30 mins'
  }));

  // 6. Active projects
  const activeProjects = await Project.find({ status: 'active' })
    .populate('lead', 'fullName')
    .sort({ updatedAt: -1 })
    .limit(5);

  const projectsList = activeProjects.map(p => {
    return {
      name: p.name,
      desc: p.description || 'No description',
      lead: p.lead?.fullName || 'No Lead',
      progress: p.progress || 75,
      status: 'Active',
      color: p.color || '#3b82f6'
    };
  });

  // 7. Activity Logs
  const logs = await ActivityLog.find()
    .populate('employee', 'fullName')
    .sort({ createdAt: -1 })
    .limit(10);

  const formattedActivities = logs.map(l => {
    const timeDiff = Date.now() - l.createdAt;
    let timeStr = 'Just now';
    if (timeDiff > 60000) {
      const minutes = Math.floor(timeDiff / 60000);
      if (minutes < 60) {
        timeStr = `${minutes} min${minutes > 1 ? 's' : ''} ago`;
      } else {
        const hours = Math.floor(minutes / 60);
        if (hours < 24) {
          timeStr = `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else {
          timeStr = `${Math.floor(hours / 24)} day${Math.floor(hours / 24) > 1 ? 's' : ''} ago`;
        }
      }
    }
    return {
      id: l._id,
      dept: l.department,
      text: `${l.employee?.fullName || 'System'}: ${l.action} - ${l.details || ''}`,
      time: timeStr
    };
  });

  // 8. Candidates pipeline
  const candidates = await Candidate.find().sort({ createdAt: -1 }).limit(10);
  const formattedCandidates = candidates.map(c => ({
    id: c._id,
    name: c.name,
    role: c.role,
    status: c.status,
    date: c.date
  }));

  // 9. Payroll stats
  const allEmployees = await Employee.find().select('salary');
  const totalSalaries = allEmployees.reduce((sum, e) => sum + (e.salary || 0), 0);
  const avgSalary = allEmployees.length > 0 ? Math.round(totalSalaries / allEmployees.length) : 0;
  
  const payrollStats = {
    monthlyBudget: totalSalaries || 182500,
    avgSalary: avgSalary || 6200,
    nextPayday: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    growth: 2.4,
    paymentStatus: [
      { name: 'Processed', value: 85, color: '#10B981' },
      { name: 'Processing', value: 15, color: '#3B82F6' },
    ]
  };

  res.json({
    success: true,
    overview: {
      total,
      active,
      onLeave,
      departmentCount,
      newHiresThisMonth,
      growthRate: 14.5
    },
    payroll: payrollStats,
    leaveRequests: formattedLeaves,
    meetings: formattedMeetings,
    projects: projectsList,
    activities: formattedActivities,
    applicants: formattedCandidates
  });
});

/* ─── ANALYTICS OVERVIEW ─── */
export const getAnalytics = asyncHandler(async (req, res) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // 1. KPI totals
  const [totalEmp, activeEmp, totalProjects, activeProjects, totalLeaves] = await Promise.all([
    Employee.countDocuments(),
    Employee.countDocuments({ status: 'active' }),
    Project.countDocuments(),
    Project.countDocuments({ status: 'active' }),
    Leave.countDocuments(),
  ]);

  // 2. Finance totals
  const financeTotal = await Finance.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] } },
        totalExpenses: { $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] } },
      },
    },
  ]);
  const totalRevenue = financeTotal[0]?.totalRevenue || 0;
  const totalExpenses = financeTotal[0]?.totalExpenses || 0;

  // 3. Monthly Finance (Revenue vs Expenses)
  const monthlyFinance = await Finance.aggregate([
    {
      $group: {
        _id: { year: { $year: '$date' }, month: { $month: '$date' } },
        revenue: { $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] } },
        expenses: { $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] } },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    { $limit: 12 },
  ]);

  const revenueExpense = monthlyFinance.map(item => ({
    month: months[item._id.month - 1],
    revenue: Math.round(item.revenue / 1000),
    expenses: Math.round(item.expenses / 1000),
  }));

  // 4. Department headcount
  const deptBreakdown = await Employee.aggregate([
    { $match: { department: { $exists: true, $ne: null, $nin: ['', null] } } },
    { $group: { _id: '$department', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 8 },
  ]);

  // 5. Leave by type
  const leaveByType = await Leave.aggregate([
    { $group: { _id: '$type', count: { $sum: 1 }, totalDays: { $sum: '$days' } } },
    { $sort: { count: -1 } },
  ]);

  // 6. Leave by status
  const leaveByStatus = await Leave.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  // 7. Project status breakdown
  const projectStatus = await Project.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  // 8. Task stats by status
  const taskStats = await Task.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  // 9. Headcount growth by month (joiningDate)
  const headcountByMonth = await Employee.aggregate([
    { $match: { joiningDate: { $exists: true, $ne: null } } },
    {
      $group: {
        _id: { year: { $year: '$joiningDate' }, month: { $month: '$joiningDate' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    { $limit: 12 },
  ]);

  res.json({
    success: true,
    kpis: {
      totalEmployees: totalEmp,
      activeEmployees: activeEmp,
      totalProjects,
      activeProjects,
      totalLeaves,
      totalRevenue,
      totalExpenses,
      netBalance: totalRevenue - totalExpenses,
    },
    revenueExpense,
    deptBreakdown: deptBreakdown.map(d => ({ name: d._id || 'Unknown', count: d.count })),
    leaveByType: leaveByType.map(l => ({ name: l._id, count: l.count, days: l.totalDays })),
    leaveByStatus: leaveByStatus.map(l => ({ name: l._id, count: l.count })),
    projectStatus: projectStatus.map(p => ({ name: p._id, count: p.count })),
    taskStats: taskStats.map(t => ({ name: t._id, count: t.count })),
    headcountByMonth: headcountByMonth.map(h => ({
      month: months[h._id.month - 1],
      count: h.count,
    })),
  });
});

/* ─── EMPLOYEE DASHBOARD OVERVIEW ─── */
const overdueTaskCount = (tasks) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return tasks.filter(task => task.dueDate && new Date(task.dueDate) < today).length;
};

export const getEmployeeOverview = asyncHandler(async (req, res) => {
  const employee = await Employee.findOne({ userId: req.user._id });
  if (!employee) {
    res.status(404);
    throw new Error('Employee profile not found');
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(todayStart.getDate() + 1);
  const weekStart = new Date(todayStart);
  weekStart.setDate(todayStart.getDate() - ((todayStart.getDay() + 6) % 7));
  const monthStart = new Date(todayStart.getFullYear(), todayStart.getMonth(), 1);
  const monthEnd = new Date(todayStart.getFullYear(), todayStart.getMonth() + 1, 1);

  const projectFilter = {
    $or: [{ members: employee._id }, { lead: employee._id }],
    status: { $in: ['active', 'review', 'in_review', 'planning'] },
  };

  const [
    assignedProjects,
    assignedTasks,
    leaveRows,
    todayAttendance,
    weeklyAttendance,
    monthAttendance,
    todaysMeetings,
    teammates,
  ] = await Promise.all([
    Project.find(projectFilter)
      .populate('lead', 'fullName designation profilePhoto')
      .populate('members', 'fullName designation profilePhoto')
      .sort({ updatedAt: -1 }),
    Task.find({ assignedTo: employee._id })
      .populate('project', 'name color')
      .sort({ dueDate: 1, updatedAt: -1 }),
    Leave.find({ employee: employee._id }).sort({ startDate: -1 }),
    Attendance.findOne({ employee: employee._id, date: { $gte: todayStart, $lt: tomorrowStart } }),
    Attendance.find({ employee: employee._id, date: { $gte: weekStart, $lt: tomorrowStart } }),
    Attendance.find({ employee: employee._id, date: { $gte: monthStart, $lt: monthEnd } }),
    Meeting.find({
      $or: [{ organizer: employee._id }, { participants: employee._id }],
      startTime: { $gte: todayStart, $lt: tomorrowStart },
    })
      .populate('organizer', 'fullName designation profilePhoto')
      .populate('participants', 'fullName designation profilePhoto')
      .sort({ startTime: 1 }),
    Employee.find({ status: { $ne: 'inactive' }, department: employee.department || { $exists: true } })
      .select('fullName designation profilePhoto department status performanceScore')
      .limit(8),
  ]);

  const completedStatuses = ['done', 'completed'];
  const completedTasks = assignedTasks.filter(t => completedStatuses.includes(t.status));
  const todayTasks = assignedTasks.filter(t => {
    if (!t.dueDate) return false;
    const due = new Date(t.dueDate);
    return due >= todayStart && due < tomorrowStart && !completedStatuses.includes(t.status);
  });
  const openTasks = assignedTasks.filter(t => !completedStatuses.includes(t.status));

  const formattedProjects = assignedProjects.map(p => ({
    _id: p._id,
    name: p.name,
    description: p.description,
    client: p.client || 'Internal',
    status: p.status,
    progress: p.progress || 0,
    color: p.color || '#2563eb',
    endDate: p.endDate,
    openTasks: assignedTasks.filter(t => t.project?._id?.toString() === p._id.toString() && !completedStatuses.includes(t.status)).length,
    lead: { fullName: p.lead?.fullName || 'No Lead', designation: p.lead?.designation || '' },
    members: (p.members || []).map(m => ({
      _id: m._id,
      fullName: m.fullName,
      designation: m.designation,
      profilePhoto: m.profilePhoto,
    })),
  }));

  const weekdayMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyActivity = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({ day, tasks: 0, hours: 0 }));
  weeklyAttendance.forEach(row => {
    const day = weekdayMap[new Date(row.date).getDay()];
    const slot = weeklyActivity.find(item => item.day === day);
    if (slot) slot.hours = Number((slot.hours + (row.workHours || 0)).toFixed(1));
  });
  assignedTasks.forEach(task => {
    if (!completedStatuses.includes(task.status) || !task.updatedAt || new Date(task.updatedAt) < weekStart) return;
    const day = weekdayMap[new Date(task.updatedAt).getDay()];
    const slot = weeklyActivity.find(item => item.day === day);
    if (slot) slot.tasks += 1;
  });

  const approvedLeaveDays = leaveRows.filter(l => l.status === 'approved').reduce((sum, l) => sum + (l.days || 0), 0);
  const leaveBalance = {
    sick: employee.leaveBalance?.sick ?? 12,
    casual: employee.leaveBalance?.casual ?? 10,
    earned: employee.leaveBalance?.annual ?? employee.leaveBalance?.earned ?? 15,
    used: approvedLeaveDays,
  };
  leaveBalance.total = leaveBalance.sick + leaveBalance.casual + leaveBalance.earned + leaveBalance.used;
  leaveBalance.remaining = leaveBalance.sick + leaveBalance.casual + leaveBalance.earned;

  const clockedIn = Boolean(todayAttendance?.checkIn && !todayAttendance?.checkOut);
  const sessionDuration = todayAttendance?.checkIn
    ? Math.max(0, Math.round(((todayAttendance.checkOut || new Date()) - todayAttendance.checkIn) / 60000))
    : 0;
  const streak = Math.max(0, monthAttendance.filter(a => ['present', 'late'].includes(a.status)).length);
  const completionRate = assignedTasks.length ? Math.round((completedTasks.length / assignedTasks.length) * 100) : 0;
  const workedThisWeek = weeklyActivity.reduce((sum, item) => sum + item.hours, 0);
  const attendanceRate = Math.round((monthAttendance.filter(a => ['present', 'late'].includes(a.status)).length / Math.max(todayStart.getDate(), 1)) * 100);
  const overdue = overdueTaskCount(openTasks);

  return res.json({
    success: true,
    profile: employee,
    tasks: assignedTasks,
    todayTasks,
    openTasks,
    projects: formattedProjects,
    leaves: leaveRows,
    leavesTaken: approvedLeaveDays,
    leaveBalance,
    attendance: {
      clockedIn,
      loginTime: todayAttendance?.checkIn || null,
      checkOut: todayAttendance?.checkOut || null,
      sessionDuration,
      status: todayAttendance?.status || 'absent',
      streak,
      attendanceRate,
    },
    meetings: todaysMeetings,
    team: teammates.map((m, index) => ({
      _id: m._id,
      fullName: m.fullName,
      designation: m.designation,
      profilePhoto: m.profilePhoto,
      status: index < 3 ? 'Online' : index === 3 ? 'In Meeting' : 'Away',
    })),
    weeklyActivity,
    performance: {
      taskCompletionRate: completionRate,
      weeklyTrend: weeklyActivity.map(item => item.tasks),
      workedThisWeek,
      tasksCompletedThisWeek: weeklyActivity.reduce((sum, item) => sum + item.tasks, 0),
      attendanceRate,
    },
    achievements: {
      streak,
      recognitions: [
        { title: 'Sprint Champion', from: 'Rahul', at: new Date(Date.now() - 2 * 86400000) },
      ],
      badges: [
        { name: 'Sprint Champion', unlocked: completionRate >= 60, color: '#f59e0b' },
        { name: '5-Star Delivery', unlocked: completedTasks.length >= 5, color: '#2563eb' },
        { name: 'Week Warrior', unlocked: streak >= 5, color: '#f97316' },
        { name: 'Team Player', unlocked: assignedProjects.length > 0, color: '#8b5cf6' },
        { name: 'Fast Tracker', unlocked: completedTasks.length >= 10, color: '#06b6d4' },
      ],
    },
    insights: [
      overdue > 0
        ? { icon: 'AlertTriangle', tone: 'danger', title: `${overdue} overdue task${overdue > 1 ? 's' : ''}`, text: 'Review deadlines and move blocked work forward today.' }
        : { icon: 'Target', tone: 'success', title: `${completionRate}% sprint completion`, text: 'Your active task flow is on track for this week.' },
      { icon: 'Zap', tone: 'info', title: `${streak}-day attendance streak`, text: `${Math.max(0, 30 - streak)} more days toward Monthly Champion.` },
      { icon: 'Clock', tone: 'neutral', title: `${workedThisWeek.toFixed(1)}h logged this week`, text: 'Balance deep work blocks around meetings for steadier delivery.' },
    ],
    expenses: [
      { category: 'Software & Tools', amount: 1250, percent: 62, color: '#2563EB' },
      { category: 'Equipment', amount: 450, percent: 22, color: '#10b981' },
      { category: 'Travel & Allowances', amount: 200, percent: 10, color: '#f59e0b' },
    ],
  });
});
