import asyncHandler from 'express-async-handler';
import Payroll from '../models/Payroll.js';
import Employee from '../models/Employee.js';

/* ─────────────────────────────────────────────────────────────
   GET /api/payroll/my
   Retrieve own pay stub history
   ───────────────────────────────────────────────────────────── */
export const getMyPayroll = asyncHandler(async (req, res) => {
  const employee = await Employee.findOne({ userId: req.user._id });
  if (!employee) {
    res.status(404);
    throw new Error('Employee profile not found');
  }

  const history = await Payroll.find({ employee: employee._id }).sort({ month: -1 });
  res.json({ success: true, payrolls: history });
});

/* ─────────────────────────────────────────────────────────────
   GET /api/payroll
   Admin / HR: retrieve payroll history of all employees
   ───────────────────────────────────────────────────────────── */
export const getPayrolls = asyncHandler(async (req, res) => {
  const { month, employeeId } = req.query;
  let filter = {};

  if (month) filter.month = month;
  if (employeeId) filter.employee = employeeId;

  const records = await Payroll.find(filter)
    .populate('employee', 'fullName employeeId department designation salary')
    .sort({ month: -1 });

  res.json({ success: true, payrolls: records });
});

/* ─────────────────────────────────────────────────────────────
   POST /api/payroll
   Admin / HR: Add or update a payroll record
   ───────────────────────────────────────────────────────────── */
export const createOrUpdatePayroll = asyncHandler(async (req, res) => {
  const { employeeId, month, salary, allowances, deductions, status, paymentDate } = req.body;

  if (!employeeId || !month || salary === undefined) {
    res.status(400);
    throw new Error('Employee ID, month, and salary amount are required');
  }

  const employee = await Employee.findById(employeeId);
  if (!employee) {
    res.status(404);
    throw new Error('Employee not found');
  }

  const basicSalary = Number(salary);
  const allow = Number(allowances || 0);
  const deduct = Number(deductions || 0);
  const netPayable = basicSalary + allow - deduct;

  const record = await Payroll.findOneAndUpdate(
    { employee: employeeId, month },
    {
      salary: basicSalary,
      allowances: allow,
      deductions: deduct,
      netPayable,
      status: status || 'unpaid',
      paymentDate: status === 'processed' ? (paymentDate || new Date()) : null,
    },
    { new: true, upsert: true }
  );

  res.status(201).json({ success: true, payroll: record });
});
