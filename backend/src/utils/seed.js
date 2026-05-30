import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import Department from '../models/Department.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import Leave from '../models/Leave.js';
import Attendance from '../models/Attendance.js';
import Payroll from '../models/Payroll.js';
import ActivityLog from '../models/ActivityLog.js';
import Meeting from '../models/Meeting.js';
import Notification from '../models/Notification.js';
import Message from '../models/Message.js';
import Finance from '../models/Finance.js';
import Calendar from '../models/Calendar.js';
import Candidate from '../models/Candidate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI;
const PASSWORD = 'Aeccentric@123';

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is required to seed data.');
}

const departments = ['Engineering', 'Design', 'Marketing', 'Sales', 'HR', 'Operations'];

const people = [
  ['AEC001', 'Rahul Sharma', 'admin@aeccentric.com', 'admin', 'HR', 'Founder & Admin', 150000, ['Leadership', 'Operations', 'Strategy']],
  ['AEC002', 'Priya Nair', 'hr@aeccentric.com', 'hr', 'HR', 'HR Manager', 85000, ['Recruiting', 'HR Compliance', 'Onboarding']],
  ['AEC003', 'Arjun Reddy', 'arjun@aeccentric.com', 'employee', 'Engineering', 'Full Stack Developer', 95000, ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Next.js']],
  ['AEC004', 'Sneha Kapoor', 'sneha@aeccentric.com', 'employee', 'Design', 'Product Designer', 80000, ['Figma', 'Adobe XD', 'Framer', 'Tailwind', 'UI Design']],
  ['AEC005', 'Karthik Menon', 'karthik@aeccentric.com', 'employee', 'Engineering', 'Backend Developer', 75000, ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'Docker']],
  ['AEC006', 'Divya Iyer', 'divya@aeccentric.com', 'employee', 'Marketing', 'Growth Marketer', 70000, ['SEO', 'Google Ads', 'Meta Ads', 'Analytics', 'HubSpot']],
  ['AEC007', 'Rohit Verma', 'rohit@aeccentric.com', 'employee', 'Engineering', 'Frontend Developer', 68000, ['React', 'Next.js', 'Tailwind', 'JavaScript', 'GraphQL']],
  ['AEC008', 'Ananya Singh', 'ananya@aeccentric.com', 'employee', 'Sales', 'Sales Executive', 60000, ['CRM', 'Lead Gen', 'Negotiation', 'Salesforce', 'Excel']],
  ['AEC009', 'Vikram Rao', 'vikram@aeccentric.com', 'employee', 'Engineering', 'Mobile Developer', 72000, ['React Native', 'Flutter', 'Firebase', 'iOS', 'Android']],
  ['AEC010', 'Meera Joshi', 'meera@aeccentric.com', 'employee', 'Design', 'Brand Designer', 55000, ['Photoshop', 'Illustrator', 'Canva', 'Brand Design']],
  ['AEC011', 'Suresh Kumar', 'suresh@aeccentric.com', 'employee', 'Operations', 'DevOps Engineer', 88000, ['AWS', 'Docker', 'CI/CD', 'Linux', 'Kubernetes', 'Terraform']],
  ['AEC012', 'Nisha Patel', 'nisha@aeccentric.com', 'employee', 'Marketing', 'Content Strategist', 52000, ['Content Writing', 'SEO', 'Social Media', 'WordPress']],
];

const projectSpecs = [
  ['TechNova Corporate Website', 'TechNova Solutions', ['AEC003', 'AEC007'], 'active', 'high', 65, 250000, '2025-08-30'],
  ['GreenLeaf SEO Campaign', 'GreenLeaf Marketing', ['AEC006', 'AEC012'], 'active', 'medium', 40, 80000, '2025-07-15'],
  ['SwiftPay Mobile App', 'SwiftPay Fintech', ['AEC003', 'AEC005', 'AEC009'], 'active', 'critical', 30, 500000, '2025-09-30'],
  ['EduReach E-Learning Portal', 'EduReach Platform', ['AEC003', 'AEC004', 'AEC007'], 'review', 'high', 88, 320000, '2025-06-30'],
  ['FutureBuild Website Redesign', 'FutureBuild Infra', ['AEC004', 'AEC010'], 'planning', 'medium', 10, 180000, '2025-10-15'],
  ['Aeccentric Internal Brand Refresh', 'Internal', ['AEC004', 'AEC006', 'AEC010'], 'active', 'low', 55, 50000, '2025-07-31'],
];

const money = (n) => Math.round(n);

const buildPayroll = (employee, month, status, paymentDate) => {
  const basic = employee.salary;
  const hra = money(basic * 0.4);
  const travel = 2000;
  const medical = 1500;
  const pf = money(basic * 0.12);
  const professionalTax = 200;
  const tds = money(basic * 0.05);
  const allowances = hra + travel + medical;
  const deductions = pf + professionalTax + tds;

  return {
    employee: employee._id,
    month,
    salary: basic,
    allowances,
    deductions,
    netPayable: basic + allowances - deductions,
    status,
    paymentDate,
    earnings: { basic, hra, travel, medical, bonus: 0 },
    deductionBreakdown: { pf, professionalTax, tds },
    paymentMethod: status === 'paid' ? 'bank transfer' : '',
    payslipUrl: '',
  };
};

const weekdayDates = (days) => {
  const out = [];
  const cursor = new Date('2025-06-30T00:00:00.000Z');
  while (out.length < days) {
    if (![0, 6].includes(cursor.getDay())) out.push(new Date(cursor));
    cursor.setDate(cursor.getDate() - 1);
  }
  return out;
};

const seed = async () => {
  await mongoose.connect(MONGODB_URI);

  await Promise.all([
    User.deleteMany({}),
    Employee.deleteMany({}),
    Department.deleteMany({}),
    Project.deleteMany({}),
    Task.deleteMany({}),
    Leave.deleteMany({}),
    Attendance.deleteMany({}),
    Payroll.deleteMany({}),
    ActivityLog.deleteMany({}),
    Meeting.deleteMany({}),
    Notification.deleteMany({}),
    Message.deleteMany({}),
    Finance.deleteMany({}),
    Calendar.deleteMany({}),
    Candidate.deleteMany({}),
  ]);

  await Department.insertMany(departments.map((name, index) => ({
    name,
    code: name.slice(0, 3).toUpperCase(),
    budget: [500000, 160000, 180000, 140000, 120000, 220000][index],
  })));

  const usersByEmployeeId = new Map();
  const employeesByEmployeeId = new Map();

  for (const [employeeId, fullName, email, role, department, designation, salary, skills] of people) {
    const user = await User.create({ email, password: PASSWORD, role, isVerified: true });
    const employee = await Employee.create({
      userId: user._id,
      employeeId,
      fullName,
      department,
      designation,
      salary,
      skills,
      techStack: skills.slice(0, 3),
      phone: `+91 90000 ${employeeId.slice(-3).padStart(5, '0')}`,
      joiningDate: new Date('2024-04-01'),
      status: 'active',
      performanceScore: 82 + (Number(employeeId.slice(-2)) % 15),
      leaveBalance: { sick: 10, annual: 15, casual: 12 },
    });
    usersByEmployeeId.set(employeeId, user);
    employeesByEmployeeId.set(employeeId, employee);
  }

  const projects = [];
  for (const [name, client, teamIds, status, priority, progress, budget, deadline] of projectSpecs) {
    const team = teamIds.map((id) => employeesByEmployeeId.get(id));
    projects.push(await Project.create({
      name,
      client,
      description: `${name} delivery for ${client}.`,
      status,
      priority,
      progress,
      budget,
      lead: team[0]._id,
      members: team.map((member) => member._id),
      startDate: new Date('2025-06-01'),
      endDate: new Date(deadline),
      color: priority === 'critical' ? '#ef4444' : priority === 'high' ? '#2563eb' : '#10b981',
    }));
  }

  const taskStatuses = ['todo', 'todo', 'todo', 'todo', 'in_progress', 'in_progress', 'in_progress', 'in_progress', 'review', 'review', 'review', 'review', 'done', 'done', 'done'];
  const priorities = ['low', 'medium', 'high', 'critical', 'medium'];
  const taskTitles = [
    'Create homepage wireframes', 'Build auth interceptor', 'Write API validation rules', 'Prepare client kickoff deck',
    'Implement dashboard widgets', 'Optimize payroll query', 'QA mobile navigation', 'Draft SEO content plan',
    'Review React component library', 'Audit Mongo indexes', 'Validate payslip template', 'Review onboarding checklist',
    'Deploy staging build', 'Close leave balance bug', 'Publish announcement banner',
  ];

  for (let i = 0; i < taskTitles.length; i++) {
    const project = projects[i % projects.length];
    const members = project.members;
    await Task.create({
      title: taskTitles[i],
      description: `${taskTitles[i]} for ${project.name}.`,
      status: taskStatuses[i],
      priority: priorities[i % priorities.length],
      dueDate: new Date(2025, 6, 1 + i),
      assignedTo: members[i % members.length],
      assignedBy: usersByEmployeeId.get('AEC001')._id,
      project: project._id,
      tags: ['enterprise', 'ems'],
    });
  }

  const employees = [...employeesByEmployeeId.values()];
  const dates = weekdayDates(30);
  for (const employee of employees) {
    for (let i = 0; i < dates.length; i++) {
      const bucket = (i + Number(employee.employeeId.slice(-2))) % 10;
      const status = bucket === 0 ? 'absent' : bucket === 1 ? 'late' : 'present';
      const date = dates[i];
      if (status === 'absent') {
        await Attendance.create({ employee: employee._id, date, status: 'absent', workHours: 0 });
        continue;
      }
      const checkIn = new Date(date);
      checkIn.setHours(status === 'late' ? 9 : 8, status === 'late' ? 45 + (i % 30) : 45 + (i % 40), 0, 0);
      const checkOut = new Date(checkIn);
      checkOut.setMinutes(checkOut.getMinutes() + 480 + (i % 60));
      const workHours = Number(((checkOut - checkIn) / 3600000).toFixed(1));
      await Attendance.create({ employee: employee._id, date, checkIn, checkOut, status, workHours });
    }
  }

  const payrolls = [];
  for (const employee of employees) {
    payrolls.push(buildPayroll(employee, '2025-04', 'paid', new Date('2025-04-30')));
    payrolls.push(buildPayroll(employee, '2025-05', 'paid', new Date('2025-05-31')));
    payrolls.push(buildPayroll(employee, '2025-06', 'pending', null));
  }
  await Payroll.insertMany(payrolls);

  const leaveEmployees = ['AEC003', 'AEC004', 'AEC005', 'AEC006', 'AEC007', 'AEC008', 'AEC009', 'AEC010', 'AEC011', 'AEC012', 'AEC003', 'AEC004'];
  const leaveTypes = ['sick', 'casual', 'earned', 'casual', 'sick', 'casual', 'earned', 'sick', 'casual', 'earned', 'sick', 'casual'];
  const leaveStatuses = ['pending', 'pending', 'pending', 'pending', 'approved', 'approved', 'approved', 'approved', 'approved', 'rejected', 'rejected', 'rejected'];
  await Leave.insertMany(leaveEmployees.map((id, index) => ({
    employee: employeesByEmployeeId.get(id)._id,
    type: leaveTypes[index],
    startDate: new Date(2025, 6, 3 + index),
    endDate: new Date(2025, 6, 3 + index + (index % 2)),
    reason: ['Medical appointment', 'Family commitment', 'Planned travel', 'Personal work'][index % 4],
    status: leaveStatuses[index],
    reviewedBy: leaveStatuses[index] === 'pending' ? null : employeesByEmployeeId.get('AEC002')._id,
  })));

  await Meeting.insertMany([
    ['SwiftPay Project Kickoff', '2025-06-30T10:00:00', ['AEC001', 'AEC003', 'AEC005', 'AEC009']],
    ['Weekly Dev Standup', '2025-07-07T09:30:00', ['AEC003', 'AEC005', 'AEC007', 'AEC009', 'AEC011']],
    ['Q2 Company Review', '2025-07-05T15:00:00', people.map((p) => p[0])],
    ['EduReach Design Review', '2025-07-02T14:00:00', ['AEC003', 'AEC004', 'AEC007']],
    ['HR Policy Update', '2025-07-08T11:00:00', people.map((p) => p[0])],
  ].map(([title, start, ids]) => {
    const startTime = new Date(start);
    const endTime = new Date(startTime.getTime() + 45 * 60000);
    return {
      title,
      description: `${title} meeting`,
      startTime,
      endTime,
      duration: '45 mins',
      type: 'Online',
      organizer: employeesByEmployeeId.get('AEC001')._id,
      participants: ids.map((id) => employeesByEmployeeId.get(id)._id),
    };
  }));

  const notificationTypes = ['task', 'leave', 'payroll', 'meeting', 'general'];
  const notificationDocs = [];
  for (const [employeeId] of people) {
    const user = usersByEmployeeId.get(employeeId);
    for (let i = 0; i < 10; i++) {
      notificationDocs.push({
        recipient: user._id,
        title: ['Task update', 'Leave status', 'Payslip ready', 'Meeting reminder', 'Company announcement'][i % 5],
        message: `AECCENTRIC update ${i + 1} for ${employeeId}.`,
        type: notificationTypes[i % notificationTypes.length],
        read: i % 3 === 0,
      });
    }
  }
  await Notification.insertMany(notificationDocs);

  await Message.insertMany([
    ['Rahul Sharma', 'Arjun Reddy', 'SwiftPay scope', 'Please confirm the payment SDK milestones.'],
    ['Priya Nair', 'Sneha Kapoor', 'Onboarding assets', 'Can you review the new hire design checklist?'],
    ['Karthik Menon', 'Suresh Kumar', 'Redis deployment', 'The staging cache is ready for validation.'],
    ['Divya Iyer', 'Nisha Patel', 'SEO calendar', 'July content topics are queued for review.'],
    ['Rohit Verma', 'Arjun Reddy', 'Dashboard polish', 'I pushed the responsive table updates.'],
    ['Ananya Singh', 'Rahul Sharma', 'Client follow-up', 'SwiftPay wants a progress summary today.'],
    ['Vikram Rao', 'Karthik Menon', 'Mobile API', 'Push notification payload looks good now.'],
    ['Meera Joshi', 'Sneha Kapoor', 'Brand refresh', 'Final palette explorations are in Figma.'],
  ].map(([sender, recipient, subject, content]) => ({
    sender,
    recipient,
    subject,
    content,
    read: false,
    avatar: sender.split(' ').map((p) => p[0]).join(''),
  })));

  await ActivityLog.insertMany([
    { employee: employeesByEmployeeId.get('AEC001')._id, action: 'Seeded system data', details: 'Created AECCENTRIC enterprise EMS demo dataset.', department: 'Operations' },
    { employee: employeesByEmployeeId.get('AEC002')._id, action: 'Reviewed leave queue', details: 'Four pending leave requests require action.', department: 'HR' },
    { employee: employeesByEmployeeId.get('AEC003')._id, action: 'Updated project task', details: 'SwiftPay mobile app moved into active sprint.', department: 'Engineering' },
  ]);

  await Finance.insertMany(projectSpecs.map(([name,, , status,, , budget], index) => ({
    category: 'Services',
    description: `${name} budget`,
    amount: budget,
    type: status === 'active' ? 'income' : 'expense',
    status: 'Completed',
    date: new Date(2025, 5 + index, 5),
  })));

  await Candidate.insertMany([
    { name: 'Ishaan Mehta', role: 'Frontend Developer', status: 'Applied', date: 'Today' },
    { name: 'Tanvi Rao', role: 'Product Designer', status: 'Interviewing', date: 'Yesterday' },
    { name: 'Farhan Ali', role: 'DevOps Engineer', status: 'Offered', date: '2 days ago' },
  ]);

  console.log('AECCENTRIC EMS seed complete.');
  console.log('Admin login: admin@aeccentric.com / Aeccentric@123');
  console.log('HR login: hr@aeccentric.com / Aeccentric@123');
  console.log('Employee login: arjun@aeccentric.com / Aeccentric@123');
  await mongoose.disconnect();
};

seed().catch(async (error) => {
  console.error('Seed failed:', error);
  await mongoose.disconnect();
  process.exit(1);
});
