import asyncHandler from 'express-async-handler';
import Attendance from '../models/Attendance.js';
import Employee from '../models/Employee.js';

// Helper: start of today in local date
const getStartOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const getTodayRange = () => {
  const start = getStartOfToday();
  const end = new Date(start);
  end.setDate(start.getDate() + 1);
  return { start, end };
};

const getSessionDuration = (checkIn, checkOut) => {
  if (!checkIn) return 0;
  const end = checkOut || new Date();
  return Math.max(0, Math.round((end - checkIn) / 60000));
};

/* ─────────────────────────────────────────────────────────────
   POST /api/attendance/check-in
   Mark present and log start time
   ───────────────────────────────────────────────────────────── */
export const checkIn = asyncHandler(async (req, res) => {
  const employee = await Employee.findOne({ userId: req.user._id });
  if (!employee) {
    res.status(404);
    throw new Error('Employee profile not found');
  }

  const today = getStartOfToday();
  const existing = await Attendance.findOne({ employee: employee._id, date: today });
  if (existing) {
    res.status(400);
    throw new Error('Already checked in for today');
  }

  const record = await Attendance.create({
    employee: employee._id,
    date: today,
    checkIn: new Date(),
    status: 'present'
  });

  res.status(201).json({ success: true, message: 'Check-in successful', record });
});

/* ─────────────────────────────────────────────────────────────
   POST /api/attendance/check-out
   Log end time and calculate work hours
   ───────────────────────────────────────────────────────────── */
export const checkOut = asyncHandler(async (req, res) => {
  const employee = await Employee.findOne({ userId: req.user._id });
  if (!employee) {
    res.status(404);
    throw new Error('Employee profile not found');
  }

  const today = getStartOfToday();
  const record = await Attendance.findOne({ employee: employee._id, date: today });
  if (!record) {
    res.status(400);
    throw new Error('No check-in record found for today');
  }
  if (record.checkOut) {
    res.status(400);
    throw new Error('Already checked out for today');
  }

  record.checkOut = new Date();
  // Calculate hours
  const diffMs = record.checkOut - record.checkIn;
  const hours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));
  record.workHours = hours;

  await record.save();

  res.json({ success: true, message: 'Check-out successful', record });
});

/* ─────────────────────────────────────────────────────────────
   GET /api/attendance/my
   Get authenticated employee's logs
   ───────────────────────────────────────────────────────────── */
export const getMyAttendance = asyncHandler(async (req, res) => {
  const employee = await Employee.findOne({ userId: req.user._id });
  if (!employee) {
    res.status(404);
    throw new Error('Employee profile not found');
  }

  const { status, date } = req.query;
  let filter = { employee: employee._id };

  if (date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    filter.date = d;
  }
  if (status && status !== 'All') {
    filter.status = status;
  }

  const sortOrder = req.query.sort === 'asc' ? 1 : -1;

  const logs = await Attendance.find(filter).sort({ date: sortOrder });
  res.json({ success: true, logs });
});

/* GET /api/attendance/today/status */
export const getTodayStatus = asyncHandler(async (req, res) => {
  const employee = await Employee.findOne({ userId: req.user._id });
  if (!employee) {
    res.status(404);
    throw new Error('Employee profile not found');
  }

  const { start, end } = getTodayRange();
  const record = await Attendance.findOne({
    employee: employee._id,
    date: { $gte: start, $lt: end },
  });

  const clockedIn = Boolean(record?.checkIn && !record?.checkOut);

  res.json({
    success: true,
    clockedIn,
    loginTime: record?.checkIn || null,
    checkOut: record?.checkOut || null,
    sessionDuration: getSessionDuration(record?.checkIn, record?.checkOut),
    status: record?.status || 'absent',
    record,
  });
});

/* ─────────────────────────────────────────────────────────────
   GET /api/attendance
   Admin / HR: get all logs
   ───────────────────────────────────────────────────────────── */
export const getAttendanceLogs = asyncHandler(async (req, res) => {
  const { employeeId, date, status, sort } = req.query;
  let filter = {};

  if (employeeId) filter.employee = employeeId;
  if (date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    filter.date = d;
  }
  if (status && status !== 'All') {
    filter.status = status;
  }

  const sortOrder = sort === 'asc' ? 1 : -1;

  const logs = await Attendance.find(filter)
    .populate('employee', 'fullName employeeId department designation')
    .sort({ date: sortOrder });

  res.json({ success: true, logs });
});
