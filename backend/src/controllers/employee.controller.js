import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Employee from '../models/Employee.js';

/* ─────────────────────────────────────────────────────────────
   GET /api/employees
   Admin/HR: all employees with full profile
   Manager/Employee: returns only self
───────────────────────────────────────────────────────────── */
export const getEmployees = asyncHandler(async (req, res) => {
  const { role: userRole } = req.user;
  const { department, status, role, search, page = 1, limit = 20 } = req.query;

  let filter = {};
  // Non-admins only see themselves
  if (!['super_admin', 'admin', 'hr', 'manager'].includes(userRole)) {
    filter.userId = req.user._id;
  }
  if (department) filter.department = department;
  if (status) filter.status = status;
  
  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { employeeId: { $regex: search, $options: 'i' } },
      { designation: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  // Filtering by role requires checking the User document
  let matchUser = {};
  if (role) matchUser.role = role;

  const [employees, total] = await Promise.all([
    Employee.find(filter)
      .populate({
        path: 'userId',
        select: 'email role isActive lastLogin',
        match: matchUser
      })
      .populate('reportsTo', 'fullName employeeId')
      .sort({ createdAt: -1 }),
    Employee.countDocuments(filter),
  ]);

  // Filter out employees where userId didn't match the role (due to .populate match)
  const filteredEmployees = role 
    ? employees.filter(emp => emp.userId !== null) 
    : employees;

  const paginatedEmployees = filteredEmployees.slice(skip, skip + parseInt(limit));

  res.json({ 
    success: true, 
    total: role ? filteredEmployees.length : total, 
    page: parseInt(page), 
    pages: Math.ceil((role ? filteredEmployees.length : total) / limit), 
    employees: paginatedEmployees 
  });
});

/* ─────────────────────────────────────────────────────────────
   GET /api/employees/:id
───────────────────────────────────────────────────────────── */
export const getEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id)
    .populate('userId', 'email role isActive lastLogin')
    .populate('reportsTo', 'fullName employeeId designation');

  if (!employee) { res.status(404); throw new Error('Employee not found'); }

  // Employees can only read their own profile
  if (!['super_admin', 'admin', 'hr', 'manager'].includes(req.user.role)) {
    if (employee.userId._id.toString() !== req.user._id.toString()) {
      res.status(403); throw new Error('Access denied');
    }
  }

  res.json({ success: true, employee });
});

/* ─────────────────────────────────────────────────────────────
   POST /api/employees
   Admin / HR creates a new employee account
   Body: { fullName, email, password, role, department, designation, phone, joiningDate, salary }
───────────────────────────────────────────────────────────── */
export const createEmployee = asyncHandler(async (req, res) => {
  const { 
    fullName, email, password, role, department, designation, phone, 
    joiningDate, techStack, skills, experienceLevel, experience, 
    linkedinUrl, githubUrl, address, emergencyContact, bio 
  } = req.body;

  if (!fullName || !email || !password) {
    res.status(400); throw new Error('fullName, email, and password are required');
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) { res.status(409); throw new Error('Email already in use'); }

  const user = await User.create({ email, password, role: role || 'employee' });
  const employee = await Employee.create({
    userId: user._id,
    fullName,
    department,
    designation,
    phone,
    joiningDate: joiningDate || Date.now(),
    techStack: techStack || [],
    skills: skills || [],
    experienceLevel: experienceLevel || 'junior',
    experience: experience || 0,
    linkedinUrl: linkedinUrl || '',
    githubUrl: githubUrl || '',
    address: address || {},
    emergencyContact: emergencyContact || {},
    bio: bio || ''
  });

  res.status(201).json({ success: true, message: 'Employee created', employee });
});

/* ─────────────────────────────────────────────────────────────
   PUT /api/employees/:id
   Admin / HR / Self update
───────────────────────────────────────────────────────────── */
export const updateEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) { res.status(404); throw new Error('Employee not found'); }

  const isSelf = employee.userId.toString() === req.user._id.toString();
  const isAdminOrHR = ['super_admin', 'admin', 'hr'].includes(req.user.role);
  if (!isSelf && !isAdminOrHR) { res.status(403); throw new Error('Access denied'); }

  // Fields self can update
  const selfFields = [
    'fullName', 'phone', 'bio', 'skills', 'techStack', 
    'profilePhoto', 'linkedinUrl', 'githubUrl', 'address', 'emergencyContact'
  ];
  // Admin-only fields
  const adminFields = [
    'department', 'designation', 'status', 'reportsTo', 
    'joiningDate', 'experienceLevel', 'experience'
  ];

  const allowedFields = isSelf ? selfFields : [...selfFields, ...adminFields];
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) employee[field] = req.body[field];
  });

  await employee.save();

  // Update role if provided by admin
  if (isAdminOrHR && req.body.role) {
    await User.findByIdAndUpdate(employee.userId, { role: req.body.role });
  }

  await employee.populate('userId', 'email role');
  res.json({ success: true, message: 'Employee updated', employee });
});

/* ─────────────────────────────────────────────────────────────
   DELETE /api/employees/:id
   Super admin / Admin only — soft delete (isActive → false)
───────────────────────────────────────────────────────────── */
export const deleteEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) { res.status(404); throw new Error('Employee not found'); }

  // Soft-delete: mark user inactive + employee status
  await User.findByIdAndUpdate(employee.userId, { isActive: false });
  employee.status = 'inactive';
  await employee.save();

  res.json({ success: true, message: 'Employee deactivated successfully' });
});

/* ─────────────────────────────────────────────────────────────
   GET /api/employees/stats
   Admin: quick KPI numbers
───────────────────────────────────────────────────────────── */
export const getStats = asyncHandler(async (req, res) => {
  const [total, active, onLeave, departments] = await Promise.all([
    Employee.countDocuments(),
    Employee.countDocuments({ status: 'active' }),
    Employee.countDocuments({ status: 'on_leave' }),
    Employee.distinct('department'),
  ]);

  res.json({ success: true, stats: { total, active, onLeave, departmentCount: departments.length } });
});
