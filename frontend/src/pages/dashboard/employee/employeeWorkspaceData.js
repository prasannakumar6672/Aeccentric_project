export const completedStatuses = ['done', 'completed'];

const today = new Date();
const addDays = (days) => {
  const date = new Date(today);
  date.setDate(today.getDate() + days);
  return date.toISOString();
};

export const workspacePeople = [
  { _id: 'demo-p1', fullName: 'Rahul Sharma', designation: 'Engineering Lead', status: 'Online' },
  { _id: 'demo-p2', fullName: 'Ananya Iyer', designation: 'Product Manager', status: 'In Meeting' },
  { _id: 'demo-p3', fullName: 'Karan Mehta', designation: 'Backend Engineer', status: 'Online' },
  { _id: 'demo-p4', fullName: 'Nisha Rao', designation: 'QA Analyst', status: 'Away' },
  { _id: 'demo-p5', fullName: 'Meera Nair', designation: 'UX Designer', status: 'Online' },
  { _id: 'demo-p6', fullName: 'Aditi Menon', designation: 'HR Partner', status: 'Offline' },
];

export const demoProjects = [
  {
    _id: 'demo-project-swiftpay',
    name: 'SwiftPay App',
    client: 'FinEdge Labs',
    description: 'Employee-led payment workflow modernization with mobile approval and audit-ready transaction history.',
    status: 'active',
    priority: 'High',
    sprint: 'Sprint 4',
    progress: 68,
    color: '#2563eb',
    startDate: addDays(-28),
    endDate: addDays(12),
    openTasks: 7,
    completedTasks: 14,
    totalTasks: 21,
    aiInsight: 'Two API review tasks are the pacing items before Friday demo.',
    lead: workspacePeople[0],
    members: workspacePeople.slice(0, 5),
  },
  {
    _id: 'demo-project-hrms',
    name: 'EMS Self-Service Portal',
    client: 'AECCENTRIC Internal',
    description: 'HRMS employee workspace covering attendance, leaves, payroll visibility, and project collaboration.',
    status: 'active',
    priority: 'Critical',
    sprint: 'Release Candidate',
    progress: 82,
    color: '#10b981',
    startDate: addDays(-44),
    endDate: addDays(6),
    openTasks: 4,
    completedTasks: 18,
    totalTasks: 22,
    aiInsight: 'Regression checklist is almost complete; focus on mobile edge cases.',
    lead: workspacePeople[1],
    members: [workspacePeople[1], workspacePeople[2], workspacePeople[3], workspacePeople[5]],
  },
  {
    _id: 'demo-project-manufacturing',
    name: 'VisionOps AI Console',
    client: 'NorthGrid Manufacturing',
    description: 'Operations dashboard for shift analytics, predictive alerts, and production-line exception handling.',
    status: 'review',
    priority: 'Medium',
    sprint: 'QA Stabilization',
    progress: 54,
    color: '#8b5cf6',
    startDate: addDays(-18),
    endDate: addDays(22),
    openTasks: 9,
    completedTasks: 10,
    totalTasks: 19,
    aiInsight: 'Chart data looks healthy; model alert copy needs stakeholder approval.',
    lead: workspacePeople[2],
    members: [workspacePeople[0], workspacePeople[2], workspacePeople[3], workspacePeople[4]],
  },
];

export const demoTasks = [
  {
    _id: 'demo-task-1',
    title: 'Finalize attendance status API fallback',
    description: 'Handle empty attendance ledgers and expose a stable today status payload for dashboard widgets.',
    status: 'in_progress',
    priority: 'high',
    dueDate: addDays(0),
    project: { _id: demoProjects[1]._id, name: demoProjects[1].name, color: demoProjects[1].color },
    updatedAt: addDays(0),
  },
  {
    _id: 'demo-task-2',
    title: 'Review SwiftPay invoice export edge cases',
    description: 'Validate INR formatting, refund rows, and settlement-day grouping before client QA.',
    status: 'todo',
    priority: 'critical',
    dueDate: addDays(1),
    project: { _id: demoProjects[0]._id, name: demoProjects[0].name, color: demoProjects[0].color },
    updatedAt: addDays(-1),
  },
  {
    _id: 'demo-task-3',
    title: 'Ship mobile project card alignment fixes',
    description: 'Make project cards stack cleanly at 375px and preserve team avatar spacing.',
    status: 'review',
    priority: 'medium',
    dueDate: addDays(2),
    project: { _id: demoProjects[1]._id, name: demoProjects[1].name, color: demoProjects[1].color },
    updatedAt: addDays(-2),
  },
  {
    _id: 'demo-task-4',
    title: 'Complete VisionOps chart tooltip copy',
    description: 'Add readable labels and stakeholder-friendly language to production anomaly tooltips.',
    status: 'done',
    priority: 'low',
    dueDate: addDays(-1),
    project: { _id: demoProjects[2]._id, name: demoProjects[2].name, color: demoProjects[2].color },
    updatedAt: addDays(-1),
  },
  {
    _id: 'demo-task-5',
    title: 'Prepare sprint review notes for Rahul',
    description: 'Summarize completed tasks, blockers, and tomorrow focus areas.',
    status: 'todo',
    priority: 'medium',
    dueDate: addDays(0),
    project: { _id: demoProjects[0]._id, name: demoProjects[0].name, color: demoProjects[0].color },
    updatedAt: addDays(0),
  },
  {
    _id: 'demo-task-6',
    title: 'Attach leave policy references to employee help center',
    description: 'Link annual, sick, and casual leave guidance inside the self-service portal.',
    status: 'completed',
    priority: 'medium',
    dueDate: addDays(-3),
    project: { _id: demoProjects[1]._id, name: demoProjects[1].name, color: demoProjects[1].color },
    updatedAt: addDays(-3),
  },
];

export const demoWeeklyActivity = [
  { day: 'Mon', tasks: 3, hours: 7.5 },
  { day: 'Tue', tasks: 4, hours: 8.1 },
  { day: 'Wed', tasks: 5, hours: 8.4 },
  { day: 'Thu', tasks: 2, hours: 6.7 },
  { day: 'Fri', tasks: 4, hours: 7.8 },
  { day: 'Sat', tasks: 1, hours: 3.2 },
  { day: 'Sun', tasks: 0, hours: 0 },
];

export const demoMeetings = [
  {
    _id: 'demo-meet-1',
    title: 'Weekly Dev Standup',
    description: 'Sprint progress, blockers, and release owner sync.',
    startTime: new Date(new Date().setHours(9, 30, 0, 0)).toISOString(),
    endTime: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    duration: '30 min',
    type: 'Online',
    meetLink: 'https://meet.google.com/aec-standup',
    participants: workspacePeople.slice(0, 4),
    summary: 'Focus on API fallback stability and mobile QA blockers.',
  },
  {
    _id: 'demo-meet-2',
    title: 'SwiftPay Client Demo Dry Run',
    description: 'Walk through payment export scenarios and approval handoff.',
    startTime: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(),
    endTime: new Date(new Date().setHours(15, 0, 0, 0)).toISOString(),
    duration: '1h',
    type: 'Online',
    meetLink: 'https://meet.google.com/swiftpay-demo',
    participants: [workspacePeople[0], workspacePeople[1], workspacePeople[4]],
    summary: 'Confirm INR exports and prepare two customer flow screenshots.',
  },
  {
    _id: 'demo-meet-3',
    title: 'HR Policy Q&A',
    description: 'Leave, reimbursement, and attendance clarification session.',
    startTime: new Date(new Date().setHours(17, 0, 0, 0)).toISOString(),
    endTime: new Date(new Date().setHours(17, 30, 0, 0)).toISOString(),
    duration: '30 min',
    type: 'Room 202',
    participants: [workspacePeople[5]],
    summary: 'Bring pending leave and expense questions to HR.',
  },
];

export const demoAttendanceLogs = [
  { _id: 'demo-att-1', date: addDays(0), checkIn: new Date(new Date().setHours(9, 4, 0, 0)).toISOString(), checkOut: null, workHours: 0, status: 'present' },
  { _id: 'demo-att-2', date: addDays(-1), checkIn: new Date(new Date(addDays(-1)).setHours(9, 8, 0, 0)).toISOString(), checkOut: new Date(new Date(addDays(-1)).setHours(18, 12, 0, 0)).toISOString(), workHours: 8.6, status: 'present' },
  { _id: 'demo-att-3', date: addDays(-2), checkIn: new Date(new Date(addDays(-2)).setHours(9, 20, 0, 0)).toISOString(), checkOut: new Date(new Date(addDays(-2)).setHours(18, 0, 0, 0)).toISOString(), workHours: 8.1, status: 'late' },
  { _id: 'demo-att-4', date: addDays(-3), checkIn: new Date(new Date(addDays(-3)).setHours(8, 58, 0, 0)).toISOString(), checkOut: new Date(new Date(addDays(-3)).setHours(17, 54, 0, 0)).toISOString(), workHours: 8.4, status: 'present' },
];

export const demoLeaves = [
  { _id: 'demo-leave-1', type: 'annual', startDate: addDays(18), endDate: addDays(20), days: 3, status: 'pending', reason: 'Family travel' },
  { _id: 'demo-leave-2', type: 'sick', startDate: addDays(-15), endDate: addDays(-15), days: 1, status: 'approved', reason: 'Medical appointment' },
  { _id: 'demo-leave-3', type: 'casual', startDate: addDays(-32), endDate: addDays(-31), days: 2, status: 'approved', reason: 'Personal work' },
];

export const demoConversations = [
  { id: 'c1', name: 'Rahul Sharma', role: 'Engineering Lead', status: 'Online', unread: 2, time: '09:42 AM', message: 'Can you push the attendance fallback before standup?', channel: 'SwiftPay App' },
  { id: 'c2', name: 'Ananya Iyer', role: 'Product Manager', status: 'In Meeting', unread: 0, time: 'Yesterday', message: 'I added the demo checklist to the project brief.', channel: 'EMS Portal' },
  { id: 'c3', name: 'Nisha Rao', role: 'QA Analyst', status: 'Away', unread: 1, time: 'Mon', message: 'Mobile cards are ready for one more pass.', channel: 'QA Desk' },
  { id: 'c4', name: 'Aditi Menon', role: 'HR Partner', status: 'Offline', unread: 0, time: 'Fri', message: 'Your reimbursement has moved to finance review.', channel: 'HR Ops' },
];

export const demoTimesheets = [
  { day: 'Mon', project: 'EMS Self-Service Portal', task: 'Dashboard integration', hours: 7.5, status: 'Approved' },
  { day: 'Tue', project: 'SwiftPay App', task: 'Invoice export QA', hours: 8.1, status: 'Approved' },
  { day: 'Wed', project: 'EMS Self-Service Portal', task: 'Mobile responsive pass', hours: 8.4, status: 'Pending' },
  { day: 'Thu', project: 'VisionOps AI Console', task: 'Chart tooltip polish', hours: 6.7, status: 'Pending' },
  { day: 'Fri', project: 'SwiftPay App', task: 'Client demo support', hours: 7.8, status: 'Draft' },
];

export const demoExpenses = [
  { id: 'exp-1', category: 'Software', title: 'Figma monthly workspace', amount: 2450, date: addDays(-3), status: 'Approved', stage: 100 },
  { id: 'exp-2', category: 'Travel', title: 'Client visit cab reimbursement', amount: 1380, date: addDays(-7), status: 'Finance Review', stage: 66 },
  { id: 'exp-3', category: 'Equipment', title: 'Ergonomic keyboard', amount: 4200, date: addDays(-14), status: 'Manager Review', stage: 33 },
];

export const demoNotifications = [
  { id: 'n1', type: 'task', title: 'Task due today', message: 'Prepare sprint review notes for Rahul before 5 PM.', time: '10 min ago', unread: true },
  { id: 'n2', type: 'meeting', title: 'Meeting starts in 30 min', message: 'SwiftPay Client Demo Dry Run begins at 2:00 PM.', time: '24 min ago', unread: true },
  { id: 'n3', type: 'leave', title: 'Leave request pending', message: 'Your July annual leave request is awaiting manager approval.', time: 'Yesterday', unread: false },
  { id: 'n4', type: 'payroll', title: 'Payslip generated', message: 'May 2026 payslip is available in salary center.', time: '2 days ago', unread: false },
];

export const demoAnnouncements = [
  { id: 'a1', title: 'May payroll and payslips are live', owner: 'Finance', date: 'Today', tone: 'blue', message: 'Payslips for May 2026 are available. Reimbursement payouts close Friday.' },
  { id: 'a2', title: 'New hybrid attendance policy', owner: 'HR', date: 'Yesterday', tone: 'emerald', message: 'Employees should clock in from the office network on office-designated days.' },
  { id: 'a3', title: 'Security awareness training', owner: 'IT Ops', date: 'Mon', tone: 'amber', message: 'Complete the 12-minute security refresher before this sprint ends.' },
];

export const demoSalary = {
  gross: 124000,
  net: 96850,
  deductions: 18150,
  nextPayday: '31 May 2026',
  payslips: [
    { month: 'May 2026', gross: 124000, net: 96850, status: 'Generated' },
    { month: 'Apr 2026', gross: 124000, net: 96920, status: 'Paid' },
    { month: 'Mar 2026', gross: 120000, net: 94100, status: 'Paid' },
  ],
};

export const demoPerformance = {
  score: 88,
  sprintCompletion: 82,
  deliveryQuality: 94,
  managerFeedback: 'Strong ownership on dashboard stabilization. Keep documenting API edge cases and handoff notes.',
  scorecards: [
    { label: 'Delivery', value: 92 },
    { label: 'Collaboration', value: 87 },
    { label: 'Quality', value: 94 },
    { label: 'Reliability', value: 89 },
  ],
};

export const demoDashboardData = {
  success: true,
  profile: { fullName: 'Prasanna Kumar', designation: 'Frontend Engineer', department: 'Engineering' },
  tasks: demoTasks,
  todayTasks: demoTasks.filter(task => task.dueDate && new Date(task.dueDate).toDateString() === today.toDateString()),
  openTasks: demoTasks.filter(task => !completedStatuses.includes(task.status)),
  projects: demoProjects,
  leaves: demoLeaves,
  leaveBalance: { sick: 9, casual: 7, earned: 12, used: 6, remaining: 28, total: 34 },
  attendance: { clockedIn: true, loginTime: new Date(new Date().setHours(9, 4, 0, 0)).toISOString(), sessionDuration: 214, status: 'present', streak: 7, attendanceRate: 94 },
  meetings: demoMeetings,
  team: workspacePeople,
  weeklyActivity: demoWeeklyActivity,
  performance: { taskCompletionRate: 67, weeklyTrend: [3, 4, 5, 2, 4, 1, 0], workedThisWeek: 41.7, tasksCompletedThisWeek: 19, attendanceRate: 94 },
  achievements: {
    streak: 7,
    badges: [
      { name: 'Sprint Champion', unlocked: true, color: '#f59e0b' },
      { name: '5-Star Delivery', unlocked: true, color: '#2563eb' },
      { name: 'Week Warrior', unlocked: true, color: '#f97316' },
      { name: 'Team Player', unlocked: true, color: '#8b5cf6' },
      { name: 'Fast Tracker', unlocked: false, color: '#06b6d4' },
    ],
  },
  insights: [
    { icon: 'Target', tone: 'success', title: '82% sprint progress', text: 'You are tracking well. Two SwiftPay tasks need focus before Friday.' },
    { icon: 'Zap', tone: 'info', title: '7-day attendance streak', text: '5 more workdays keeps you on pace for Monthly Champion.' },
    { icon: 'Clock', tone: 'warning', title: 'Client demo in 12 days', text: 'Prioritize invoice export QA and review tasks this week.' },
  ],
};

export const mergeDashboardData = (data = {}) => ({
  ...data,
  profile: data.profile || {},
  tasks: data.tasks || [],
  todayTasks: data.todayTasks || [],
  openTasks: data.openTasks || [],
  projects: data.projects || [],
  leaves: data.leaves || [],
  leaveBalance: data.leaveBalance || { sick: 0, casual: 0, earned: 0, used: 0, remaining: 0, total: 0 },
  attendance: data.attendance || { clockedIn: false, sessionDuration: 0, status: 'absent', streak: 0, attendanceRate: 0 },
  meetings: data.meetings || [],
  team: data.team || [],
  weeklyActivity: data.weeklyActivity || [],
  performance: data.performance || { taskCompletionRate: 0, workedThisWeek: 0, tasksCompletedThisWeek: 0, attendanceRate: 0 },
  achievements: data.achievements || { streak: 0, badges: [] },
  insights: data.insights || [],
});
