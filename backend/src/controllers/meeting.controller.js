import asyncHandler from 'express-async-handler';
import Meeting from '../models/Meeting.js';
import Employee from '../models/Employee.js';

/* ─────────────────────────────────────────────────────────────
   GET /api/meetings/my
   Get meetings for logged-in employee (as organizer or participant)
   ───────────────────────────────────────────────────────────── */
export const getMyMeetings = asyncHandler(async (req, res) => {
  const employee = await Employee.findOne({ userId: req.user._id });
  if (!employee) {
    res.status(404);
    throw new Error('Employee profile not found');
  }

  const meetings = await Meeting.find({
    $or: [
      { organizer: employee._id },
      { participants: employee._id }
    ]
  })
  .populate('organizer', 'fullName designation')
  .populate('participants', 'fullName designation')
  .sort({ startTime: 1 });

  res.json({ success: true, meetings });
});

/* GET /api/meetings/today */
export const getTodayMeetings = asyncHandler(async (req, res) => {
  const employee = await Employee.findOne({ userId: req.user._id });
  if (!employee) {
    res.status(404);
    throw new Error('Employee profile not found');
  }

  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 1);

  const meetings = await Meeting.find({
    $or: [
      { organizer: employee._id },
      { participants: employee._id },
    ],
    startTime: { $gte: start, $lt: end },
  })
    .populate('organizer', 'fullName designation')
    .populate('participants', 'fullName designation')
    .sort({ startTime: 1 });

  res.json({ success: true, meetings });
});

/* ─────────────────────────────────────────────────────────────
   GET /api/meetings
   Get all meetings
   ───────────────────────────────────────────────────────────── */
export const getMeetings = asyncHandler(async (req, res) => {
  const meetings = await Meeting.find()
    .populate('organizer', 'fullName designation')
    .populate('participants', 'fullName designation')
    .sort({ startTime: 1 });

  res.json({ success: true, meetings });
});

/* ─────────────────────────────────────────────────────────────
   POST /api/meetings
   Create a meeting
   ───────────────────────────────────────────────────────────── */
export const createMeeting = asyncHandler(async (req, res) => {
  const { title, description, startTime, endTime, duration, type, participants } = req.body;

  if (!title || !startTime || !endTime) {
    res.status(400);
    throw new Error('Title, start time, and end time are required');
  }

  const organizerEmp = await Employee.findOne({ userId: req.user._id });
  if (!organizerEmp) {
    res.status(404);
    throw new Error('Employee profile not found');
  }

  const meeting = await Meeting.create({
    title,
    description,
    startTime,
    endTime,
    duration: duration || '30 mins',
    type: type || 'Online',
    organizer: organizerEmp._id,
    participants: participants || []
  });

  await meeting.populate([
    { path: 'organizer', select: 'fullName designation' },
    { path: 'participants', select: 'fullName designation' }
  ]);

  res.status(201).json({ success: true, meeting });
});
