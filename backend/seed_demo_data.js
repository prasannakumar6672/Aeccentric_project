import mongoose from 'mongoose';
import User from './src/models/User.js';
import Employee from './src/models/Employee.js';
import Project from './src/models/Project.js';
import Task from './src/models/Task.js';
import Calendar from './src/models/Calendar.js';
import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error('MONGODB_URI is required to seed demo data.');
}

const seed = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(mongoUri);
    console.log('Connected.');

    console.log('Clearing old tasks and projects...');
    await Task.deleteMany({});
    await Project.deleteMany({});

    console.log('Setting up admin user...');
    let adminUser = await User.findOne({ email: 'admin@gmail.com' });
    if (!adminUser) {
      adminUser = await User.create({
        email: 'admin@gmail.com',
        password: 'admin123',
        role: 'admin',
        isVerified: true
      });
      console.log('Admin user created.');
    } else {
      console.log('Admin user exists.');
    }

    let adminProfile = await Employee.findOne({ userId: adminUser._id });
    if (!adminProfile) {
      adminProfile = await Employee.create({
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
        joiningDate: new Date('2023-05-15'),
        status: 'active'
      });
      console.log('Admin profile created.');
    } else {
      adminProfile.fullName = 'Sravan Kumar';
      await adminProfile.save();
      console.log('Admin profile updated.');
    }

    console.log('Setting up employee user...');
    let employeeUser = await User.findOne({ email: 'employee@gmail.com' });
    if (!employeeUser) {
      employeeUser = await User.create({
        email: 'employee@gmail.com',
        password: 'employee123',
        role: 'employee',
        isVerified: true
      });
      console.log('Employee user created.');
    } else {
      console.log('Employee user exists.');
    }

    let employeeProfile = await Employee.findOne({ userId: employeeUser._id });
    if (!employeeProfile) {
      employeeProfile = await Employee.create({
        userId: employeeUser._id,
        fullName: 'Alexander Pierce',
        phone: '+1 (555) 019-2834',
        designation: 'Senior Frontend Architect',
        department: 'Engineering',
        experienceLevel: 'senior',
        experience: 6,
        skills: ['React', 'TypeScript', 'TailwindCSS', 'Redux Toolkit'],
        techStack: ['MERN Stack', 'Next.js', 'Vite'],
        bio: 'Frontend architect passionate about responsive layout rendering, dynamic animations, and state management.',
        joiningDate: new Date('2025-01-10'),
        status: 'active'
      });
      console.log('Employee profile created.');
    } else {
      employeeProfile.status = 'active';
      await employeeProfile.save();
      console.log('Employee profile updated.');
    }

    console.log('Setting up team members...');
    let teamUser = await User.findOne({ email: 'david.lopez@aeccentric.com' });
    if (!teamUser) {
      teamUser = await User.create({
        email: 'david.lopez@aeccentric.com',
        password: 'password123',
        role: 'employee',
        isVerified: true
      });
    }
    let teamProfile = await Employee.findOne({ userId: teamUser._id });
    if (!teamProfile) {
      teamProfile = await Employee.create({
        userId: teamUser._id,
        fullName: 'David Lopez',
        phone: '+1 (555) 018-9944',
        designation: 'Backend Developer',
        department: 'Engineering',
        experienceLevel: 'mid',
        experience: 4,
        skills: ['Node.js', 'Express', 'MongoDB', 'Redis', 'Docker'],
        techStack: ['Node.js', 'Mongoose', 'AWS EC2'],
        bio: 'Systems engineer specializing in REST APIs, DB index tuning, and containerized deployment pipelines.',
        joiningDate: new Date('2025-06-15'),
        status: 'active'
      });
      console.log('Additional team member profile created.');
    } else {
      teamProfile.status = 'active';
      await teamProfile.save();
    }

    console.log('Creating demo projects...');
    const project1 = await Project.create({
      name: 'Workflow Automation Engine',
      description: 'Streamline standard business processes by automating notifications, tasks assignment, and approvals tracking.',
      status: 'active',
      lead: employeeProfile._id,
      members: [employeeProfile._id, teamProfile._id],
      startDate: new Date('2026-05-01'),
      endDate: new Date('2026-07-30'),
      color: '#3b82f6'
    });

    const project2 = await Project.create({
      name: 'Interactive AI Analytics Hub',
      description: 'Deploy advanced charts, predictive insights, and automated reports for tracking organizational efficiency.',
      status: 'planning',
      lead: teamProfile._id,
      members: [employeeProfile._id, teamProfile._id],
      startDate: new Date('2026-06-01'),
      endDate: new Date('2026-09-15'),
      color: '#4f46e5'
    });

    console.log('Creating demo tasks...');
    await Task.create([
      {
        title: 'Draft architecture for auto-seeding engine',
        description: 'Design dynamic collection triggers and database connection validations to onboard fake mock entities for live testing.',
        status: 'completed',
        priority: 'high',
        dueDate: new Date(),
        assignedTo: employeeProfile._id,
        assignedBy: adminUser._id,
        project: project1._id,
        tags: ['backend', 'database']
      },
      {
        title: 'Redesign onboarding flow screen layout',
        description: 'Update the onboarding page using tailwind grids, responsive CSS layouts, and micro-interactions.',
        status: 'in_progress',
        priority: 'high',
        dueDate: new Date(Date.now() + 86400000 * 2),
        assignedTo: employeeProfile._id,
        assignedBy: adminUser._id,
        project: project1._id,
        tags: ['frontend', 'ux']
      },
      {
        title: 'Configure JWT session refresh middleware',
        description: 'Implement silent cookie refresh flows on 401 client request interceptor failures.',
        status: 'todo',
        priority: 'medium',
        dueDate: new Date(Date.now() + 86400000 * 5),
        assignedTo: employeeProfile._id,
        assignedBy: adminUser._id,
        project: project2._id,
        tags: ['security', 'auth']
      },
      {
        title: 'Implement dynamic project progress auto-calculations',
        description: 'Verify task completion percent updates dynamically when task status is set to complete.',
        status: 'todo',
        priority: 'low',
        dueDate: new Date(Date.now() + 86400000 * 10),
        assignedTo: employeeProfile._id,
        assignedBy: adminUser._id,
        project: project1._id,
        tags: ['backend', 'analytics']
      },
      {
        title: 'Configure DB index optimizations for search query',
        description: 'Audit logs query execution performance times and index employee designations/emails.',
        status: 'todo',
        priority: 'medium',
        dueDate: new Date(Date.now() + 86400000 * 3),
        assignedTo: teamProfile._id,
        assignedBy: adminUser._id,
        project: project1._id,
        tags: ['database']
      }
    ]);

    console.log('✅ Demo data seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

seed();
