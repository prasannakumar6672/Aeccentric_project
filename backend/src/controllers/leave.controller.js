import asyncHandler from 'express-async-handler';
import Leave    from '../models/Leave.js';
import Employee from '../models/Employee.js';

/* ─── helper ─────────────────────────────────── */
const notFound = (res) => res.status(404).json({ success: false, message: 'Leave not found' });

/* ═══════════════════════════════════════════════
   ADMIN — get ALL leave requests (with populate)
   GET /api/leaves?status=pending&page=1&limit=20
   ═══════════════════════════════════════════════ */
export const getLeaves = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 50 } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const leaves = await Leave.find(filter)
    .populate({ path: 'employee', select: 'fullName department designation employeeId' })
    .populate({ path: 'reviewedBy', select: 'fullName' })
    .sort({ createdAt: -1 })
    .skip((page - 1) * Number(limit))
    .limit(Number(limit));

  const total = await Leave.countDocuments(filter);
  const pending = await Leave.countDocuments({ status: 'pending' });

  res.json({ success: true, leaves, total, pending });
});

/* ═══════════════════════════════════════════════
   EMPLOYEE — get MY leave requests
   GET /api/leaves/my
   ═══════════════════════════════════════════════ */
export const getMyLeaves = asyncHandler(async (req, res) => {
  const emp = await Employee.findOne({ userId: req.user._id });
  if (!emp) return res.status(404).json({ success: false, message: 'Employee profile not found' });

  const filter = { employee: emp._id };
  if (req.query.status) filter.status = req.query.status;

  const leaves = await Leave.find(filter).sort({ createdAt: -1 });
  const allLeaves = await Leave.find({ employee: emp._id });
  const approvedDays = allLeaves
    .filter(l => l.status === 'approved')
    .reduce((s, l) => s + (l.days || 0), 0);
  const balance = {
    sick: emp.leaveBalance?.sick ?? 12,
    casual: emp.leaveBalance?.casual ?? 10,
    earned: emp.leaveBalance?.annual ?? emp.leaveBalance?.earned ?? 15,
    used: approvedDays,
  };
  balance.remaining = balance.sick + balance.casual + balance.earned;
  balance.total = balance.remaining + balance.used;

  const stats = {
    total:    allLeaves.length,
    pending:  allLeaves.filter(l => l.status === 'pending').length,
    approved: allLeaves.filter(l => l.status === 'approved').length,
    rejected: allLeaves.filter(l => l.status === 'rejected').length,
    totalDays: approvedDays,
  };
  res.json({ success: true, leaves, stats, balance });
});

/* ═══════════════════════════════════════════════
   EMPLOYEE — apply for leave
   POST /api/leaves
   ═══════════════════════════════════════════════ */
export const applyLeave = asyncHandler(async (req, res) => {
  const emp = await Employee.findOne({ userId: req.user._id });
  if (!emp) return res.status(404).json({ success: false, message: 'Employee profile not found' });

  const { type, startDate, endDate, reason } = req.body;
  if (!type || !startDate || !endDate) {
    return res.status(400).json({ success: false, message: 'type, startDate, endDate are required' });
  }

  const leave = await Leave.create({ employee: emp._id, type, startDate, endDate, reason });
  res.status(201).json({ success: true, message: 'Leave application submitted', leave });
});

/* ═══════════════════════════════════════════════
   EMPLOYEE — delete own pending leave
   DELETE /api/leaves/:id
   ═══════════════════════════════════════════════ */
export const cancelLeave = asyncHandler(async (req, res) => {
  const emp = await Employee.findOne({ userId: req.user._id });
  const leave = await Leave.findOne({ _id: req.params.id, employee: emp?._id });
  if (!leave) return notFound(res);
  if (leave.status !== 'pending') {
    return res.status(400).json({ success: false, message: 'Only pending leaves can be cancelled' });
  }
  await leave.deleteOne();
  res.json({ success: true, message: 'Leave cancelled successfully' });
});

/* ═══════════════════════════════════════════════
   ADMIN — approve / reject a leave
   PATCH /api/leaves/:id/review
   body: { action: 'approve'|'reject', reviewNote }
   ═══════════════════════════════════════════════ */
export const reviewLeave = asyncHandler(async (req, res) => {
  const { action, reviewNote } = req.body;
  if (!['approve', 'reject'].includes(action)) {
    return res.status(400).json({ success: false, message: "action must be 'approve' or 'reject'" });
  }

  const leave = await Leave.findById(req.params.id).populate('employee');
  if (!leave) return notFound(res);
  if (leave.status !== 'pending') {
    return res.status(400).json({ success: false, message: 'Leave already reviewed' });
  }

  const adminEmp = await Employee.findOne({ userId: req.user._id });
  leave.status     = action === 'approve' ? 'approved' : 'rejected';
  leave.reviewedBy = adminEmp?._id || null;
  leave.reviewNote = reviewNote || '';
  await leave.save();

  /* Update employee status if approved */
  if (action === 'approve' && leave.employee) {
    await Employee.findByIdAndUpdate(leave.employee._id, { status: 'on_leave' });
  }

  res.json({ success: true, message: `Leave ${leave.status}`, leave });
});

/* ═══════════════════════════════════════════════
   ADMIN — leave analytics
   GET /api/leaves/analytics
   ═══════════════════════════════════════════════ */
export const getLeaveAnalytics = asyncHandler(async (_req, res) => {
  const [byType, byStatus, monthly] = await Promise.all([
    Leave.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 }, totalDays: { $sum: '$days' } } },
      { $sort: { count: -1 } },
    ]),
    Leave.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Leave.aggregate([
      {
        $group: {
          _id: { year: { $year: '$startDate' }, month: { $month: '$startDate' } },
          count: { $sum: 1 },
          days: { $sum: '$days' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 },
    ]),
  ]);

  res.json({ success: true, byType, byStatus, monthly });
});
