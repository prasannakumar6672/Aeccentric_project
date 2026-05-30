import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Models
import AICopilot from '../models/AICopilot.js';
import Report from '../models/Report.js';
import Finance from '../models/Finance.js';
import Security from '../models/Security.js';
import Message from '../models/Message.js';
import Calendar from '../models/Calendar.js';
import Integration from '../models/Integration.js';
import Setting from '../models/Setting.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is required to seed dashboard data.');
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding dashboard...');

    // Clear old data
    await AICopilot.deleteMany({});
    await Report.deleteMany({});
    await Finance.deleteMany({});
    await Security.deleteMany({});
    await Message.deleteMany({});
    await Calendar.deleteMany({});
    await Integration.deleteMany({});
    await Setting.deleteMany({});

    // Seed AICopilot
    await AICopilot.insertMany([
      {
        prompt: 'Analyze last month\'s engineering performance vs design team.',
        response: 'Engineering closed 142 tasks with 94% efficiency. Design finalized 3 main UI kits, meeting 100% of milestones. Engineering has a higher resource occupancy rate (88%) than design (74%). Recommendation: Reallocate 1 mid-level engineering resource to design for secondary integrations support.',
        category: 'Workforce',
        rating: 5,
      },
      {
        prompt: 'What are the main security risks identified this week?',
        response: 'Three events of medium severity: 1. Multiple login failures on account support@aeccentric.com (IP: 198.51.100.42). 2. SSH configuration updated on US-East production instance. 3. Unauthorized access attempt to dev-database-1. Recommendations: Enable MFA for support@aeccentric.com, auditing SSH keys immediately, restrict access group IPs.',
        category: 'Security',
        rating: 4,
      },
      {
        prompt: 'Draft an email announcing the Q3 strategy review meeting.',
        response: 'Subject: Invitation: Q3 Strategic Workforce & Operations Review\n\nDear Team,\n\nPlease join us for our Q3 Strategic Review meeting scheduled for next Thursday at 10:00 AM. We will review our project milestones, tech stack performance, and resource expansion plan for the next half of the year.\n\nBest regards,\nAdmin Team',
        category: 'Communication',
        rating: 5,
      }
    ]);

    // Seed Reports
    await Report.insertMany([
      { title: 'Workforce Headcount Q1', type: 'Workforce', creator: 'HR Lead Alice', status: 'Generated', size: '1.2 MB' },
      { title: 'Operational Budget Projection', type: 'Financial', creator: 'Finance Director Priya', status: 'Generated', size: '840 KB' },
      { title: 'Quarterly Security Audit', type: 'System Audit', creator: 'SecOps Bot', status: 'Generated', size: '4.6 MB' },
      { title: 'Integration Sync Logs', type: 'System Audit', creator: 'System Scheduler', status: 'Pending', size: '0 KB' },
    ]);

    // Seed Finance
    await Finance.insertMany([
      { category: 'Payroll', description: 'May 2026 Monthly Salaries', amount: 154000, type: 'expense', status: 'Completed', date: new Date('2026-05-18') },
      { category: 'Software', description: 'AWS Cloud Hosting Subscriptions', amount: 4800, type: 'expense', status: 'Completed', date: new Date('2026-05-15') },
      { category: 'Consulting', description: 'AI Architecture Consultation Fee', amount: 12500, type: 'expense', status: 'Completed', date: new Date('2026-05-10') },
      { category: 'Services', description: 'Client Project Milestones - Retainer Deposit', amount: 89000, type: 'income', status: 'Completed', date: new Date('2026-05-20') },
      { category: 'Office', description: 'Office workspace rental', amount: 9200, type: 'expense', status: 'Completed', date: new Date('2026-05-01') },
      { category: 'Equipment', description: 'Dev Macbook Upgrades', amount: 14000, type: 'expense', status: 'Pending', date: new Date('2026-05-22') },
    ]);

    // Seed Security
    await Security.insertMany([
      { event: 'User Authenticated', severity: 'low', ipAddress: '192.168.1.105', userEmail: 'admin@test.com', status: 'Resolved' },
      { event: 'Database Backup Completed', severity: 'low', ipAddress: 'internal-system', userEmail: 'backup-agent@aeccentric.com', status: 'Resolved' },
      { event: 'Multiple Login Failures', severity: 'medium', ipAddress: '185.220.101.42', userEmail: 'support@aeccentric.com', status: 'Flagged' },
      { event: 'System Config File Modified', severity: 'high', ipAddress: '10.0.4.12', userEmail: 'infra-admin@aeccentric.com', status: 'Flagged' },
      { event: 'API Request Rate Limit Exceeded', severity: 'medium', ipAddress: '203.0.113.88', userEmail: 'unknown@visitor.com', status: 'Blocked' },
    ]);

    // Seed Messages
    await Message.insertMany([
      { sender: 'David Patel', subject: 'Architecture Refactor Done', content: 'Hey, I have successfully merged the core design system and layouts refactor. The dashboard grid is fully stable now.', read: false, avatar: 'D' },
      { sender: 'Elena Rostova', subject: 'QA Validation Results', content: 'Testing for Employee onboarding form is complete. No critical blocker bugs. Ready for production release.', read: false, avatar: 'E' },
      { sender: 'Priya Nambiar', subject: 'Expense approvals pending', content: 'I uploaded the Q2 software subscriptions sheet. Please review and sign off so we can finalize payout.', read: true, avatar: 'P' },
      { sender: 'Slack Integration Bot', subject: 'New alert channel connected', content: 'Your Slack notifications for system alerts have been connected to channel #workforce-alerts.', read: true, avatar: 'S' },
    ]);

    // Seed Calendar
    const today = new Date();
    await Calendar.insertMany([
      {
        title: 'Sprint Planning',
        description: 'Establish priorities for Sprint 25 and review developer occupancy',
        start: new Date(new Date(today).setHours(10, 0, 0)),
        end: new Date(new Date(today).setHours(11, 0, 0)),
        type: 'meeting',
      },
      {
        title: 'HR Policy Alignment',
        description: 'New standard operational workflow and benefits overview',
        start: new Date(new Date(today).setHours(14, 30, 0)),
        end: new Date(new Date(today).setHours(15, 0, 0)),
        type: 'meeting',
      },
      {
        title: 'Q2 Deliverable Milestone',
        description: 'IT product development dashboard v1 release deadline',
        start: new Date(new Date(today).setHours(17, 0, 0)),
        end: new Date(new Date(today).setHours(18, 0, 0)),
        type: 'deadline',
      },
      {
        title: 'Workforce OS Retrospective',
        description: 'Discuss styling refinement, grid layout systems, and responsive adjustments.',
        start: new Date(new Date(today).setDate(today.getDate() + 1)),
        end: new Date(new Date(today).setDate(today.getDate() + 1)),
        allDay: true,
        type: 'event',
      }
    ]);

    // Seed Integrations
    await Integration.insertMany([
      { name: 'Slack Notifications', description: 'Push real-time system alerts, onboard notifications to your team Slack channel.', status: 'connected', category: 'Communication', icon: 'MessageSquare' },
      { name: 'GitHub Repository Sync', description: 'Monitor active project repositories, pull requests, and commit logs directly.', status: 'connected', category: 'Developer Tools', icon: 'FolderKanban' },
      { name: 'Stripe Billings', description: 'Reconcile invoice generation, payouts, and monthly financial reports automatically.', status: 'disconnected', category: 'Finance', icon: 'CreditCard' },
      { name: 'Google Calendar Integration', description: 'Synchronize schedule meetings, deadlines, and timeline events.', status: 'connected', category: 'Productivity', icon: 'Calendar' },
      { name: 'AWS Cloud Hosting', description: 'Monitor resource CPU load, deploy logs, and auto-scalers in real-time.', status: 'connected', category: 'Infrastructure', icon: 'Zap' },
    ]);

    // Seed Settings
    await Setting.insertMany([
      { key: 'mfa_enabled', value: 'true', group: 'security' },
      { key: 'default_role', value: 'employee', group: 'general' },
      { key: 'theme', value: 'dark', group: 'appearance' },
      { key: 'auto_backup', value: 'true', group: 'system' },
      { key: 'alert_threshold', value: '85', group: 'system' },
      { key: 'currency', value: 'USD', group: 'finance' },
    ]);

    console.log('🚀 Seeding complete! Database populated with enterprise dashboard data.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seed();
