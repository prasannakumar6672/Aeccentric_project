import asyncHandler from 'express-async-handler';
import Project from '../models/Project.js';
import Employee from '../models/Employee.js';
import Task from '../models/Task.js';

const attachProjectProgress = async (projectDoc) => {
  const project = projectDoc.toObject ? projectDoc.toObject() : projectDoc;
  const totalTasks = await Task.countDocuments({ project: project._id });
  const completedTasks = await Task.countDocuments({ project: project._id, status: 'completed' });
  project.progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  project.totalTasks = totalTasks;
  project.completedTasks = completedTasks;
  return project;
};

// GET /api/projects
export const getProjects = asyncHandler(async (req, res) => {
  const { role } = req.user;
  let filter = {};

  if (!['super_admin', 'admin', 'hr', 'manager'].includes(role)) {
    const employee = await Employee.findOne({ userId: req.user._id });
    if (!employee) {
      return res.json({ success: true, projects: [] });
    }
    filter.$or = [
      { lead: employee._id },
      { members: employee._id }
    ];
  }

  if (req.query.member === 'me') {
    const employee = await Employee.findOne({ userId: req.user._id });
    if (!employee) {
      return res.json({ success: true, projects: [] });
    }
    filter.$or = [
      { lead: employee._id },
      { members: employee._id },
    ];
  }

  if (req.query.status) {
    const statuses = String(req.query.status).split(',').filter(Boolean);
    filter.status = statuses.length > 1 ? { $in: statuses } : statuses[0];
  }

  const projects = await Project.find(filter)
    .populate('lead', 'fullName employeeId designation profilePhoto')
    .populate('members', 'fullName employeeId designation profilePhoto')
    .sort({ createdAt: -1 });

  const projectsWithProgress = await Promise.all(
    projects.map(p => attachProjectProgress(p))
  );

  res.json({ success: true, projects: projectsWithProgress });
});

// GET /api/projects/my
export const getMyProjects = asyncHandler(async (req, res) => {
  const employee = await Employee.findOne({ userId: req.user._id });
  if (!employee) {
    return res.status(404).json({ success: false, message: 'Employee profile not found' });
  }

  const projects = await Project.find({
    $or: [
      { lead: employee._id },
      { members: employee._id }
    ]
  })
    .populate('lead', 'fullName employeeId designation profilePhoto')
    .populate('members', 'fullName employeeId designation profilePhoto')
    .sort({ createdAt: -1 });

  const projectsWithProgress = await Promise.all(
    projects.map(p => attachProjectProgress(p))
  );

  res.json({ success: true, projects: projectsWithProgress });
});

// GET /api/projects/:id
export const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('lead', 'fullName employeeId designation profilePhoto')
    .populate('members', 'fullName employeeId designation profilePhoto');

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  if (!['super_admin', 'admin', 'hr', 'manager'].includes(req.user.role)) {
    const employee = await Employee.findOne({ userId: req.user._id });
    if (!employee) {
      res.status(403);
      throw new Error('Access denied to this project');
    }
    const isLead = project.lead._id.toString() === employee._id.toString();
    const isMember = project.members.some(m => m._id.toString() === employee._id.toString());
    if (!isLead && !isMember) {
      res.status(403);
      throw new Error('Access denied to this project');
    }
  }

  const projectWithProgress = await attachProjectProgress(project);
  res.json({ success: true, project: projectWithProgress });
});

// POST /api/projects
export const createProject = asyncHandler(async (req, res) => {
  const { name, description, status, lead, members, startDate, endDate, color } = req.body;

  if (!name || !lead) {
    res.status(400);
    throw new Error('Project name and leader are required');
  }

  const project = await Project.create({
    name,
    description,
    status: status || 'planning',
    lead,
    members: members || [],
    startDate,
    endDate,
    color: color || '#4f46e5',
  });

  const populated = await Project.findById(project._id)
    .populate('lead', 'fullName employeeId designation profilePhoto')
    .populate('members', 'fullName employeeId designation profilePhoto');

  const withProgress = await attachProjectProgress(populated);
  res.status(201).json({ success: true, project: withProgress });
});

// PUT /api/projects/:id
export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const { name, description, status, lead, members, startDate, endDate, color } = req.body;

  if (name !== undefined) project.name = name;
  if (description !== undefined) project.description = description;
  if (status !== undefined) project.status = status;
  if (lead !== undefined) project.lead = lead;
  if (members !== undefined) project.members = members;
  if (startDate !== undefined) project.startDate = startDate;
  if (endDate !== undefined) project.endDate = endDate;
  if (color !== undefined) project.color = color;

  await project.save();

  const populated = await Project.findById(project._id)
    .populate('lead', 'fullName employeeId designation profilePhoto')
    .populate('members', 'fullName employeeId designation profilePhoto');

  const withProgress = await attachProjectProgress(populated);
  res.json({ success: true, project: withProgress });
});

// DELETE /api/projects/:id
export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  await Task.updateMany({ project: project._id }, { project: null });

  await project.deleteOne();
  res.json({ success: true, message: 'Project deleted successfully' });
});
