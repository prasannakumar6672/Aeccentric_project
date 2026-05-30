import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'node:dns';

// Models
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import Leave from '../models/Leave.js';
import Attendance from '../models/Attendance.js';
import Payroll from '../models/Payroll.js';
import ActivityLog from '../models/ActivityLog.js';
import Meeting from '../models/Meeting.js';
import Candidate from '../models/Candidate.js';
import Notification from '../models/Notification.js';
import AICopilot from '../models/AICopilot.js';
import Report from '../models/Report.js';
import Finance from '../models/Finance.js';
import Security from '../models/Security.js';
import Message from '../models/Message.js';
import Calendar from '../models/Calendar.js';
import Integration from '../models/Integration.js';
import Setting from '../models/Setting.js';
import Department from '../models/Department.js';
import Performance from '../models/Performance.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is required to seed the full system.');
}

const applyMongoDnsFallback = () => {
  const dnsServers = (process.env.MONGODB_DNS_SERVERS || '')
    .split(',')
    .map((server) => server.trim())
    .filter(Boolean);

  if (MONGODB_URI.startsWith('mongodb+srv://') && dnsServers.length > 0) {
    dns.setServers(dnsServers);
  }
};

const seedData = async () => {
  try {
    applyMongoDnsFallback();

    console.log('Connecting to database...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    console.log('Clearing existing collections...');
    await User.deleteMany({});
    await Employee.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    await Leave.deleteMany({});
    await Attendance.deleteMany({});
    await Payroll.deleteMany({});
    await ActivityLog.deleteMany({});
    await Meeting.deleteMany({});
    await Candidate.deleteMany({});
    await AICopilot.deleteMany({});
    await Report.deleteMany({});
    await Finance.deleteMany({});
    await Security.deleteMany({});
    await Message.deleteMany({});
    await Calendar.deleteMany({});
    await Integration.deleteMany({});
    await Setting.deleteMany({});
    await Department.deleteMany({});
    await Performance.deleteMany({});

    console.log('Creating departments...');
    const depts = [
      { name: 'Engineering', code: 'ENG', budget: 500000 },
      { name: 'HR', code: 'HRD', budget: 120000 },
      { name: 'Finance', code: 'FIN', budget: 150000 },
      { name: 'Marketing', code: 'MKT', budget: 180000 },
      { name: 'Design', code: 'DSN', budget: 140000 },
      { name: 'Sales', code: 'SAL', budget: 175000 },
      { name: 'Operations', code: 'OPS', budget: 220000 },
      { name: 'Support', code: 'SUP', budget: 95000 },
    ];
    const createdDepts = await Department.insertMany(depts);
    console.log(`Created ${createdDepts.length} departments.`);

    // Roles map
    const roles = [
      { name: 'AI Engineer', dept: 'Engineering', skills: ['Python', 'PyTorch', 'OpenAI', 'Transformers', 'FastAPI'], salary: 115000 },
      { name: 'Full Stack Developer', dept: 'Engineering', skills: ['React', 'Node.js', 'Express', 'MongoDB', 'TypeScript'], salary: 98000 },
      { name: 'UI/UX Designer', dept: 'Design', skills: ['Figma', 'Sketch', 'Wireframing', 'Prototyping', 'User Research'], salary: 85000 },
      { name: 'DevOps Engineer', dept: 'Engineering', skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform'], salary: 105000 },
      { name: 'ML Engineer', dept: 'Engineering', skills: ['Python', 'TensorFlow', 'Scikit-learn', 'Docker', 'Kubeflow'], salary: 120000 },
      { name: 'Backend Developer', dept: 'Engineering', skills: ['Node.js', 'PostgreSQL', 'Redis', 'Docker', 'REST APIs'], salary: 90000 },
      { name: 'Frontend Developer', dept: 'Engineering', skills: ['HTML', 'CSS', 'JavaScript', 'React', 'TailwindCSS'], salary: 80000 },
      { name: 'Project Manager', dept: 'Engineering', skills: ['Agile', 'Jira', 'Scrum', 'Product Roadmap', 'Risk Management'], salary: 110000 },
      { name: 'HR Manager', dept: 'HR', skills: ['Recruiting', 'Talent Management', 'HR Compliance', 'Onboarding'], salary: 78000 },
      { name: 'Marketing Specialist', dept: 'Marketing', skills: ['SEO', 'Google Ads', 'Content Strategy', 'Social Media'], salary: 72000 },
      { name: 'Data Analyst', dept: 'Finance', skills: ['SQL', 'Python', 'Tableau', 'PowerBI', 'Excel'], salary: 82000 },
      { name: 'QA Engineer', dept: 'Engineering', skills: ['Selenium', 'Cypress', 'Automation', 'Jest', 'Postman'], salary: 82000 },
      { name: 'Automation Engineer', dept: 'Engineering', skills: ['Python', 'Selenium', 'CI/CD', 'Ansible', 'Bash'], salary: 95000 },
      { name: 'Product Designer', dept: 'Design', skills: ['Figma', 'UI/UX Design', 'User Testing', 'InVision'], salary: 88000 },
      { name: 'Cloud Engineer', dept: 'Engineering', skills: ['AWS', 'Azure', 'Linux', 'Terraform', 'Networking'], salary: 108000 },
      { name: 'Account Executive', dept: 'Sales', skills: ['CRM', 'Negotiation', 'Salesforce', 'Forecasting'], salary: 76000 },
      { name: 'Customer Success Manager', dept: 'Support', skills: ['Customer Success', 'Zendesk', 'Retention', 'Escalations'], salary: 74000 },
      { name: 'Operations Analyst', dept: 'Operations', skills: ['Process Mapping', 'Excel', 'SOPs', 'Vendor Management'], salary: 70000 },
      { name: 'Finance Executive', dept: 'Finance', skills: ['Payroll', 'Invoices', 'GST', 'Budgeting'], salary: 68000 },
    ];

    // Seed 20 employee records
    console.log('Seeding 20 employee profiles...');
    const usersToCreate = [];
    const employeesToCreate = [];

    // 1. Admin
    const adminUser = await User.create({
      email: 'admin@gmail.com',
      password: 'admin123',
      role: 'admin',
      isActive: true,
      isVerified: true
    });
    usersToCreate.push(adminUser);
    const adminEmployee = await Employee.create({
      userId: adminUser._id,
      fullName: 'Sravan Kumar',
      phone: '+1 (555) 019-1111',
      designation: 'Chief Executive Officer & Founder',
      department: 'Management',
      experienceLevel: 'principal',
      experience: 12,
      skills: ['Leadership', 'Strategic Planning', 'HR Policies', 'Conflict Resolution'],
      techStack: ['Workday', 'BambooHR'],
      bio: 'Leading vision, scale, and enterprise strategy for AECCENTRIC global operations.',
      linkedinUrl: 'https://www.linkedin.com/in/sravan-kumar',
      address: { city: 'Bengaluru', state: 'Karnataka', zipCode: '560001', country: 'India' },
      emergencyContact: { name: 'Anika Kumar', relationship: 'Spouse', phone: '+91 98765 11111' },
      joiningDate: new Date('2023-05-15'),
      status: 'active',
      salary: 130000,
      performanceScore: 96,
      leaveBalance: { sick: 10, annual: 15, casual: 8 }
    });

    // 2. Demo Employee
    const demoEmployeeUser = await User.create({
      email: 'employee@gmail.com',
      password: 'employee123',
      role: 'employee',
      isActive: true,
      isVerified: true
    });
    usersToCreate.push(demoEmployeeUser);
    const demoEmployeeProfile = await Employee.create({
      userId: demoEmployeeUser._id,
      fullName: 'Alexander Pierce',
      phone: '+1 (555) 019-2834',
      designation: 'Senior Frontend Architect',
      department: 'Engineering',
      experienceLevel: 'senior',
      experience: 6,
      skills: ['React', 'TypeScript', 'TailwindCSS', 'Redux Toolkit'],
      techStack: ['MERN Stack', 'Next.js', 'Vite'],
      bio: 'Frontend architect passionate about responsive layout rendering, dynamic animations, and state management.',
      linkedinUrl: 'https://www.linkedin.com/in/alexander-pierce',
      githubUrl: 'https://github.com/alexander-pierce',
      address: { city: 'Hyderabad', state: 'Telangana', zipCode: '500081', country: 'India' },
      emergencyContact: { name: 'Maya Pierce', relationship: 'Sister', phone: '+91 98765 22222' },
      joiningDate: new Date('2025-01-10'),
      status: 'active',
      salary: 95000,
      performanceScore: 92,
      leaveBalance: { sick: 11, annual: 14, casual: 9 }
    });

    // 18 others
    const names = [
      'David Lopez', 'Sarah Jenkins', 'Marcus Vance', 'Priya Nambiar', 'Elena Rostova',
      'James Smith', 'Sophia Martinez', 'Michael Chang', 'Daniel Kim', 'Emily Watson',
      'Rajesh Patel', 'Carlos Gomez', 'Amanda Ross', 'Li Wei', 'Jessica Taylor',
      'Omar Farooq', 'Nathalie Dupont', 'Ryan Reynolds', 'Aisha Khan', 'Neha Verma',
      'Kabir Malhotra', 'Grace Wilson', 'Hiro Tanaka', 'Fatima Noor', 'Lucas Meyer',
      'Isha Mehta', 'Noah Brown', 'Sara Ali'
    ];

    for (let i = 0; i < names.length; i++) {
      const name = names[i];
      const email = `${name.toLowerCase().replace(' ', '.')}@aeccentric.com`;
      const roleInfo = roles[i % roles.length];
      const isManager = i === 2 || i === 7; // Some managers

      const user = await User.create({
        email,
        password: 'password123',
        role: isManager ? 'manager' : 'employee',
        isActive: true,
        isVerified: true
      });
      usersToCreate.push(user);

      const joiningDate = new Date(Date.now() - (Math.random() * 365 * 3 * 24 * 60 * 60 * 1000)); // last 3 years
      const experience = Math.floor(Math.random() * 8) + 2;
      const experienceLevel = experience > 8 ? 'lead' : experience > 5 ? 'senior' : 'mid';

      const employee = await Employee.create({
        userId: user._id,
        fullName: name,
        phone: `+1 (555) 018-${Math.floor(1000 + Math.random() * 9000)}`,
        designation: isManager ? `${roleInfo.dept} Lead` : roleInfo.name,
        department: roleInfo.dept,
        experienceLevel,
        experience,
        skills: roleInfo.skills,
        techStack: [roleInfo.skills[0], roleInfo.skills[1]],
        bio: `Professional ${roleInfo.name} working on core operations at AECCENTRIC.`,
        linkedinUrl: `https://www.linkedin.com/in/${name.toLowerCase().replaceAll(' ', '-')}`,
        githubUrl: roleInfo.dept === 'Engineering' ? `https://github.com/${name.toLowerCase().replaceAll(' ', '-')}` : '',
        address: {
          city: ['Bengaluru', 'Hyderabad', 'Pune', 'Chennai', 'Mumbai'][i % 5],
          state: ['Karnataka', 'Telangana', 'Maharashtra', 'Tamil Nadu', 'Maharashtra'][i % 5],
          zipCode: `56${String(1000 + i).slice(1)}`,
          country: 'India'
        },
        emergencyContact: {
          name: `${name.split(' ')[0]} Emergency Contact`,
          relationship: i % 2 === 0 ? 'Sibling' : 'Parent',
          phone: `+91 98765 ${String(40000 + i).slice(0, 5)}`
        },
        joiningDate,
        status: i === 4 ? 'on_leave' : 'active', // Elena Rostova on leave
        salary: roleInfo.salary + (experience * 2000),
        performanceScore: Math.floor(Math.random() * 20) + 80,
        leaveBalance: {
          sick: Math.floor(Math.random() * 5) + 6,
          annual: Math.floor(Math.random() * 8) + 10,
          casual: Math.floor(Math.random() * 4) + 6
        }
      });
      employeesToCreate.push(employee);
    }

    const allEmps = [adminEmployee, demoEmployeeProfile, ...employeesToCreate];
    demoEmployeeProfile.reportsTo = adminEmployee._id;
    await demoEmployeeProfile.save();
    for (const emp of employeesToCreate) {
      emp.reportsTo = emp.department === 'HR' ? adminEmployee._id : demoEmployeeProfile._id;
      await emp.save();
    }
    console.log(`Successfully seeded ${allEmps.length} employees.`);

    // Set up department managers
    for (const d of createdDepts) {
      const match = allEmps.find(e => e.department === d.name && e.experienceLevel === 'lead');
      if (match) {
        d.manager = match._id;
        await d.save();
      }
    }

    // Seed active projects
    console.log('Creating active projects...');
    const projectTypes = [
      { name: 'AI Automation Platform', desc: 'Deploy workflow AI orchestrators and neural search tools.', tech: ['React', 'Python', 'FastAPI'], color: '#3b82f6' },
      { name: 'Enterprise EMS Portal', desc: 'Workforce analytics bento dashboards, JWT roles, and attendance logging.', tech: ['Node.js', 'React', 'MongoDB'], color: '#10b981' },
      { name: 'Manufacturing AI System', desc: 'Computer vision tracking assembly line output in industrial centers.', tech: ['TensorFlow', 'Python', 'Docker'], color: '#f59e0b' },
      { name: 'CRM Insights Dashboard', desc: 'Customer retention prediction portal and pipeline analytics tools.', tech: ['Tableau', 'Next.js', 'PostgreSQL'], color: '#8b5cf6' },
      { name: '3D Printing Engine', desc: 'Mesh slicing and print command schedules for corporate manufacturing networks.', tech: ['TypeScript', 'Node.js', 'Rust'], color: '#06b6d4' },
      { name: 'Payroll Modernization', desc: 'Automated payslip generation, statutory deductions, and salary review flows.', tech: ['Node.js', 'MongoDB', 'PDFKit'], color: '#ec4899' },
      { name: 'Hiring Pipeline Upgrade', desc: 'Candidate screening dashboards, interview stages, and offer workflow tracking.', tech: ['React', 'Express', 'Analytics'], color: '#14b8a6' },
      { name: 'Customer Success Workspace', desc: 'Account health signals, escalation queues, and renewal playbooks.', tech: ['React', 'HubSpot', 'Node.js'], color: '#f97316' },
      { name: 'Security Operations Console', desc: 'Audit timeline, anomaly tracking, and admin security response workflows.', tech: ['MongoDB', 'Express', 'SIEM'], color: '#dc2626' },
      { name: 'Executive Reporting Suite', desc: 'Financial, workforce, and delivery reports for leadership reviews.', tech: ['Charts', 'CSV', 'PDF'], color: '#6366f1' }
    ];

    const seededProjects = [];
    for (let i = 0; i < projectTypes.length; i++) {
      const type = projectTypes[i];
      const lead = allEmps[(i + 1) % allEmps.length];
      const members = [allEmps[(i + 2) % allEmps.length]._id, allEmps[(i + 3) % allEmps.length]._id, demoEmployeeProfile._id];

      const proj = await Project.create({
        name: type.name,
        description: type.desc,
        status: i % 5 === 0 ? 'planning' : i % 4 === 0 ? 'review' : 'active',
        client: ['Internal', 'TechNova', 'GreenLeaf', 'SwiftPay', 'EduReach'][i % 5],
        priority: i % 4 === 0 ? 'critical' : i % 3 === 0 ? 'high' : 'medium',
        progress: Math.min(95, 18 + (i * 9)),
        budget: 75000 + (i * 42000),
        lead: lead._id,
        members,
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        color: type.color
      });
      seededProjects.push(proj);
    }
    console.log(`Created ${seededProjects.length} active projects.`);

    // Seed tasks
    console.log('Creating tasks...');
    const taskTitles = [
      { title: 'Draft architecture for auto-seeding engine', desc: 'Design dynamic collection triggers and database connection validations to onboard mock entities.', tags: ['database', 'seeding'] },
      { title: 'Redesign onboarding flow screen layout', desc: 'Update onboarding page using flex grid, clean responsive layout tokens, and UI filters.', tags: ['frontend', 'ux'] },
      { title: 'Configure JWT session refresh middleware', desc: 'Implement silent cookie refresh flows on 401 client request interceptor failures.', tags: ['security', 'auth'] },
      { title: 'Optimize database indexes for search query', desc: 'Audit logs query execution performance times and index designations/emails.', tags: ['database', 'indexing'] },
      { title: 'Refactor chart components', desc: 'Implement Recharts responsive rendering wrappers with elegant dark mode gradients.', tags: ['charts', 'frontend'] },
      { title: 'Integrate Slack webhooks for notifications', desc: 'Configure notifier module to push task status updates to Slack channel #workforce-alerts.', tags: ['integrations', 'api'] },
      { title: 'Implement payroll summary export', desc: 'Add PDF and CSV exports for historical pay stub logs for the finance board.', tags: ['finance', 'pdf'] }
    ];

    for (let i = 0; i < allEmps.length; i++) {
      const emp = allEmps[i];
      const taskSeed = taskTitles[i % taskTitles.length];
      const proj = seededProjects[i % seededProjects.length];

      await Task.create({
        title: taskSeed.title,
        description: taskSeed.desc,
        status: i % 3 === 0 ? 'completed' : i % 3 === 1 ? 'in_progress' : 'todo',
        priority: i % 2 === 0 ? 'high' : 'medium',
        dueDate: new Date(Date.now() + (Math.random() * 10 + 1) * 24 * 60 * 60 * 1000),
        assignedTo: emp._id,
        assignedBy: adminUser._id,
        project: proj._id,
        tags: taskSeed.tags
      });
    }
    console.log('Successfully seeded tasks.');

    // Seed Attendance
    console.log('Creating attendance records...');
    const pastDays = 15;
    for (let day = 0; day < pastDays; day++) {
      const date = new Date();
      date.setDate(date.getDate() - day);
      date.setHours(0, 0, 0, 0);

      // Don't log attendance on Sundays
      if (date.getDay() === 0) continue;

      for (const emp of allEmps) {
        if (emp.status === 'inactive') continue;
        if (emp.status === 'on_leave' && Math.random() > 0.3) continue;

        const checkInHour = Math.random() > 0.8 ? 10 : 9; // Some late clock-ins
        const checkInMin = Math.floor(Math.random() * 30);
        const checkIn = new Date(date);
        checkIn.setHours(checkInHour, checkInMin, 0);

        const checkOut = new Date(date);
        checkOut.setHours(17 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60), 0);

        const diffMs = checkOut - checkIn;
        const workHours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));

        await Attendance.create({
          employee: emp._id,
          date,
          checkIn,
          checkOut,
          status: checkInHour === 10 ? 'late' : 'present',
          workHours
        });
      }
    }
    console.log('Seeded attendance logs.');

    // Seed leaves
    console.log('Seeding leave requests...');
    const leaveRequests = [
      { employee: allEmps[2]._id, type: 'sick', days: 2, startDate: new Date('2026-05-23'), endDate: new Date('2026-05-24'), reason: 'Flu symptoms', status: 'pending' },
      { employee: allEmps[3]._id, type: 'annual', days: 5, startDate: new Date('2026-05-26'), endDate: new Date('2026-05-30'), reason: 'Family vacation', status: 'pending' },
      { employee: allEmps[4]._id, type: 'casual', days: 1, startDate: new Date('2026-05-20'), endDate: new Date('2026-05-20'), reason: 'Personal dental checkup', status: 'approved' },
      { employee: allEmps[5]._id, type: 'sick', days: 1, startDate: new Date('2026-05-18'), endDate: new Date('2026-05-18'), reason: 'Migraine headache', status: 'approved' },
      { employee: allEmps[6]._id, type: 'casual', days: 3, startDate: new Date('2026-06-01'), endDate: new Date('2026-06-03'), reason: 'Attending sibling marriage', status: 'pending' },
      { employee: allEmps[7]._id, type: 'earned', days: 2, startDate: new Date('2026-06-04'), endDate: new Date('2026-06-05'), reason: 'Travel buffer', status: 'approved', reviewedBy: adminEmployee._id, reviewNote: 'Approved for planned travel.' },
      { employee: allEmps[8]._id, type: 'emergency', days: 1, startDate: new Date('2026-05-28'), endDate: new Date('2026-05-28'), reason: 'Family emergency', status: 'approved', reviewedBy: adminEmployee._id, reviewNote: 'Approved.' },
      { employee: allEmps[9]._id, type: 'unpaid', days: 2, startDate: new Date('2026-06-10'), endDate: new Date('2026-06-11'), reason: 'Personal work', status: 'rejected', reviewedBy: adminEmployee._id, reviewNote: 'Coverage unavailable for requested dates.' },
      { employee: allEmps[10]._id, type: 'paternity', days: 5, startDate: new Date('2026-06-15'), endDate: new Date('2026-06-19'), reason: 'New child care', status: 'pending' }
    ];
    await Leave.insertMany(leaveRequests);
    console.log('Seeded leaves.');

    // Seed Payroll
    console.log('Seeding payrolls...');
    for (const emp of allEmps) {
      for (const [month, status] of [['2026-03', 'paid'], ['2026-04', 'paid'], ['2026-05', 'processed'], ['2026-06', 'pending']]) {
        const allowances = Math.floor(emp.salary * 0.16);
        const deductions = Math.floor(emp.salary * 0.08);
        await Payroll.create({
          employee: emp._id,
          month,
          salary: emp.salary,
          allowances,
          deductions,
          netPayable: emp.salary + allowances - deductions,
          status,
          earnings: {
            basic: emp.salary,
            hra: Math.floor(emp.salary * 0.12),
            travel: 2000,
            medical: 1500,
            bonus: status === 'paid' ? 5000 : 0
          },
          deductionBreakdown: {
            pf: Math.floor(emp.salary * 0.05),
            professionalTax: 200,
            tds: Math.floor(emp.salary * 0.03)
          },
          paymentMethod: status === 'pending' ? '' : 'bank transfer',
          paymentDate: status === 'pending' ? null : new Date(`${month}-25`)
        });
      }
    }
    console.log('Seeded payroll history.');

    // Seed Activity Logs
    console.log('Seeding activity logs...');
    const activities = [
      { employee: allEmps[1]._id, action: 'Merged code', details: 'Added responsive design adjustments to the login screen.', department: 'Engineering' },
      { employee: allEmps[2]._id, action: 'Updated task', details: 'Marked database schema migration as completed.', department: 'Engineering' },
      { employee: allEmps[0]._id, action: 'HR Action', details: 'Approved casual leave request for Sarah Jenkins.', department: 'HR' },
      { employee: allEmps[3]._id, action: 'Finance Action', details: 'Processed payroll and approved payslips for May 2026.', department: 'Finance' },
      { employee: allEmps[4]._id, action: 'Marketing Sync', details: 'Updated Q2 advertising campaign schedules.', department: 'Marketing' }
    ];
    await ActivityLog.insertMany(activities);
    console.log('Seeded activity logs.');

    // Seed Candidates
    console.log('Seeding candidates pipeline...');
    const candidates = [
      { name: 'Sarah Jenkins', role: 'UX Designer', status: 'Applied', date: '2h ago' },
      { name: 'David Chen', role: 'React Developer', status: 'Interviewing', date: 'Yesterday' },
      { name: 'Elena Rostova', role: 'QA Lead', status: 'Offered', date: '2 days ago' },
      { name: 'James Smith', role: 'DevOps Specialist', status: 'Hired', date: '3 days ago' },
      { name: 'Rohan Sharma', role: 'AI Researcher', status: 'Applied', date: '4h ago' },
      { name: 'Mira Iyer', role: 'Finance Executive', status: 'Interviewing', date: 'Today' },
      { name: 'Aditya Rao', role: 'Backend Developer', status: 'Rejected', date: '5 days ago' },
      { name: 'Tanya Bose', role: 'Customer Success Manager', status: 'Applied', date: '1h ago' },
      { name: 'Kunal Shah', role: 'Sales Lead', status: 'Offered', date: 'Yesterday' }
    ];
    await Candidate.insertMany(candidates);
    console.log('Seeded candidates.');

    // Seed Calendar / Calendar Events
    console.log('Seeding calendar events...');
    const today = new Date();
    await Calendar.insertMany([
      { title: 'Sprint Planning', description: 'Review dev occupancy and task priorities', start: new Date(new Date(today).setHours(10, 0, 0)), end: new Date(new Date(today).setHours(11, 0, 0)), type: 'meeting' },
      { title: 'HR Policy Alignment', description: 'Operational workflow alignment meeting', start: new Date(new Date(today).setHours(14, 30, 0)), end: new Date(new Date(today).setHours(15, 0, 0)), type: 'meeting' },
      { title: 'Sprint Retrospective', description: 'Discuss lessons learned', start: new Date(new Date(today).setDate(today.getDate() + 1)), end: new Date(new Date(today).setDate(today.getDate() + 1)), allDay: true, type: 'event' },
      { title: 'Payroll Freeze Deadline', description: 'Final payroll input cutoff', start: new Date(new Date(today).setDate(today.getDate() + 2)), end: new Date(new Date(today).setDate(today.getDate() + 2)), allDay: true, type: 'deadline' },
      { title: 'Founders Day Holiday', description: 'Company holiday', start: new Date(new Date(today).setDate(today.getDate() + 5)), end: new Date(new Date(today).setDate(today.getDate() + 5)), allDay: true, type: 'holiday' },
      { title: 'Security Drill', description: 'Incident response tabletop exercise', start: new Date(new Date(today).setHours(12, 0, 0)), end: new Date(new Date(today).setHours(13, 0, 0)), type: 'event' }
    ]);

    // Seed Meetings
    console.log('Seeding corporate meetings...');
    await Meeting.create([
      { title: 'Sprint Planning', description: 'Review dev occupancy and task priorities', startTime: new Date(new Date(today).setHours(10, 0, 0)), endTime: new Date(new Date(today).setHours(11, 0, 0)), duration: '1 hr', type: 'Online', organizer: allEmps[0]._id, participants: [allEmps[1]._id, allEmps[2]._id] },
      { title: 'HR Policy Alignment', description: 'Operational workflow alignment meeting', startTime: new Date(new Date(today).setHours(14, 30, 0)), endTime: new Date(new Date(today).setHours(15, 0, 0)), duration: '30 mins', type: 'Room 402', organizer: allEmps[0]._id, participants: [allEmps[3]._id] },
      { title: 'Engineering Tech Sync', description: 'Discuss architecture refactoring & indexing', startTime: new Date(new Date(today).setHours(16, 0, 0)), endTime: new Date(new Date(today).setHours(17, 0, 0)), duration: '45 mins', type: 'Online', organizer: allEmps[1]._id, participants: [allEmps[2]._id, allEmps[4]._id] },
      { title: 'Finance Review', description: 'Review payroll, client retainers, and pending invoices', startTime: new Date(new Date(today).setDate(today.getDate() + 1)), endTime: new Date(new Date(today).setDate(today.getDate() + 1)), duration: '45 mins', type: 'Room 202', organizer: allEmps[0]._id, participants: [allEmps[10]._id, allEmps[12]._id] },
      { title: 'Candidate Panel', description: 'Interview loop for customer success and frontend candidates', startTime: new Date(new Date(today).setDate(today.getDate() + 2)), endTime: new Date(new Date(today).setDate(today.getDate() + 2)), duration: '1 hr', type: 'Room 303', organizer: allEmps[3]._id, participants: [allEmps[4]._id, allEmps[9]._id] },
      { title: 'Client Delivery Sync', description: 'Project owners review active delivery risks', startTime: new Date(new Date(today).setHours(11, 30, 0)), endTime: new Date(new Date(today).setHours(12, 15, 0)), duration: '45 mins', type: 'Online', organizer: allEmps[2]._id, participants: [allEmps[5]._id, allEmps[6]._id, allEmps[7]._id] }
    ]);

    // Other settings and details
    console.log('Seeding AICopilot...');
    await AICopilot.insertMany([
      { prompt: 'Analyze last month\'s engineering performance vs design team.', response: 'Engineering closed 142 tasks with 94% efficiency. Design finalized 3 main UI kits, meeting 100% of milestones. Engineering has a higher resource occupancy rate (88%) than design (74%). Recommendation: Reallocate 1 mid-level engineering resource to design for secondary integrations support.', category: 'Workforce', rating: 5 },
      { prompt: 'What are the main security risks identified this week?', response: 'Three events of medium severity: 1. Multiple login failures on account support@aeccentric.com (IP: 198.51.100.42). 2. SSH configuration updated on US-East production instance. 3. Unauthorized access attempt to dev-database-1. Recommendations: Enable MFA for support@aeccentric.com, auditing SSH keys immediately, restrict access group IPs.', category: 'Security', rating: 4 },
      { prompt: 'Which projects are at delivery risk?', response: 'Security Operations Console and Payroll Modernization need closer tracking because both have critical priority and cross-functional dependencies. Suggested action: assign one PM checkpoint per week.', category: 'Projects', rating: 5 },
      { prompt: 'Summarize leave impact next week.', response: 'Engineering has two pending leave requests and one approved emergency leave. Coverage is healthy if backend tasks are moved to the next sprint buffer.', category: 'HR', rating: 4 }
    ]);

    console.log('Seeding Reports...');
    await Report.insertMany([
      { title: 'Workforce Headcount Q1', type: 'Workforce', creator: 'HR Lead Alice', status: 'Generated', size: '1.2 MB' },
      { title: 'Operational Budget Projection', type: 'Financial', creator: 'Finance Director Priya', status: 'Generated', size: '840 KB' },
      { title: 'Quarterly Security Audit', type: 'System Audit', creator: 'SecOps Bot', status: 'Generated', size: '4.6 MB' },
      { title: 'Monthly Payroll Summary', type: 'Financial', creator: 'Finance Desk', status: 'Pending', size: '0 KB' },
      { title: 'Department Utilization Snapshot', type: 'Workforce', creator: 'People Analytics', status: 'Generated', size: '2.1 MB' },
      { title: 'Endpoint Access Exceptions', type: 'System Audit', creator: 'SecOps Bot', status: 'Failed', size: '0 KB' }
    ]);

    console.log('Seeding Finance...');
    await Finance.insertMany([
      { category: 'Payroll', description: 'May 2026 Monthly Salaries', amount: 154000, type: 'expense', status: 'Completed', date: new Date('2026-05-18') },
      { category: 'Software', description: 'AWS Cloud Hosting Subscriptions', amount: 4800, type: 'expense', status: 'Completed', date: new Date('2026-05-15') },
      { category: 'Consulting', description: 'AI Architecture Consultation Fee', amount: 12500, type: 'expense', status: 'Completed', date: new Date('2026-05-10') },
      { category: 'Services', description: 'Client Project Retainer Deposit', amount: 89000, type: 'income', status: 'Completed', date: new Date('2026-05-20') },
      { category: 'Office', description: 'Bengaluru workspace maintenance', amount: 7200, type: 'expense', status: 'Pending', date: new Date('2026-05-22') },
      { category: 'Training', description: 'Security certification reimbursements', amount: 9600, type: 'expense', status: 'Completed', date: new Date('2026-05-12') },
      { category: 'Services', description: 'Analytics dashboard milestone payment', amount: 47000, type: 'income', status: 'Completed', date: new Date('2026-05-25') },
      { category: 'Software', description: 'Design suite annual renewal', amount: 3400, type: 'expense', status: 'Failed', date: new Date('2026-05-27') }
    ]);

    console.log('Seeding Security...');
    await Security.insertMany([
      { event: 'User Authenticated', severity: 'low', ipAddress: '192.168.1.105', userEmail: 'admin@gmail.com', status: 'Resolved' },
      { event: 'Database Backup Completed', severity: 'low', ipAddress: 'internal-system', userEmail: 'backup-agent@aeccentric.com', status: 'Resolved' },
      { event: 'Multiple Login Failures', severity: 'medium', ipAddress: '185.220.101.42', userEmail: 'support@aeccentric.com', status: 'Flagged' },
      { event: 'Suspicious Token Refresh', severity: 'high', ipAddress: '203.0.113.19', userEmail: 'employee@gmail.com', status: 'Blocked' },
      { event: 'Payroll Export Downloaded', severity: 'medium', ipAddress: '10.0.0.42', userEmail: 'admin@gmail.com', status: 'Resolved' },
      { event: 'MFA Challenge Passed', severity: 'low', ipAddress: '192.168.1.205', userEmail: 'hr@aeccentric.com', status: 'Resolved' }
    ]);

    console.log('Seeding Settings...');
    await Setting.insertMany([
      { key: 'mfa_enabled', value: 'true', group: 'security' },
      { key: 'default_role', value: 'employee', group: 'general' },
      { key: 'theme', value: 'dark', group: 'appearance' },
      { key: 'attendance_grace_minutes', value: 15, group: 'attendance' },
      { key: 'payroll_cutoff_day', value: 25, group: 'payroll' },
      { key: 'leave_auto_approve_days', value: 0, group: 'leave' }
    ]);

    console.log('Seeding Integrations...');
    await Integration.insertMany([
      { name: 'Slack Notifications', description: 'Push real-time system alerts, onboard notifications to your team Slack channel.', status: 'connected', category: 'Communication', icon: 'MessageSquare' },
      { name: 'GitHub Repository Sync', description: 'Monitor active project repositories, pull requests, and commit logs directly.', status: 'connected', category: 'Developer Tools', icon: 'FolderKanban' },
      { name: 'Google Calendar Integration', description: 'Synchronize schedule meetings, deadlines, and timeline events.', status: 'connected', category: 'Productivity', icon: 'Calendar' },
      { name: 'HubSpot CRM', description: 'Sync sales activity and renewal health with the customer success dashboard.', status: 'disconnected', category: 'Sales', icon: 'BriefcaseBusiness' },
      { name: 'Razorpay Payroll Payouts', description: 'Prepare bank transfer batches and payroll payment references.', status: 'connected', category: 'Finance', icon: 'WalletCards' },
      { name: 'Sentry Error Monitoring', description: 'Track production exceptions and release health for engineering teams.', status: 'connected', category: 'Developer Tools', icon: 'Bug' }
    ]);

    console.log('Seeding Performance Ratings...');
    for (const emp of allEmps) {
      await Performance.create({
        employee: emp._id,
        period: 'Q1 2026',
        score: emp.performanceScore,
        delta: Math.floor(Math.random() * 6) - 2, // -2 to +3
        feedback: 'Demonstrated exceptional compliance with sprint goals and project deliverables.',
        evaluator: adminEmployee._id
      });
    }

    console.log('Seeding Messages...');
    await Message.insertMany([
      { sender: 'David Lopez', recipient: 'Alexander Pierce', subject: 'Architecture Refactor Done', content: 'Hey, I have successfully merged the core design system and layouts refactor. The dashboard grid is fully stable now.', read: false, avatar: 'DL' },
      { sender: 'Elena Rostova', recipient: 'Sravan Kumar', subject: 'QA Validation Results', content: 'Testing for Employee onboarding form is complete. No critical blocker bugs. Ready for production release.', read: false, avatar: 'ER' },
      { sender: 'Priya Nambiar', recipient: 'All Managers', subject: 'Leave Queue Review', content: 'Please review pending leaves before payroll lock so attendance reports stay clean.', read: true, avatar: 'PN' },
      { sender: 'Marcus Vance', recipient: 'Engineering', subject: 'Security Console Dependencies', content: 'The audit timeline API needs final payload confirmation before the client demo.', read: false, avatar: 'MV' },
      { sender: 'Sarah Jenkins', recipient: 'Design', subject: 'Candidate Panel Assets', content: 'Interview scorecards and portfolio review templates are ready in the design workspace.', read: false, avatar: 'SJ' },
      { sender: 'Finance Desk', recipient: 'All Admins', subject: 'Payroll Draft Ready', content: 'June payroll is pending final attendance approvals and exception review.', read: false, avatar: 'FD' }
    ]);

    console.log('Seeding Notifications...');
    const notificationTypes = ['task', 'leave', 'payroll', 'meeting', 'general'];
    const notificationTitles = ['New Task Assigned', 'Leave Status Updated', 'Payslip Ready', 'Meeting Scheduled', 'Company Announcement'];
    const notificationDocs = [];
    for (const user of usersToCreate) {
      for (let i = 0; i < notificationTypes.length; i++) {
        notificationDocs.push({
          recipient: user._id,
          title: notificationTitles[i],
          message: `${notificationTitles[i]} for ${user.email}.`,
          type: notificationTypes[i],
          read: i % 2 === 0
        });
      }
    }
    await Notification.insertMany(notificationDocs);

    console.log('✅ Database fully seeded with rich enterprise assets!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seedData();
