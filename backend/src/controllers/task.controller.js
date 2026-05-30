import asyncHandler from 'express-async-handler';
import Task from '../models/Task.js';
import Employee from '../models/Employee.js';

// GET /api/tasks
export const getTasks = asyncHandler(async (req, res) => {
  const { role } = req.user;
  let filter = {};
  const {
    assignedTo,
    dueDateToday,
    limit,
    sortBy = 'createdAt',
  } = req.query;

  if (!['super_admin', 'admin', 'hr', 'manager'].includes(role)) {
    const employee = await Employee.findOne({ userId: req.user._id });
    if (!employee) {
      return res.json({ success: true, tasks: [] });
    }
    filter.assignedTo = employee._id;
  }

  if (assignedTo === 'me') {
    const employee = await Employee.findOne({ userId: req.user._id });
    if (!employee) {
      return res.json({ success: true, tasks: [] });
    }
    filter.assignedTo = employee._id;
  }

  if (req.query.project) filter.project = req.query.project;
  if (req.query.status) {
    const statuses = String(req.query.status).split(',').filter(Boolean);
    filter.status = statuses.length > 1 ? { $in: statuses } : statuses[0];
  }
  if (dueDateToday === 'true') {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 1);
    filter.dueDate = { $gte: start, $lt: end };
  }

  const sort = {};
  sort[sortBy] = -1;

  const query = Task.find(filter)
    .populate('assignedTo', 'fullName employeeId designation profilePhoto')
    .populate('assignedBy', 'email role')
    .populate('project', 'name color')
    .sort(sort);

  if (limit) query.limit(Number(limit));

  const tasks = await query;

  res.json({ success: true, tasks });
});

// GET /api/tasks/my
export const getMyTasks = asyncHandler(async (req, res) => {
  const employee = await Employee.findOne({ userId: req.user._id });
  if (!employee) {
    return res.status(404).json({ success: false, message: 'Employee profile not found' });
  }

  const tasks = await Task.find({ assignedTo: employee._id })
    .populate('assignedTo', 'fullName employeeId designation profilePhoto')
    .populate('project', 'name color')
    .sort({ createdAt: -1 });

  res.json({ success: true, tasks });
});

// GET /api/tasks/:id
export const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('assignedTo', 'fullName employeeId designation profilePhoto')
    .populate('assignedBy', 'email role')
    .populate('project', 'name color');

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (!['super_admin', 'admin', 'hr', 'manager'].includes(req.user.role)) {
    const employee = await Employee.findOne({ userId: req.user._id });
    if (!employee || task.assignedTo._id.toString() !== employee._id.toString()) {
      res.status(403);
      throw new Error('Access denied to this task');
    }
  }

  res.json({ success: true, task });
});

// POST /api/tasks
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate, assignedTo, project, tags } = req.body;

  if (!title || !assignedTo) {
    res.status(400);
    throw new Error('Title and assigned employee are required');
  }

  const task = await Task.create({
    title,
    description,
    status: status || 'todo',
    priority: priority || 'medium',
    dueDate,
    assignedTo,
    assignedBy: req.user._id,
    project: project || null,
    tags: tags || [],
  });

  const populatedTask = await Task.findById(task._id)
    .populate('assignedTo', 'fullName employeeId designation profilePhoto')
    .populate('project', 'name color');

  res.status(201).json({ success: true, task: populatedTask });
});

// PUT /api/tasks/:id
export const updateTask = asyncHandler(async (req, res) => {
  const { role } = req.user;
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (!['super_admin', 'admin', 'hr', 'manager'].includes(role)) {
    const employee = await Employee.findOne({ userId: req.user._id });
    if (!employee || task.assignedTo.toString() !== employee._id.toString()) {
      res.status(403);
      throw new Error('Access denied to update this task');
    }

    if (req.body.status) {
      task.status = req.body.status;
    }
    await task.save();
  } else {
    const { title, description, status, priority, dueDate, assignedTo, project, tags } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;
    if (project !== undefined) task.project = project === '' ? null : project;
    if (tags !== undefined) task.tags = tags;

    await task.save();
  }

  const populatedTask = await Task.findById(task._id)
    .populate('assignedTo', 'fullName employeeId designation profilePhoto')
    .populate('project', 'name color');

  res.json({ success: true, task: populatedTask });
});

// DELETE /api/tasks/:id
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  await task.deleteOne();
  res.json({ success: true, message: 'Task deleted successfully' });
});
