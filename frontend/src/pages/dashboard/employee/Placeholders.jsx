import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  FileText,
  MessageSquare,
  Paperclip,
  Receipt,
  Send,
  Sparkles,
  TrendingUp,
  Upload,
  Users,
  WalletCards,
  ChevronDown,
  Trash2,
  HelpCircle,
  X,
  Briefcase,
  Award,
  Check,
  Plus,
  BookOpen,
  Search,
  ChevronRight,
  Filter,
  Cpu,
  MapPin,
  Sparkle,
  FileSpreadsheet,
  Eye
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  demoAnnouncements,
  demoConversations,
  demoExpenses,
  demoMeetings,
  demoNotifications,
  demoPerformance,
  demoSalary,
  demoTimesheets,
  demoWeeklyActivity,
  workspacePeople,
} from './employeeWorkspaceData';
import api from '../../../services/api';

const routeMeta = {
  messages: {
    title: 'Messages',
    eyebrow: 'Team Communication',
    description: 'Project threads, direct chats, unread messages, and quick replies.',
    icon: MessageSquare,
  },
  timesheets: {
    title: 'Timesheets',
    eyebrow: 'Work Logs',
    description: 'Weekly hours, project allocation, draft entries, and approval status.',
    icon: Clock,
  },
  performance: {
    title: 'My Performance',
    eyebrow: 'Growth Scorecard',
    description: 'Sprint completion, productivity trends, quality signals, and manager feedback.',
    icon: TrendingUp,
  },
  salary: {
    title: 'My Salary',
    eyebrow: 'Payroll Center',
    description: 'Payslips, monthly earnings, deductions, payout status, and download history.',
    icon: WalletCards,
  },
  expenses: {
    title: 'Expenses',
    eyebrow: 'Reimbursements',
    description: 'Expense requests, receipts, approval stages, and reimbursement status.',
    icon: Receipt,
  },
  announcements: {
    title: 'Announcements',
    eyebrow: 'Company Updates',
    description: 'HR broadcasts, finance notices, policy updates, and IT reminders.',
    icon: Bell,
  },
  meetings: {
    title: 'Meetings',
    eyebrow: 'Today and Upcoming',
    description: 'Calendar schedule, join links, attendees, and AI meeting summaries.',
    icon: Calendar,
  },
  notifications: {
    title: 'Notifications',
    eyebrow: 'Action Center',
    description: 'Task reminders, approvals, HR updates, meeting alerts, and project changes.',
    icon: Bell,
  },
};

const currency = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;

const card = 'rounded-[16px] border border-slate-200 bg-white shadow-sm dark:border-white/[0.07] dark:bg-[#111827]';
const soft = 'text-slate-500 dark:text-slate-400';

const EmptyState = ({ icon: Icon = Sparkles, title, description, action }) => (
  <div className={`${card} flex min-h-[220px] flex-col items-center justify-center p-8 text-center`}>
    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
      <Icon size={22} />
    </div>
    <h3 className="mt-4 text-sm font-black text-slate-950 dark:text-white">{title}</h3>
    <p className={`mt-1 max-w-sm text-sm leading-relaxed ${soft}`}>{description}</p>
    {action && <button className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-black text-white">{action}</button>}
  </div>
);

const PageHeader = ({ meta }) => {
  const Icon = meta.icon;
  return (
    <div className="flex flex-col justify-between gap-4 rounded-2xl border border-blue-600/10 bg-[linear-gradient(135deg,#f8fbff,#f5f3ff)] p-5 dark:border-white/[0.07] dark:bg-[linear-gradient(135deg,#0d1526,#111827)] md:flex-row md:items-center">
      <div className="flex items-start gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
          <Icon size={22} />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.12em] text-blue-600 dark:text-blue-300">{meta.eyebrow}</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 dark:text-white">{meta.title}</h1>
          <p className={`mt-1 text-sm ${soft}`}>{meta.description}</p>
        </div>
      </div>
      <div className="rounded-full border border-blue-600/10 bg-white/80 px-4 py-2 text-xs font-black text-blue-700 dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-blue-300">
        Live workspace data
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, icon: Icon, color = '#2563eb', sub }) => (
  <motion.div whileHover={{ y: -4 }} className={`${card} flex min-h-[124px] flex-col justify-between p-5`}>
    <div className="flex items-center justify-between">
      <div className="grid h-10 w-10 place-items-center rounded-xl" style={{ color, backgroundColor: `${color}14` }}>
        <Icon size={18} />
      </div>
      {sub && <span className={`text-[11px] font-bold ${soft}`}>{sub}</span>}
    </div>
    <div>
      <div className="text-2xl font-black text-slate-950 dark:text-white">{value}</div>
      <div className={`text-xs font-bold ${soft}`}>{label}</div>
    </div>
  </motion.div>
);

const StatusPill = ({ children, tone = 'blue' }) => {
  const tones = {
    blue: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300',
    green: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
    amber: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
    red: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300',
    slate: 'bg-slate-100 text-slate-600 dark:bg-white/[0.06] dark:text-slate-300',
  };
  return <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${tones[tone] || tones.blue}`}>{children}</span>;
};

/* ─── Shared UI Card ─── */
const PremiumCard = ({ children, className = '' }) => (
  <div className={`rounded-[20px] bg-white dark:bg-[#0d1526] border border-gray-150 dark:border-white/[0.07] shadow-[0_2px_8px_rgba(15,23,42,0.015),0_8px_24px_rgba(15,23,42,0.015)] p-6 ${className}`}>
    {children}
  </div>
);

const MiniTable = ({ columns, rows, empty }) => (
  <div className={`${card} overflow-hidden`}>
    {rows.length === 0 ? (
      empty
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-50 text-[10px] uppercase tracking-[0.08em] text-slate-400 dark:bg-white/[0.03]">
            <tr>{columns.map(column => <th key={column} className="px-5 py-3">{column}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id || index} className="border-t border-slate-100 dark:border-white/[0.05]">
                {row.cells.map((cell, i) => <td key={i} className="px-5 py-4 text-slate-700 dark:text-slate-200">{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

function MessagesPage() {
  const [selected, setSelected] = useState(demoConversations[0]);
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[380px_1fr]">
      <div className={`${card} p-3`}>
        <div className="px-2 pb-3 pt-1">
          <h2 className="text-sm font-black text-slate-950 dark:text-white">Recent conversations</h2>
          <p className={`text-xs ${soft}`}>Unread, channels, and teammate presence</p>
        </div>
        <div className="space-y-2">
          {demoConversations.map(convo => (
            <button
              key={convo.id}
              onClick={() => setSelected(convo)}
              className={`flex w-full items-start gap-3 rounded-xl p-3 text-left ${selected.id === convo.id ? 'bg-blue-50 dark:bg-blue-500/10' : 'hover:bg-slate-50 dark:hover:bg-white/[0.03]'}`}
            >
              <div className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-600 text-xs font-black text-white">
                {convo.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-[#111827] ${convo.status === 'Online' ? 'bg-emerald-500' : convo.status === 'In Meeting' ? 'bg-amber-500' : 'bg-slate-400'}`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-black text-slate-950 dark:text-white">{convo.name}</p>
                  <span className={`text-[10px] ${soft}`}>{convo.time}</span>
                </div>
                <p className={`truncate text-xs ${soft}`}>{convo.message}</p>
                <div className="mt-2 flex items-center justify-between">
                  <StatusPill tone="slate">{convo.channel}</StatusPill>
                  {convo.unread > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-blue-600 px-1 text-[10px] font-black text-white">{convo.unread}</span>}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className={`${card} flex min-h-[520px] flex-col`}>
        <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-white/[0.05]">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-blue-600 text-xs font-black text-white">
              {selected.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-950 dark:text-white">{selected.name}</h2>
              <p className={`text-xs ${soft}`}>{selected.role} - {selected.status}</p>
            </div>
          </div>
          <StatusPill tone="green">Project thread</StatusPill>
        </div>
        <div className="flex-1 space-y-4 p-5">
          {[
            ['them', selected.message],
            ['me', 'Got it. I am closing the UI/data stabilization pass and will share a build note shortly.'],
            ['them', 'Great. Please include the mobile check and the API fallback details.'],
          ].map(([who, text], index) => (
            <div key={index} className={`flex ${who === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[72%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${who === 'me' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 dark:bg-white/[0.06] dark:text-slate-200'}`}>
                {text}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-100 p-4 dark:border-white/[0.05]">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 dark:border-white/[0.07] dark:bg-white/[0.03]">
            <button className="grid h-9 w-9 place-items-center rounded-xl text-slate-500 hover:bg-white dark:hover:bg-white/[0.06]"><Paperclip size={16} /></button>
            <input className="min-w-0 flex-1 border-0 bg-transparent px-2 text-sm outline-none" placeholder="Write a quick reply..." />
            <button className="inline-flex h-9 items-center gap-2 rounded-xl bg-blue-600 px-4 text-xs font-black text-white"><Send size={14} /> Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Timesheet Policy Modal ─── */
function TimesheetPolicyModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-[#0d1526] rounded-2xl border border-gray-150 dark:border-white/[0.08] shadow-2xl p-6"
      >
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-white/[0.04]">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="text-blue-500" size={18} />
            Timesheet Policy Guidelines
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-white/[0.04] cursor-pointer">
            <X size={18} />
          </button>
        </div>
        
        <div className="flex flex-col gap-4 mt-4 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-white/[0.015] rounded-xl border border-slate-150/40 dark:border-white/[0.02]">
            <h4 className="font-bold text-slate-900 dark:text-white">Daily Standard Hours</h4>
            <p className="text-slate-500 dark:text-slate-450 mt-1 leading-relaxed">
              Every employee is expected to log a standard 8 hours of work per business day (Mon - Fri), allocating hours across active client or internal projects.
            </p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-white/[0.015] rounded-xl border border-slate-150/40 dark:border-white/[0.02]">
            <h4 className="font-bold text-slate-900 dark:text-white">Weekly Deadline</h4>
            <p className="text-slate-500 dark:text-slate-450 mt-1 leading-relaxed">
              All weekly logs must be submitted for approval by Friday, 6:00 PM. Late submissions may impact payroll cycles.
            </p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-white/[0.015] rounded-xl border border-slate-150/40 dark:border-white/[0.02]">
            <h4 className="font-bold text-slate-900 dark:text-white">Approval Protocol</h4>
            <p className="text-slate-500 dark:text-slate-450 mt-1 leading-relaxed">
              Logs are reviewed weekly by your respective Project Lead. Pending entries will not be compiled into client billing statements.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Log Hours Modal ─── */
function LogHoursModal({ onClose, onAddLog }) {
  const [form, setForm] = useState({ project: 'EMS Self-Service Portal', day: 'Mon', task: '', hours: 8 });
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!form.task.trim()) { setError('Please write a brief task description.'); return; }
    if (form.hours <= 0 || form.hours > 24) { setError('Hours must be between 1 and 24.'); return; }
    
    onAddLog({
      id: `custom-log-${Date.now()}`,
      day: form.day,
      project: form.project,
      task: form.task,
      hours: Number(form.hours),
      status: 'Pending'
    });
  };

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const inp = 'w-full text-[13px] px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.03] text-gray-900 dark:text-slate-200 focus:outline-none focus:border-blue-500 transition-colors';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-[#0d1526] rounded-2xl border border-gray-150 dark:border-white/[0.08] shadow-2xl p-6"
      >
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-white/[0.04]">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="text-blue-500" size={18} />
            Log Work Hours
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-white/[0.04] cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mt-3 px-3.5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-500/[0.1] border border-rose-100 dark:border-rose-500/20 text-rose-600 dark:text-rose-455 text-[12px] flex items-center gap-2 font-semibold">
            <AlertCircle size={14} className="shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={submit} className="flex flex-col gap-4 mt-4">
          <div>
            <label className="block text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Select Project</label>
            <select value={form.project} onChange={e => set('project', e.target.value)} className={inp}>
              <option value="EMS Self-Service Portal">EMS Self-Service Portal</option>
              <option value="SwiftPay App">SwiftPay App</option>
              <option value="VisionOps AI Console">VisionOps AI Console</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Day of Week</label>
              <select value={form.day} onChange={e => set('day', e.target.value)} className={inp}>
                <option value="Mon">Monday</option>
                <option value="Tue">Tuesday</option>
                <option value="Wed">Wednesday</option>
                <option value="Thu">Thursday</option>
                <option value="Fri">Friday</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Hours Worked</label>
              <input type="number" step="0.5" min="0.5" max="24" value={form.hours} onChange={e => set('hours', e.target.value)} className={inp} required />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Task / Deliverables</label>
            <textarea value={form.task} onChange={e => set('task', e.target.value)} rows={3}
              placeholder="Describe what you worked on..."
              className={inp + ' resize-none'} required />
          </div>

          <div className="flex gap-2.5 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-white/[0.08] text-[13px] font-bold text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors cursor-pointer">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold transition-all cursor-pointer shadow-sm shadow-blue-500/10 active:scale-[0.98]">
              Add Log
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

/* ─── Circular Progress Center ─── */
const TimesheetCircularProgress = ({ logged, target }) => {
  const percent = target > 0 ? Math.min(100, (logged / target) * 100) : 0;
  const radius = 64;
  const circ = 2 * Math.PI * radius;
  const strokeDashoffset = circ - (percent / 100) * circ;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg className="w-44 h-44 transform -rotate-90">
        <circle cx="88" cy="88" r={radius} className="stroke-slate-100 dark:stroke-white/[0.04]" strokeWidth="10" fill="transparent" />
        <circle cx="88" cy="88" r={radius} className="stroke-blue-600 transition-all duration-500 ease-out" strokeWidth="12" strokeDasharray={circ} strokeDashoffset={strokeDashoffset} strokeLinecap="round" fill="transparent" style={{ filter: 'drop-shadow(0px 2px 8px rgba(37, 99, 235, 0.2))' }} />
      </svg>
      <div className="absolute text-center mt-[-2px]">
        <div className="text-4xl font-black text-slate-900 dark:text-white leading-none tracking-tight">{logged.toFixed(1)}h</div>
        <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-2 leading-none">Logged / {target}h</div>
      </div>
    </div>
  );
};

/* ─── Stat Card Helper ─── */
const TimesheetStatCard = ({ label, value, Icon, color }) => (
  <div 
    className="rounded-xl bg-white dark:bg-[#0d1526] border border-gray-150 dark:border-white/[0.08] shadow-[0_1px_3px_rgba(15,23,42,0.015),0_4px_12px_rgba(15,23,42,0.015)] flex flex-col justify-between p-5 min-h-[135px] w-full hover:shadow-md hover:border-slate-300 dark:hover:border-white/[0.12] transition-all duration-300 relative overflow-hidden"
  >
    <div className="flex items-center justify-between w-full">
      <span className="text-[10.5px] md:text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-350 leading-none pr-2">
        {label}
      </span>
      <div className="grid h-8 w-8 place-items-center rounded-xl shrink-0" style={{ color, backgroundColor: color + '14' }}>
        <Icon size={16} />
      </div>
    </div>
    <div className="text-3xl font-black mt-4 text-slate-900 dark:text-white tracking-tight w-full">
      {value}
    </div>
  </div>
);

function TimesheetsPage() {
  const [logs, setLogs] = useState([]);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const res = await api.get('/attendance/my');
        if (res.data && res.data.logs) {
          const weekdayMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          const attendanceLogs = res.data.logs.map(log => {
            const dateObj = new Date(log.date);
            const checkInStr = log.checkIn ? new Date(log.checkIn).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : '';
            const checkOutStr = log.checkOut ? new Date(log.checkOut).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : '';
            let description = 'Workday Attendance';
            if (checkInStr) {
              description = `Clocked in at ${checkInStr}${checkOutStr ? ` and out at ${checkOutStr}` : ' (active session)'}`;
            }
            return {
              id: log._id,
              day: weekdayMap[dateObj.getDay()],
              project: 'EMS Office Attendance',
              task: description,
              hours: log.workHours || 0,
              status: log.status === 'present' || log.status === 'late' || log.status === 'half_day' ? 'Approved' : 'Pending'
            };
          });

          // Combine with standard weekly placeholders/demos so it has high fidelity data
          const mergedLogs = [
            ...attendanceLogs,
            ...demoTimesheets.filter(d => !attendanceLogs.some(a => a.day === d.day)).map((d, idx) => ({ ...d, id: `demo-log-${idx}` }))
          ];
          setLogs(mergedLogs);
        } else {
          setLogs(demoTimesheets.map((log, idx) => ({ ...log, id: `demo-log-${idx}` })));
        }
      } catch (err) {
        console.error('Error loading timesheets attendance:', err);
        setLogs(demoTimesheets.map((log, idx) => ({ ...log, id: `demo-log-${idx}` })));
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  const total = logs.reduce((sum, row) => sum + Number(row.hours || 0), 0);
  const pendingCount = logs.filter(t => t.status === 'Pending').length;
  const approvedCount = logs.filter(t => t.status === 'Approved').length;
  const activeProjectsCount = new Set(logs.map(t => t.project)).size;

  const allocation = Object.values(logs.reduce((acc, row) => {
    acc[row.project] = acc[row.project] || { name: row.project, hours: 0 };
    acc[row.project].hours += Number(row.hours || 0);
    return acc;
  }, {}));

  const handleAddLog = (newLogItem) => {
    setLogs(prev => [...prev, newLogItem]);
    setShowLogModal(false);
    setAlertMessage("Work hours logged successfully!");
    setTimeout(() => setAlertMessage(null), 3500);
  };

  const handleDeleteLog = (id) => {
    setLogs(prev => prev.filter(log => log.id !== id));
    setAlertMessage("Work log deleted.");
    setTimeout(() => setAlertMessage(null), 3000);
  };

  const handleSubmitTimesheet = () => {
    setLogs(prev => prev.map(log => log.status === 'Draft' || log.status === 'Pending' ? { ...log, status: 'Approved' } : log));
    setAlertMessage("Timesheet submitted for approval!");
    setTimeout(() => setAlertMessage(null), 3500);
  };

  const downloadReport = () => {
    setAlertMessage("Generating CSV statement... Download started!");
    setTimeout(() => setAlertMessage(null), 4000);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Day,Project,Task Description,Hours,Status\n"
      + logs.map(l => `${l.day},${l.project},"${l.task}",${l.hours},${l.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `timesheet_weekly_${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const scrollHistory = () => {
    const el = document.getElementById('timesheet-history-timeline');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const LOG_STATUS_THEMES = {
    Approved: 'inline-flex items-center justify-center h-6 px-3 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 dark:bg-emerald-500/[0.08] text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20',
    Pending: 'inline-flex items-center justify-center h-6 px-3 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 dark:bg-amber-500/[0.08] text-amber-700 dark:text-amber-455 border border-amber-200/60 dark:border-amber-500/20',
    Draft: 'inline-flex items-center justify-center h-6 px-3 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-white/[0.05] text-slate-655 dark:text-slate-350 border border-slate-200/60 dark:border-white/[0.08]'
  };

  if (loading) {
    return (
      <div className="flex h-[350px] w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {showLogModal && (
          <LogHoursModal onClose={() => setShowLogModal(false)} onAddLog={handleAddLog} />
        )}
        {showPolicyModal && (
          <TimesheetPolicyModal onClose={() => setShowPolicyModal(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {alertMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-6 left-1/2 z-50 px-5 py-3 rounded-full bg-slate-900/90 dark:bg-white/95 backdrop-blur-md text-white dark:text-slate-900 border border-slate-800 dark:border-white text-xs font-bold shadow-xl flex items-center gap-2.5"
          >
            <Check size={14} className="text-emerald-500" />
            {alertMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto py-2">
        
        {/* SECTION 1 — HERO TIMESHEET SUMMARY */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Weekly Metrics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            <TimesheetStatCard label="Logged This Week" value={`${total.toFixed(1)}h`} Icon={Clock} color="#3b82f6" />
            <TimesheetStatCard label="Pending Approval" value={pendingCount} Icon={AlertCircle} color="#f59e0b" />
            <TimesheetStatCard label="Approved Hours" value={`${approvedCount} Entries`} Icon={CheckCircle2} color="#10b981" />
            <TimesheetStatCard label="Active Projects" value={activeProjectsCount} Icon={FileText} color="#8b5cf6" />
          </div>
        </div>

        {/* SECTION 2 — QUICK ACTIONS */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Quick Timesheet Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 w-full">
            
            <button onClick={() => setShowLogModal(true)}
              className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-white/[0.015] border border-slate-150 dark:border-white/[0.04] rounded-2xl hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-500/[0.03] text-center gap-2 group transition-all cursor-pointer h-[90px]">
              <Plus size={16} className="text-blue-500 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-350">Log Work Hours</span>
            </button>

            <button onClick={handleSubmitTimesheet}
              className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-white/[0.015] border border-slate-150 dark:border-white/[0.04] rounded-2xl hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-500/[0.03] text-center gap-2 group transition-all cursor-pointer h-[90px]">
              <CheckCircle2 size={16} className="text-indigo-500 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-350">Submit Logs</span>
            </button>

            <button onClick={downloadReport}
              className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-white/[0.015] border border-slate-150 dark:border-white/[0.04] rounded-2xl hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-500/[0.03] text-center gap-2 group transition-all cursor-pointer h-[90px]">
              <Download size={16} className="text-emerald-500 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-350">Download CSV</span>
            </button>

            <button onClick={() => setShowPolicyModal(true)}
              className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-white/[0.015] border border-slate-150 dark:border-white/[0.04] rounded-2xl hover:border-amber-500 dark:hover:border-amber-500 hover:bg-amber-500/[0.03] text-center gap-2 group transition-all cursor-pointer h-[90px]">
              <BookOpen size={16} className="text-amber-500 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-350">View Policy</span>
            </button>

            <button onClick={scrollHistory}
              className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-white/[0.015] border border-slate-150 dark:border-white/[0.04] rounded-2xl hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-500/[0.03] text-center gap-2 group transition-all cursor-pointer h-[90px] col-span-2 sm:col-span-1">
              <Clock size={16} className="text-purple-500 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-350">Scroll History</span>
            </button>

          </div>
        </div>

        {/* Dynamic Multi-column Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
          
          {/* Central-Left: Timesheet Logs Timeline */}
          <div className="lg:col-span-8 flex flex-col gap-4 w-full min-w-0" id="timesheet-history-timeline">
            <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Weekly Work logs</h3>
            
            <div className="relative border-l border-slate-150 dark:border-white/[0.05] pl-6 ml-3.5 space-y-6 pt-1">
              <AnimatePresence>
                {logs.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
                    <div className="absolute -left-[31.5px] top-4 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#0f172a] bg-blue-500 shadow-sm" />
                    <PremiumCard className="p-8 text-center flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                        <Clock size={22} className="text-blue-500" />
                      </div>
                      <p className="font-bold text-slate-700 dark:text-slate-350 text-sm">No work logs submitted</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs leading-relaxed">Submit your first daily log to track hours completed.</p>
                    </PremiumCard>
                  </motion.div>
                ) : (
                  logs.map((log) => (
                    <motion.div key={log.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0, marginBottom: 0 }} className="relative" layout>
                      
                      {/* Timeline Bullet */}
                      <div className="absolute -left-[31.5px] top-4 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#0f172a] shadow-sm z-10 bg-blue-600" />

                      <PremiumCard className="hover:border-slate-300 dark:hover:border-white/[0.12] hover:shadow-[0_4px_16px_rgba(15,23,42,0.02)] transition-all duration-300">
                        <div className="flex flex-col gap-4">
                          
                          {/* Log Row 1: Day, Project, Hours, Status */}
                          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-white/[0.04] pb-3.5">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-black uppercase tracking-wider bg-blue-50 dark:bg-blue-500/[0.08] text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded">
                                {log.day}
                              </span>
                              <span className="text-sm font-black text-slate-900 dark:text-white leading-none">
                                {log.project}
                              </span>
                            </div>

                            <div className="flex items-center gap-3.5">
                              <span className="px-2 py-0.5 rounded bg-slate-50 dark:bg-white/[0.015] text-slate-700 dark:text-slate-350 text-[10.5px] font-black uppercase border border-slate-150/40 dark:border-white/[0.02]">
                                {log.hours}h Logged
                              </span>
                              <span className={LOG_STATUS_THEMES[log.status] || LOG_STATUS_THEMES.Pending}>
                                {log.status}
                              </span>

                              {log.status !== 'Approved' && (
                                <button
                                  onClick={() => handleDeleteLog(log.id)}
                                  className="flex items-center justify-center p-1 rounded-lg text-rose-600 dark:text-rose-455 bg-rose-50 dark:bg-rose-500/[0.08] hover:bg-rose-100 dark:hover:bg-rose-500/[0.15] transition-colors cursor-pointer border border-rose-250/20 dark:border-rose-500/20">
                                  <Trash2 size={12} />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Log Row 2: Task Description */}
                          <div className="bg-slate-50/50 dark:bg-white/[0.01] border border-slate-200/40 dark:border-white/[0.04] p-4 rounded-xl text-slate-700 dark:text-slate-350 leading-relaxed text-xs">
                            <span className="block text-[9px] uppercase font-black text-slate-450 dark:text-slate-500 tracking-widest mb-1.5 leading-none">Logged Tasks & Deliverables</span>
                            <p className="whitespace-pre-wrap leading-relaxed mt-1 font-semibold">"{log.task}"</p>
                          </div>

                        </div>
                      </PremiumCard>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Central-Right: SVG Progress Donut & Project Allocation Bar breakdown */}
          <div className="lg:col-span-4 flex flex-col gap-8 w-full min-w-0">
            
            {/* Visual Hours Goal Donut */}
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Weekly Progress</h3>
              <PremiumCard className="flex flex-col items-center">
                <TimesheetCircularProgress logged={total} target={40} />
                
                <div className="w-full mt-6 space-y-3 pt-4 border-t border-slate-100 dark:border-white/[0.04]">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-400">Target Standard Hours</span>
                    <span className="text-slate-900 dark:text-white font-extrabold">40.0 Hrs</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-400">Total Completed Hours</span>
                    <span className="text-slate-900 dark:text-white font-extrabold">{total.toFixed(1)} Hrs</span>
                  </div>
                  
                  {/* Progress filler bars for project split */}
                  <div className="h-2.5 w-full bg-slate-100 dark:bg-white/[0.04] rounded-full overflow-hidden mt-1.5 flex gap-0.5">
                    {allocation.map((proj, idx) => {
                      const color = ['#2563eb', '#10b981', '#8b5cf6'][idx % 3];
                      const widthPercent = total > 0 ? (Number(proj.hours) / total) * 100 : 0;
                      return (
                        <div key={idx} className="h-full" style={{ width: `${widthPercent}%`, backgroundColor: color }} />
                      );
                    })}
                  </div>
                  
                  {/* Detailed project legend list */}
                  <div className="flex flex-col gap-2 pt-2">
                    {allocation.map((proj, idx) => {
                      const color = ['#2563eb', '#10b981', '#8b5cf6'][idx % 3];
                      return (
                        <div key={idx} className="flex justify-between items-center text-[10.5px] font-bold">
                          <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 truncate pr-2">
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                            <span className="truncate">{proj.name}</span>
                          </span>
                          <span className="text-slate-900 dark:text-white shrink-0 font-extrabold">
                            {Number(proj.hours).toFixed(1)}h ({total > 0 ? ((Number(proj.hours) / total) * 100).toFixed(0) : 0}%)
                          </span>
                        </div>
                      );
                    })}
                  </div>

                </div>
              </PremiumCard>
            </div>

            {/* Daily logs preview bars */}
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Daily Hours Preview</h3>
              <PremiumCard className="flex flex-col gap-4">
                <div className="flex items-end justify-between gap-2 h-20 px-1 pt-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d) => {
                    const dayHours = logs.filter(log => log.day === d).reduce((s, log) => s + Number(log.hours || 0), 0);
                    const barPercent = Math.min(100, (dayHours / 12) * 100); // base standard max of 12 hours visual scale
                    return (
                      <div key={d} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="relative w-full h-14 bg-slate-100 dark:bg-white/[0.03] rounded-sm overflow-hidden flex items-end">
                          <div className="bg-blue-600/80 dark:bg-blue-600/60 w-full group-hover:bg-blue-500 transition-colors" 
                            style={{ height: `${barPercent}%` }} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 leading-none">{d}</span>
                        <span className="text-[9px] font-black text-slate-500 leading-none mt-0.5">{dayHours.toFixed(1)}h</span>
                      </div>
                    );
                  })}
                </div>
              </PremiumCard>
            </div>

          </div>

        </div>

      </div>
    </>
  );
}

function PerformancePage() {
  const [perfData, setPerfData] = useState(null);
  const [weeklyData, setWeeklyData] = useState(demoWeeklyActivity);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        setLoading(true);
        const [perfRes, weeklyRes] = await Promise.allSettled([
          api.get('/analytics/my-performance'),
          api.get('/analytics/my-weekly'),
        ]);

        if (perfRes.status === 'fulfilled' && perfRes.value.data?.success) {
          setPerfData(perfRes.value.data);
        }
        if (weeklyRes.status === 'fulfilled' && weeklyRes.value.data?.success) {
          setWeeklyData(weeklyRes.value.data.data || demoWeeklyActivity);
        }
      } catch (err) {
        console.error('Performance fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPerformance();
  }, []);

  const score = perfData?.taskCompletionRate ?? demoPerformance.score;
  const sprintCompletion = perfData?.taskCompletionRate ?? demoPerformance.sprintCompletion;
  const attendanceRate = perfData?.attendanceRate ?? demoPerformance.deliveryQuality;
  const workedThisWeek = perfData?.workedThisWeek ?? 0;

  if (loading) {
    return (
      <div className="flex h-[350px] w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <MetricCard label="Productivity Score" value={`${score}%`} icon={TrendingUp} color="#2563eb" />
        <MetricCard label="Sprint Completion" value={`${sprintCompletion}%`} icon={CheckCircle2} color="#10b981" />
        <MetricCard label="Attendance Rate" value={`${attendanceRate}%`} icon={Sparkles} color="#8b5cf6" />
        <MetricCard label="Hours This Week" value={`${workedThisWeek.toFixed(1)}h`} icon={Users} color="#f59e0b" />
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_420px]">
        <div className={`${card} p-5`}>
          <h2 className="text-sm font-black text-slate-950 dark:text-white">Productivity trend</h2>
          <p className={`mb-4 text-xs ${soft}`}>Completed tasks and focused hours this week</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.18)" />
                <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0f172a', border: 0, borderRadius: 12, color: '#fff' }} />
                <Area type="monotone" dataKey="hours" stroke="#10b981" fill="#10b98122" strokeWidth={2.5} />
                <Area type="monotone" dataKey="tasks" stroke="#2563eb" fill="#2563eb22" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className={`${card} p-5`}>
          <h2 className="text-sm font-black text-slate-950 dark:text-white">Monthly scorecard</h2>
          <p className={`mb-5 text-xs ${soft}`}>Manager-visible competency signals</p>
          <div className="space-y-4">
            {demoPerformance.scorecards.map(item => (
              <div key={item.label}>
                <div className="mb-2 flex justify-between text-xs font-black text-slate-700 dark:text-slate-200">
                  <span>{item.label}</span><span>{item.value}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/[0.06]">
                  <div className="h-full rounded-full bg-blue-600 transition-all duration-700" style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-[16px] border border-blue-600/10 bg-blue-50 p-4 text-sm font-semibold leading-relaxed text-blue-800 dark:bg-blue-500/10 dark:text-blue-200">
            {demoPerformance.managerFeedback}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Stacked Salary Breakdown Visual ─── */
const SalaryBreakdownVisual = ({ gross, net, deductions, pf = 7150, tds = 10000, pt = 1000 }) => {
  const netPercent = gross > 0 ? (net / gross) * 100 : 0;
  const dedPercent = gross > 0 ? (deductions / gross) * 100 : 0;

  return (
    <div className="space-y-4 w-full">
      <div>
        <h4 className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">Salary Breakdown</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Take-home pay vs monthly deductions</p>
      </div>

      <div className="h-3.5 w-full bg-slate-100 dark:bg-white/[0.04] rounded-full overflow-hidden flex">
        <div className="bg-emerald-500 h-full hover:opacity-90 transition-opacity" style={{ width: `${netPercent}%` }} />
        <div className="bg-amber-500 h-full hover:opacity-90 transition-opacity" style={{ width: `${dedPercent}%` }} />
      </div>

      <div className="space-y-2.5 pt-1">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500 shrink-0" />
            Take-Home Pay (Net)
          </span>
          <span className="text-slate-900 dark:text-white font-extrabold">{currency(net)} ({netPercent.toFixed(0)}%)</span>
        </div>
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <span className="w-2.5 h-2.5 rounded bg-amber-500 shrink-0" />
            Total Deductions
          </span>
          <span className="text-slate-900 dark:text-white font-extrabold">{currency(deductions)} ({dedPercent.toFixed(0)}%)</span>
        </div>
      </div>

      <div className="pt-3.5 border-t border-slate-100 dark:border-white/[0.04] space-y-2">
        <h5 className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">Deduction Details</h5>
        <div className="flex justify-between items-center text-[11px] font-bold text-slate-500">
          <span>Provident Fund (PF)</span>
          <span className="text-slate-700 dark:text-slate-350 font-black">{currency(pf)}</span>
        </div>
        <div className="flex justify-between items-center text-[11px] font-bold text-slate-500">
          <span>Tax Deducted at Source (TDS)</span>
          <span className="text-slate-700 dark:text-slate-350 font-black">{currency(tds)}</span>
        </div>
        <div className="flex justify-between items-center text-[11px] font-bold text-slate-500">
          <span>Professional Tax (PT)</span>
          <span className="text-slate-700 dark:text-slate-350 font-black">{currency(pt)}</span>
        </div>
      </div>
    </div>
  );
};

/* ─── Salary Stat Card Helper ─── */
const SalaryStatCard = ({ label, value, Icon, color }) => (
  <div className="rounded-xl bg-white dark:bg-[#0d1526] border border-gray-150 dark:border-white/[0.08] shadow-[0_1px_3px_rgba(15,23,42,0.015),0_4px_12px_rgba(15,23,42,0.015)] flex flex-col justify-between p-5 min-h-[135px] w-full hover:shadow-md hover:border-slate-300 dark:hover:border-white/[0.12] transition-all duration-300 relative overflow-hidden">
    <div className="flex items-center justify-between w-full">
      <span className="text-[10.5px] md:text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-350 leading-none pr-2">
        {label}
      </span>
      <div className="grid h-8 w-8 place-items-center rounded-xl shrink-0" style={{ color, backgroundColor: color + '14' }}>
        <Icon size={16} />
      </div>
    </div>
    <div className="text-3xl font-black mt-4 text-slate-900 dark:text-white tracking-tight w-full">
      {value}
    </div>
  </div>
);

function SalaryPage() {
  const [alertMessage, setAlertMessage] = useState(null);
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayroll = async () => {
      try {
        setLoading(true);
        const res = await api.get('/payroll/my');
        if (res.data && res.data.payrolls) {
          setPayrolls(res.data.payrolls);
        }
      } catch (err) {
        console.error('Error fetching payroll:', err);
        setError('Failed to fetch payslips from server.');
      } finally {
        setLoading(false);
      }
    };
    fetchPayroll();
  }, []);

  const latestPayroll = payrolls && payrolls.length > 0 ? payrolls[0] : null;
  const grossValue = latestPayroll ? latestPayroll.salary + (latestPayroll.allowances || 0) : demoSalary.gross;
  const netValue = latestPayroll ? latestPayroll.netPayable : demoSalary.net;
  const deductionsValue = latestPayroll ? (latestPayroll.deductions || 0) : demoSalary.deductions;
  const nextPaydayValue = demoSalary.nextPayday;

  const payslipsList = payrolls && payrolls.length > 0 
    ? payrolls.map(p => ({
        month: p.month,
        gross: p.salary + (p.allowances || 0),
        net: p.netPayable,
        status: p.status === 'paid' || p.status === 'processed' ? 'Paid' : 'Generated',
        raw: p
      }))
    : demoSalary.payslips;

  const downloadPayslip = (month, grossAmount, netAmount, rawItem) => {
    setAlertMessage(`Downloading payslip for ${month}...`);
    setTimeout(() => setAlertMessage(null), 3000);

    const pf = rawItem?.deductionBreakdown?.pf || 7150;
    const tds = rawItem?.deductionBreakdown?.tds || 10000;
    const pt = rawItem?.deductionBreakdown?.professionalTax || 1000;

    const csvContent = "data:text/csv;charset=utf-8," 
      + "Payslip Statement,AECCENTRIC ENTERPRISE EMS\n"
      + `Month,${month}\n`
      + `Gross Earnings,${grossAmount}\n`
      + `Net Take-Home,${netAmount}\n`
      + `Deductions,${grossAmount - netAmount}\n`
      + `Provident Fund (PF),${pf}\n`
      + `TDS Tax,${tds}\n`
      + `Professional Tax,${pt}\n`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `payslip_${month.replace(' ', '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAll = () => {
    setAlertMessage("Generating full financial year statement... Download started!");
    setTimeout(() => setAlertMessage(null), 4000);

    const csvContent = "data:text/csv;charset=utf-8," 
      + "FY Statement,AECCENTRIC ENTERPRISE EMS\n"
      + "Month,Gross Earnings,Net Take-Home,Deductions\n"
      + payslipsList.map(p => `${p.month},${p.gross},${p.net},${p.gross - p.net}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `fy_payslips_statement.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex h-[350px] w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {alertMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-6 left-1/2 z-50 px-5 py-3 rounded-full bg-slate-900/90 dark:bg-white/95 backdrop-blur-md text-white dark:text-slate-900 border border-slate-800 dark:border-white text-xs font-bold shadow-xl flex items-center gap-2.5"
          >
            <Check size={14} className="text-emerald-500" />
            {alertMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto py-2">
        
        {/* SECTION 1 — HERO METRICS */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Earnings Overview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            <SalaryStatCard label="Gross Monthly" value={currency(grossValue)} Icon={WalletCards} color="#2563eb" />
            <SalaryStatCard label="Net Take-Home" value={currency(netValue)} Icon={CreditCard} color="#10b981" />
            <SalaryStatCard label="Deductions" value={currency(deductionsValue)} Icon={Receipt} color="#f59e0b" />
            <SalaryStatCard label="Next Payday" value={nextPaydayValue} Icon={Calendar} color="#8b5cf6" />
          </div>
        </div>

        {/* Dynamic Multi-column Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
          
          {/* Left Column: Payslips history */}
          <div className="lg:col-span-8 flex flex-col gap-8 w-full min-w-0">
            {/* Payslips Table Card */}
            <div className="flex flex-col gap-3.5">
              <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Payslip History</h3>
              <PremiumCard className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 dark:bg-white/[0.02] text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-white/[0.04]">
                      <tr>
                        <th className="px-6 py-4">Month</th>
                        <th className="px-6 py-4">Gross Salary</th>
                        <th className="px-6 py-4">Take Home (Net)</th>
                        <th className="px-6 py-4">Payout Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                      {payslipsList.map((row) => (
                        <tr key={row.month} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors">
                          <td className="px-6 py-4 font-black text-slate-900 dark:text-white">{row.month}</td>
                          <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">{currency(row.gross)}</td>
                          <td className="px-6 py-4 font-extrabold text-slate-900 dark:text-white">{currency(row.net)}</td>
                          <td className="px-6 py-4">
                            <span className={row.status === 'Generated' 
                              ? 'inline-flex items-center justify-center h-5.5 px-2.5 rounded-full text-[9.5px] font-black uppercase bg-blue-50 dark:bg-blue-500/[0.08] text-blue-700 dark:text-blue-400 border border-blue-200/50 dark:border-blue-500/20'
                              : 'inline-flex items-center justify-center h-5.5 px-2.5 rounded-full text-[9.5px] font-black uppercase bg-emerald-50 dark:bg-emerald-500/[0.08] text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20'}>
                              {row.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => downloadPayslip(row.month, row.gross, row.net, row.raw)} 
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10.5px] font-black text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 border border-blue-250/20 dark:border-blue-500/20 cursor-pointer transition-colors">
                              <Download size={12} />
                              <span>Download</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </PremiumCard>
            </div>
          </div>

          {/* Right Column: Breakdown & Quick actions */}
          <div className="lg:col-span-4 flex flex-col gap-8 w-full min-w-0">
            
            {/* Visual breakdown donut/bars */}
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Salary Structure</h3>
              <PremiumCard className="flex flex-col p-6">
                <SalaryBreakdownVisual 
                  gross={grossValue} 
                  net={netValue} 
                  deductions={deductionsValue} 
                  pf={latestPayroll?.deductionBreakdown?.pf}
                  tds={latestPayroll?.deductionBreakdown?.tds}
                  pt={latestPayroll?.deductionBreakdown?.professionalTax}
                />
              </PremiumCard>
            </div>

            {/* Quick Financial actions */}
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Financial Tools</h3>
              <PremiumCard className="grid grid-cols-2 gap-3 p-4">
                
                <button onClick={downloadAll}
                  className="flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-white/[0.015] border border-slate-150 dark:border-white/[0.04] rounded-xl hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-500/[0.03] text-center gap-1.5 group transition-all cursor-pointer h-[80px]">
                  <Download size={14} className="text-blue-500 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-350 leading-tight">YTD Summary</span>
                </button>

                <button className="flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-white/[0.015] border border-slate-150 dark:border-white/[0.04] rounded-xl hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-500/[0.03] text-center gap-1.5 group transition-all cursor-pointer h-[80px]">
                  <FileText size={14} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-350 leading-tight">Form 16</span>
                </button>

              </PremiumCard>
            </div>

          </div>

        </div>

      </div>
    </>
  );
}

/* ─── Expense Stat Card Helper ─── */
const ExpenseStatCard = ({ label, value, Icon, color, subText }) => (
  <div className="rounded-[16px] bg-white dark:bg-[#0d1526] border border-slate-100 dark:border-white/[0.06] shadow-[0_2px_8px_rgba(15,23,42,0.01),0_8px_24px_rgba(15,23,42,0.01)] flex flex-col justify-between p-5 min-h-[135px] w-full hover:shadow-md hover:border-slate-200 dark:hover:border-white/[0.12] transition-all duration-300 relative overflow-hidden group">
    {/* Gradient background overlay on hover */}
    <div className="absolute inset-0 bg-gradient-to-tr opacity-[0.015] dark:opacity-[0.03] transition-opacity duration-300 group-hover:opacity-[0.035] dark:group-hover:opacity-[0.07]" style={{ backgroundImage: `linear-gradient(135deg, ${color}, transparent)` }} />
    <div className="flex items-center justify-between w-full relative z-10">
      <span className="text-[10.5px] md:text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 leading-none">
        {label}
      </span>
      <div className="grid h-9 w-9 place-items-center rounded-xl shrink-0 transition-transform duration-300 group-hover:scale-110" style={{ color, backgroundColor: color + '14' }}>
        <Icon size={18} />
      </div>
    </div>
    <div className="mt-4 relative z-10">
      <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight w-full leading-none">
        {value}
      </div>
      {subText && (
        <span className="text-[10.5px] font-bold text-slate-400 dark:text-slate-500 mt-2 block leading-none">
          {subText}
        </span>
      )}
    </div>
  </div>
);

/* ─── Interactive New Expense Modal ─── */
function NewExpenseModal({ onClose, onAddClaim, prefilled }) {
  const [form, setForm] = useState(() => ({
    title: prefilled?.title || '',
    category: prefilled?.category || 'Software',
    amount: prefilled?.amount || ''
  }));
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Please write a claim title.'); return; }
    if (!form.amount || Number(form.amount) <= 0) { setError('Amount must be greater than zero.'); return; }

    onAddClaim({
      id: `exp-${Date.now()}`,
      title: form.title,
      category: form.category,
      amount: Number(form.amount),
      date: new Date().toISOString(),
      status: 'Manager Review'
    });
  };

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const inp = 'w-full text-[13px] px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] text-gray-900 dark:text-slate-200 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-white/[0.04] transition-all';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-[#0d1526] rounded-[24px] border border-slate-100 dark:border-white/[0.08] shadow-2xl p-6"
      >
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-white/[0.04]">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Receipt className="text-blue-500" size={18} />
            File Reimbursement Claim
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-white/[0.04] cursor-pointer transition-colors">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mt-3 px-3.5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-500/[0.1] border border-rose-100 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-[12px] flex items-center gap-2 font-semibold">
            <AlertCircle size={14} className="shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={submit} className="flex flex-col gap-4 mt-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">Claim Details</label>
            <div className="relative">
              <input type="text" value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Figma annual team subscription" className={`${inp} pl-9`} required />
              <FileText className="absolute left-3 top-3 text-slate-400" size={14} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">Category</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} className={inp}>
                <option value="Software">Software</option>
                <option value="Travel">Travel</option>
                <option value="Equipment">Equipment</option>
                <option value="Meals">Meals / Dining</option>
                <option value="Office">Office Supplies</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">Amount (INR)</label>
              <div className="relative">
                <input type="number" value={form.amount} onChange={e => set('amount', e.target.value)} placeholder="0.00" className={`${inp} pl-7`} required />
                <span className="absolute left-3 top-3 text-xs font-extrabold text-slate-400">₹</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2.5 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-white/[0.08] text-[13px] font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors cursor-pointer">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold transition-all cursor-pointer shadow-md shadow-blue-500/10 active:scale-[0.98]">
              File Claim
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function ExpensesPage() {
  const [claims, setClaims] = useState(() => demoExpenses);
  const [showModal, setShowModal] = useState(false);
  const [prefilledClaim, setPrefilledClaim] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [receiptCount, setReceiptCount] = useState(3);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // AI Scanner Simulator States
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0); // 0=idle, 1=uploading, 2=AI parsing, 3=complete

  // Details drawer slide-over states
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [showDetailsDrawer, setShowDetailsDrawer] = useState(false);

  // Tab state for Mileage Calculator / Policies
  const [activeSidebarTab, setActiveSidebarTab] = useState('mileage');

  // Mileage estimator state
  const [mileageKm, setMileageKm] = useState('');
  const [mileagePurpose, setMileagePurpose] = useState('');
  const [mileageMode, setMileageMode] = useState('car'); // car, bike, cab

  // Accordion indices for rules
  const [accordionOpen, setAccordionOpen] = useState(0);

  const total = claims.reduce((s, e) => s + Number(e.amount || 0), 0);
  const approved = claims.filter(e => e.status === 'Approved').length;
  const pending = claims.filter(e => e.status !== 'Approved').length;

  // Recharts Category breakdown calculations
  const categoryTotals = useMemo(() => {
    const map = {};
    claims.forEach(c => {
      map[c.category] = (map[c.category] || 0) + Number(c.amount || 0);
    });
    return Object.keys(map).map(cat => ({
      name: cat,
      value: map[cat]
    }));
  }, [claims]);

  const CATEGORY_COLORS = {
    Software: '#3b82f6',
    Travel: '#10b981',
    Equipment: '#f59e0b',
    Meals: '#ec4899',
    Office: '#8b5cf6'
  };

  const handleAddClaim = (newClaim) => {
    setClaims(prev => [newClaim, ...prev]);
    setShowModal(false);
    setPrefilledClaim(null);
    setAlertMessage("Reimbursement claim filed successfully!");
    setTimeout(() => setAlertMessage(null), 3500);
  };

  const handleDeleteClaim = (id) => {
    setClaims(prev => prev.filter(claim => claim.id !== id));
    setShowDetailsDrawer(false);
    setSelectedClaim(null);
    setAlertMessage("Claim deleted.");
    setTimeout(() => setAlertMessage(null), 3000);
  };

  // Mock Receipt Scanner handler
  const handleReceiptScan = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setScanning(true);
      setScanStep(1);
      
      // Step 1: Uploading (0 - 1000ms)
      setTimeout(() => {
        setScanStep(2); // Step 2: AI Parsing (1000ms - 2000ms)
      }, 1000);
      
      // Step 3: Extracting Amount (2000ms - 2700ms)
      setTimeout(() => {
        setScanStep(3);
      }, 2000);
      
      // Step 4: Finished & Open Modal prefilled (2700ms)
      setTimeout(() => {
        setScanning(false);
        setScanStep(0);
        
        const isTravel = file.name.toLowerCase().includes('cab') || file.name.toLowerCase().includes('uber') || file.name.toLowerCase().includes('travel');
        const isMeals = file.name.toLowerCase().includes('food') || file.name.toLowerCase().includes('meal') || file.name.toLowerCase().includes('lunch') || file.name.toLowerCase().includes('restaurant');
        
        const cleanTitle = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ');
        const prefilledCategory = isTravel ? 'Travel' : isMeals ? 'Meals' : 'Software';
        const prefilledAmount = Math.floor(Math.random() * 3200) + 680; // realistic amount
        
        setPrefilledClaim({
          title: `AI Scan: ${cleanTitle}`,
          category: prefilledCategory,
          amount: prefilledAmount
        });
        
        setShowModal(true);
        setReceiptCount(prev => prev + 1);
        setAlertMessage("AI parsed receipt details successfully!");
        setTimeout(() => setAlertMessage(null), 3500);
      }, 2700);
    }
  };

  // Mileage Claim Adder
  const handleAddMileageClaim = () => {
    if (!mileageKm || Number(mileageKm) <= 0) return;
    const rates = { car: 12, bike: 6, cab: 15 };
    const rate = rates[mileageMode] || 12;
    const calcAmount = Number(mileageKm) * rate;

    setPrefilledClaim({
      title: `Mileage Claim: ${mileagePurpose || 'Client visit travel'} (${mileageKm} km)`,
      category: 'Travel',
      amount: calcAmount
    });
    setMileageKm('');
    setMileagePurpose('');
    setShowModal(true);
  };

  // CSV voucher downloader
  const downloadClaimVoucher = (claim) => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "CLAIM REIMBURSEMENT VOUCHER\n"
      + "===================================\n"
      + `Claim ID,${claim.id}\n`
      + `Title,${claim.title}\n`
      + `Category,${claim.category}\n`
      + `Amount,INR ${claim.amount}\n`
      + `Date Submitted,${new Date(claim.date).toLocaleDateString('en-IN')}\n`
      + `Approval Status,${claim.status}\n`
      + `Authorized by,Corporate HRMS System\n`
      + "===================================\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `voucher_${claim.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter claims dynamically
  const filteredClaims = useMemo(() => {
    return claims.filter(c => {
      const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [claims, searchQuery, categoryFilter, statusFilter]);

  return (
    <>
      <AnimatePresence>
        {showModal && (
          <NewExpenseModal onClose={() => { setShowModal(false); setPrefilledClaim(null); }} onAddClaim={handleAddClaim} prefilled={prefilledClaim} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {alertMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-6 left-1/2 z-50 px-5 py-3 rounded-full bg-slate-900/90 dark:bg-white/95 backdrop-blur-md text-white dark:text-slate-900 border border-slate-800 dark:border-white text-xs font-bold shadow-xl flex items-center gap-2.5"
          >
            <Check size={14} className="text-emerald-500 animate-pulse" />
            {alertMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto py-2">
        
        {/* PREMIUM CARD PAGE HEADER */}
        <div className="relative rounded-[24px] border border-blue-500/10 dark:border-white/[0.06] bg-gradient-to-r from-blue-600/[0.04] to-indigo-600/[0.02] dark:from-blue-500/[0.04] dark:to-indigo-500/[0.01] p-6 overflow-hidden flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/[0.02] dark:bg-blue-500/[0.01] rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none" />
          <div className="relative z-10 flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
              <Receipt size={22} className="animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-blue-600 dark:text-blue-400">Reimbursement Hub</span>
              <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white">Expenses & Claims</h1>
              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed max-w-xl">
                Track personal expenditures, upload invoices with our AI Receipt scanner, estimate travel mileage allowances, and monitor active approval cycles.
              </p>
            </div>
          </div>
          <div className="relative z-10 flex items-center gap-3 self-end sm:self-center">
            <div className="rounded-full border border-blue-500/10 bg-white/60 dark:bg-white/[0.03] px-3.5 py-1.5 text-[10.5px] font-black text-blue-700 dark:text-blue-300">
              Live corporate balance
            </div>
            <button onClick={() => { setPrefilledClaim(null); setShowModal(true); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition-all shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.98] cursor-pointer">
              <Plus size={14} />
              File Claim
            </button>
          </div>
        </div>

        {/* SECTION 1 — HERO METRICS CARD ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          <ExpenseStatCard label="Total Claimed" value={currency(total)} Icon={Receipt} color="#2563eb" subText="Overall claims filed" />
          <ExpenseStatCard label="Claims Approved" value={`${approved} Claims`} Icon={CheckCircle2} color="#10b981" subText="Cleared reimbursements" />
          <ExpenseStatCard label="Claims In Review" value={`${pending} Pending`} Icon={AlertCircle} color="#f59e0b" subText="Awaiting manager check" />
          <ExpenseStatCard label="Receipts Attached" value={`${receiptCount} / ${claims.length}`} Icon={Upload} color="#8b5cf6" subText="Receipt attachment rate" />
        </div>

        {/* Dynamic Multi-column Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
          
          {/* Left Column: Claims timeline/history */}
          <div className="lg:col-span-8 flex flex-col gap-4 w-full min-w-0">
            
            {/* Search and Filters Toolbar */}
            <div className="flex flex-col gap-3.5 bg-slate-50/50 dark:bg-white/[0.015] border border-slate-100 dark:border-white/[0.04] p-4 rounded-2xl w-full">
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between w-full">
                
                {/* Search box */}
                <div className="relative w-full sm:max-w-xs">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search claims, category..."
                    className="w-full text-xs pl-8.5 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#070D1A] text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <Search className="absolute left-3 top-3 text-slate-400" size={13} />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold">Clear</button>
                  )}
                </div>

                {/* Status selector */}
                <div className="flex items-center gap-2 w-full sm:w-auto self-end sm:self-center justify-end">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Status:</span>
                  <div className="flex bg-white dark:bg-[#070D1A] border border-slate-200 dark:border-white/[0.08] rounded-xl p-1 gap-1">
                    {['All', 'Approved', 'Finance Review', 'Manager Review'].map(st => (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wide transition-all cursor-pointer ${statusFilter === st ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/[0.03]'}`}
                      >
                        {st === 'All' ? 'All' : st.replace(' Review', '')}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Category selector pills */}
              <div className="flex items-center gap-2 border-t border-slate-100 dark:border-white/[0.03] pt-3 overflow-x-auto scrollbar-none">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider shrink-0">Category:</span>
                <div className="flex gap-2 shrink-0">
                  {['All', 'Software', 'Travel', 'Equipment', 'Meals', 'Office'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-xl text-[10.5px] font-bold border transition-all cursor-pointer ${categoryFilter === cat ? 'bg-blue-600/10 text-blue-600 border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' : 'bg-white dark:bg-[#070D1A] text-slate-500 border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.12]'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Claims Table Container */}
            <div className="rounded-[20px] bg-white dark:bg-[#0d1526] border border-slate-100 dark:border-white/[0.06] shadow-sm overflow-hidden w-full">
              {filteredClaims.length === 0 ? (
                <div className="p-16 text-center flex flex-col items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <Receipt size={22} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-700 dark:text-slate-350 text-sm">No matching claims found</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs leading-relaxed mt-1.5">No reimbursement requests match your active search terms or filter selection.</p>
                  </div>
                  <button onClick={() => { setSearchQuery(''); setCategoryFilter('All'); setStatusFilter('All'); }} className="px-4 py-2 bg-slate-100 dark:bg-white/[0.04] text-[11px] font-black text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-white/[0.08] transition-colors cursor-pointer">
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto scrollbar-thin">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50/50 dark:bg-white/[0.015] text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-white/[0.04]">
                      <tr>
                        <th className="px-6 py-4">Claim Details</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Submitted</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/60 dark:divide-white/[0.04]">
                      {filteredClaims.map((row) => (
                        <tr
                          key={row.id}
                          onClick={() => { setSelectedClaim(row); setShowDetailsDrawer(true); }}
                          className="hover:bg-slate-50/40 dark:hover:bg-white/[0.01] transition-all duration-150 cursor-pointer group"
                        >
                          <td className="px-6 py-4 max-w-xs">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200/20">
                                <Receipt size={14} className="text-slate-500 dark:text-slate-400" />
                              </div>
                              <div className="min-w-0">
                                <span className="font-extrabold text-slate-900 dark:text-white truncate block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{row.title}</span>
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold block mt-0.5">ID: {row.id.toUpperCase()}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-slate-500 dark:text-slate-400 px-2 py-1 rounded-lg bg-slate-100/50 dark:bg-slate-800/40 text-[10.5px]">
                              {row.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-black text-slate-900 dark:text-white text-sm">
                            {currency(row.amount)}
                          </td>
                          <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-semibold">
                            {new Date(row.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="px-6 py-4">
                            <span className={row.status === 'Approved' 
                              ? 'inline-flex items-center justify-center h-5.5 px-2.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-50 dark:bg-emerald-500/[0.08] text-emerald-700 dark:text-emerald-450 border border-emerald-200/50 dark:border-emerald-500/20'
                              : row.status === 'Finance Review'
                                ? 'inline-flex items-center justify-center h-5.5 px-2.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-50 dark:bg-blue-500/[0.08] text-blue-700 dark:text-blue-400 border border-blue-200/50 dark:border-blue-500/20'
                                : 'inline-flex items-center justify-center h-5.5 px-2.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-50 dark:bg-amber-500/[0.08] text-amber-700 dark:text-amber-450 border border-amber-200/50 dark:border-amber-500/20'}>
                              {row.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => { setSelectedClaim(row); setShowDetailsDrawer(true); }}
                                className="inline-flex items-center justify-center p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.04] border border-slate-200/20 dark:border-white/[0.04] cursor-pointer transition-colors">
                                <Eye size={12} />
                              </button>
                              {row.status !== 'Approved' && (
                                <button onClick={() => handleDeleteClaim(row.id)} 
                                  className="inline-flex items-center justify-center p-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/[0.1] hover:text-rose-700 dark:hover:text-rose-350 border border-rose-200/20 dark:border-rose-500/20 cursor-pointer transition-colors">
                                  <Trash2 size={12} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Analytics, Scanner and Tools */}
          <div className="lg:col-span-4 flex flex-col gap-6 w-full min-w-0">
            
            {/* Reimbursement Analytics Card */}
            <div className="rounded-[20px] bg-white dark:bg-[#0d1526] border border-slate-100 dark:border-white/[0.06] shadow-sm p-5 flex flex-col gap-4">
              <div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Spend Breakdown</h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-0.5">Distribution of claims by category</p>
              </div>

              {categoryTotals.length === 0 ? (
                <div className="h-44 flex items-center justify-center text-slate-400 text-[11px] font-bold">No expense data available</div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="h-40 w-full relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryTotals}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={65}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {categoryTotals.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={CATEGORY_COLORS[entry.name] || '#64748b'} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(val) => `₹${val.toLocaleString('en-IN')}`}
                          contentStyle={{ 
                            backgroundColor: '#0d1526', 
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '11px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute text-center">
                      <span className="text-[9px] uppercase font-black text-slate-400 dark:text-slate-500 block leading-none">Total Claimed</span>
                      <span className="text-base font-black text-slate-800 dark:text-white mt-1.5 block leading-none">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Legend list */}
                  <div className="grid grid-cols-2 gap-2 border-t border-slate-100 dark:border-white/[0.03] pt-3">
                    {categoryTotals.map(item => {
                      const share = total > 0 ? ((item.value / total) * 100).toFixed(0) : 0;
                      return (
                        <div key={item.name} className="flex items-center gap-2 min-w-0">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: CATEGORY_COLORS[item.name] || '#64748b' }} />
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-350 truncate block leading-none">{item.name}</span>
                            <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 mt-1 block leading-none">{share}% ({currency(item.value)})</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* AI Receipt Scanner Card */}
            <div className="rounded-[20px] bg-white dark:bg-[#0d1526] border border-slate-100 dark:border-white/[0.06] shadow-sm p-5 flex flex-col gap-4">
              <div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Cpu size={14} className="text-blue-500" />
                  AI Receipt Scanner
                </h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-0.5">Attach invoices to auto-populate reimbursement details</p>
              </div>

              <div className="relative border border-dashed border-slate-200 dark:border-white/[0.08] bg-slate-50/50 dark:bg-white/[0.01] rounded-[16px] p-5 text-center flex flex-col items-center justify-center min-h-[200px] hover:bg-slate-50 hover:border-blue-500/50 dark:hover:bg-white/[0.02] dark:hover:border-blue-500/30 transition-all group overflow-hidden">
                {scanning ? (
                  <div className="flex flex-col items-center justify-center gap-3 w-full">
                    {/* Animated vertical scanline laser line */}
                    <div className="absolute inset-x-0 h-[2px] bg-blue-500/60 dark:bg-blue-400/80 shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-[scan_1.5s_infinite_ease-in-out]" />
                    <Upload className="text-blue-500 animate-bounce shrink-0" size={24} />
                    <div className="w-full max-w-[120px] bg-slate-200 dark:bg-white/[0.08] h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full animate-[progress_2.5s_ease-out_forwards]" style={{ width: '100%' }} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-800 dark:text-slate-200 leading-none">
                        {scanStep === 1 ? 'Uploading File...' : scanStep === 2 ? 'AI Processing...' : 'Extracting Amounts...'}
                      </p>
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 font-bold">Scanning text & reconciling items</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <input type="file" onChange={handleReceiptScan} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" accept="image/*,application/pdf" />
                    <Upload className="text-blue-500 group-hover:scale-110 transition-transform mb-2.5 shrink-0" size={24} />
                    <p className="text-xs font-black text-slate-800 dark:text-slate-200 leading-none">Drop receipt file here</p>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-1.5 leading-none">PDF, JPG, or PNG up to 5 MB</p>
                    <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black shadow-sm pointer-events-none shadow-blue-500/10">Choose File</button>
                  </>
                )}
              </div>
            </div>

            {/* Mileage Estimator and Rules Tabbed panel */}
            <div className="rounded-[20px] bg-white dark:bg-[#0d1526] border border-slate-100 dark:border-white/[0.06] shadow-sm p-4 flex flex-col gap-4">
              
              {/* Tab Selector */}
              <div className="flex bg-slate-50 dark:bg-white/[0.02] border border-slate-150 dark:border-white/[0.04] p-1 rounded-xl">
                <button
                  onClick={() => setActiveSidebarTab('mileage')}
                  className={`flex-1 py-2 text-center rounded-lg text-[10.5px] font-black transition-all cursor-pointer ${activeSidebarTab === 'mileage' ? 'bg-white dark:bg-[#0d1526] text-slate-900 dark:text-white shadow-sm' : 'text-slate-400'}`}
                >
                  Mileage Calc
                </button>
                <button
                  onClick={() => setActiveSidebarTab('rules')}
                  className={`flex-1 py-2 text-center rounded-lg text-[10.5px] font-black transition-all cursor-pointer ${activeSidebarTab === 'rules' ? 'bg-white dark:bg-[#0d1526] text-slate-900 dark:text-white shadow-sm' : 'text-slate-400'}`}
                >
                  Expense Rules
                </button>
              </div>

              {activeSidebarTab === 'mileage' ? (
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[9.5px] font-black text-slate-400 uppercase tracking-wider mb-1">Distance (km)</label>
                      <input
                        type="number"
                        value={mileageKm}
                        onChange={e => setMileageKm(e.target.value)}
                        placeholder="e.g. 45"
                        className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50/50 dark:bg-white/[0.01] text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[9.5px] font-black text-slate-400 uppercase tracking-wider mb-1">Travel Mode</label>
                      <select
                        value={mileageMode}
                        onChange={e => setMileageMode(e.target.value)}
                        className="w-full text-xs px-2 py-2 rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50/50 dark:bg-white/[0.01] text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="car">Personal Car (₹12/km)</option>
                        <option value="bike">Personal Bike (₹6/km)</option>
                        <option value="cab">Cab / Taxi (₹15/km)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9.5px] font-black text-slate-400 uppercase tracking-wider mb-1">Travel Purpose</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={mileagePurpose}
                        onChange={e => setMileagePurpose(e.target.value)}
                        placeholder="e.g. Sector 62 Office visit"
                        className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50/50 dark:bg-white/[0.01] text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                      <MapPin className="absolute left-2.5 top-2.5 text-slate-400" size={12} />
                    </div>
                  </div>

                  {mileageKm && Number(mileageKm) > 0 && (
                    <div className="p-3 bg-blue-500/[0.03] dark:bg-blue-500/[0.04] border border-blue-500/10 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">Estimated Reimbursement:</span>
                        <span className="font-extrabold text-blue-600 dark:text-blue-400 text-sm">₹{(Number(mileageKm) * (mileageMode === 'bike' ? 6 : mileageMode === 'cab' ? 15 : 12)).toLocaleString('en-IN')}</span>
                      </div>
                      <span className="text-[9.5px] font-black text-slate-400">Rate: ₹{mileageMode === 'bike' ? '6' : mileageMode === 'cab' ? '15' : '12'}/km</span>
                    </div>
                  )}

                  <button
                    onClick={handleAddMileageClaim}
                    disabled={!mileageKm || Number(mileageKm) <= 0}
                    className="w-full py-2.5 bg-slate-900 text-white dark:bg-white dark:text-slate-950 rounded-xl text-xs font-black tracking-wide hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                  >
                    File Mileage Claim
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {[
                    { title: "Software & SaaS licenses", limit: "₹5,000 / month", details: "Direct manager email approvals are mandatory for claims exceeding budget thresholds." },
                    { title: "Travel & Mileage allowances", limit: "₹12/km Car, ₹6/km Bike", details: "Requires clear client meeting purpose, route log details, and HR registration." },
                    { title: "Meals & Dining", limit: "₹1,500 / day max", details: "Applicable only on outstation client client support or approved group events." },
                    { title: "Hardware & Equipment", limit: "₹5,000 max hardware", details: "Requires prior email check-off from internal IT division manager." }
                  ].map((rule, idx) => {
                    const isOpen = accordionOpen === idx;
                    return (
                      <div key={idx} className="border border-slate-100 dark:border-white/[0.04] rounded-xl overflow-hidden bg-slate-50/20 dark:bg-white/[0.005]">
                        <button
                          onClick={() => setAccordionOpen(isOpen ? -1 : idx)}
                          className="w-full flex items-center justify-between p-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.02] cursor-pointer"
                        >
                          <div className="min-w-0 flex-1 pr-2">
                            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block leading-tight">{rule.title}</span>
                            <span className="text-[9.5px] font-extrabold text-blue-600 dark:text-blue-400 mt-1 block leading-none">{rule.limit}</span>
                          </div>
                          <ChevronDown size={14} className={`text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isOpen && (
                          <div className="px-3 pb-3 pt-1 border-t border-slate-100 dark:border-white/[0.03] text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                            {rule.details}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* Slide-over details timeline drawer */}
      <AnimatePresence>
        {showDetailsDrawer && selectedClaim && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm" onClick={() => setShowDetailsDrawer(false)}>
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-[#0d1526] h-full shadow-2xl border-l border-slate-100 dark:border-white/[0.08] flex flex-col relative"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-slate-100 dark:border-white/[0.04] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-600">
                    <Receipt size={18} />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">Claim Information</span>
                    <h2 className="text-sm font-black text-slate-900 dark:text-white mt-0.5 leading-tight">{selectedClaim.title}</h2>
                  </div>
                </div>
                <button onClick={() => setShowDetailsDrawer(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-white/[0.04] cursor-pointer transition-all">
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Body Scroll */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin">
                
                {/* Visual Amount details */}
                <div className="p-5 bg-slate-50 dark:bg-white/[0.015] border border-slate-100 dark:border-white/[0.04] rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[9.5px] uppercase font-black text-slate-400 tracking-wider">Claimed Value</span>
                    <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{currency(selectedClaim.amount)}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[9.5px] uppercase font-black text-slate-400 tracking-wider">Budget Category</span>
                    <div className="text-xs font-black text-slate-700 dark:text-slate-300 mt-1.5 bg-slate-200/50 dark:bg-white/[0.05] px-2.5 py-1 rounded-lg inline-block">{selectedClaim.category}</div>
                  </div>
                </div>

                {/* Stepper timeline */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Approval Journey</h3>
                  <div className="relative border-l-2 border-slate-100 dark:border-white/[0.04] ml-3 pl-6.5 space-y-5.5 py-1">
                    
                    {/* Step 1: Submission */}
                    <div className="relative">
                      <span className="absolute -left-[35px] top-0.5 grid h-6 w-6 place-items-center rounded-full bg-emerald-500 text-white shadow-sm ring-4 ring-white dark:ring-[#0d1526]">
                        <Check size={11} />
                      </span>
                      <div>
                        <h4 className="text-xs font-black text-slate-900 dark:text-white">Claim Submitted</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Submitted on {new Date(selectedClaim.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold mt-1">Reimbursement claim form was successfully filed in system portal.</p>
                      </div>
                    </div>

                    {/* Step 2: Manager Review */}
                    <div className="relative">
                      <span className={`absolute -left-[35px] top-0.5 grid h-6 w-6 place-items-center rounded-full text-white shadow-sm ring-4 ring-white dark:ring-[#0d1526] ${
                        ['Finance Review', 'Approved'].includes(selectedClaim.status) ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}>
                        {['Finance Review', 'Approved'].includes(selectedClaim.status) ? <Check size={11} /> : <Clock size={11} />}
                      </span>
                      <div>
                        <h4 className="text-xs font-black text-slate-900 dark:text-white">Manager Verification</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {['Finance Review', 'Approved'].includes(selectedClaim.status) ? 'Approved' : 'Awaiting review'}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold mt-1">Department manager verifies spending guidelines alignment.</p>
                      </div>
                    </div>

                    {/* Step 3: Finance Audit */}
                    <div className="relative">
                      <span className={`absolute -left-[35px] top-0.5 grid h-6 w-6 place-items-center rounded-full text-white shadow-sm ring-4 ring-white dark:ring-[#0d1526] ${
                        selectedClaim.status === 'Approved' ? 'bg-emerald-500' : selectedClaim.status === 'Finance Review' ? 'bg-amber-500' : 'bg-slate-200 dark:bg-white/[0.04] text-slate-400 dark:text-slate-500'
                      }`}>
                        {selectedClaim.status === 'Approved' ? <Check size={11} /> : <Clock size={11} />}
                      </span>
                      <div>
                        <h4 className="text-xs font-black text-slate-900 dark:text-white">Corporate Finance Audit</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {selectedClaim.status === 'Approved' ? 'Approved' : selectedClaim.status === 'Finance Review' ? 'Awaiting verification' : 'Pending Manager Review'}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold mt-1">Finance operations audit and receipt tax validation checks.</p>
                      </div>
                    </div>

                    {/* Step 4: Bank Payout */}
                    <div className="relative">
                      <span className={`absolute -left-[35px] top-0.5 grid h-6 w-6 place-items-center rounded-full text-white shadow-sm ring-4 ring-white dark:ring-[#0d1526] ${
                        selectedClaim.status === 'Approved' ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-white/[0.04] text-slate-400 dark:text-slate-500'
                      }`}>
                        {selectedClaim.status === 'Approved' ? <Check size={11} /> : <Clock size={11} />}
                      </span>
                      <div>
                        <h4 className="text-xs font-black text-slate-900 dark:text-white">Direct Deposit Clearance</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {selectedClaim.status === 'Approved' ? 'Paid' : 'Pending Audit Clearance'}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold mt-1">Reimbursement disbursement directly processed to primary corporate payroll account.</p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Scanned Receipt Visual component */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Associated Invoice</h3>
                  <div className="border border-dashed border-slate-200 dark:border-white/[0.08] p-5 bg-white dark:bg-[#070D1A] rounded-xl flex flex-col gap-4 relative overflow-hidden font-mono text-[10px]">
                    
                    {/* Simulated receipt header */}
                    <div className="text-center pb-2 border-b border-dashed border-slate-200 dark:border-white/[0.08]">
                      <div className="text-slate-800 dark:text-white font-extrabold text-[11px] uppercase tracking-wider">TAX INVOICE VOUCHER</div>
                      <div className="text-slate-400 dark:text-slate-500 mt-0.5 font-bold">RECONCILED BY CORPORATE AI</div>
                    </div>

                    <div className="space-y-1.5 text-slate-600 dark:text-slate-400">
                      <div className="flex justify-between"><span className="font-bold">Transaction ID:</span> <span className="font-black text-slate-800 dark:text-slate-200">{selectedClaim.id.toUpperCase()}</span></div>
                      <div className="flex justify-between"><span className="font-bold">Date Filed:</span> <span className="font-black text-slate-800 dark:text-slate-200">{new Date(selectedClaim.date).toLocaleDateString('en-IN')}</span></div>
                      <div className="flex justify-between"><span className="font-bold">Merchant / Vendor:</span> <span className="font-black text-slate-800 dark:text-slate-200">{selectedClaim.title.replace('AI Scan: ', '')}</span></div>
                      <div className="flex justify-between"><span className="font-bold">Tax Category:</span> <span className="font-black text-slate-800 dark:text-slate-200">{selectedClaim.category}</span></div>
                    </div>

                    {/* Receipt Itemized pricing */}
                    <div className="border-t border-b border-dashed border-slate-200 dark:border-white/[0.08] py-2 space-y-1.5">
                      <div className="flex justify-between font-bold"><span>1x Reimbursement item</span> <span className="font-black text-slate-800 dark:text-slate-200">{currency(selectedClaim.amount)}</span></div>
                      <div className="flex justify-between text-slate-400 dark:text-slate-500 font-bold"><span>GST Tax (Included)</span> <span>₹0.00</span></div>
                    </div>

                    <div className="flex justify-between font-extrabold text-slate-900 dark:text-white text-xs">
                      <span>GRAND TOTAL:</span>
                      <span>{currency(selectedClaim.amount)}</span>
                    </div>

                    {/* Barcode visual */}
                    <div className="flex flex-col items-center gap-1.5 pt-3">
                      <div className="flex justify-center items-center gap-[1.5px] h-6 bg-slate-50 dark:bg-white/[0.02] px-3.5 py-1.5 rounded-lg border border-slate-200/50 dark:border-white/[0.04] w-full">
                        <div className="w-[2px] h-full bg-slate-800 dark:bg-slate-200 shrink-0"></div>
                        <div className="w-[1px] h-full bg-slate-800 dark:bg-slate-200 shrink-0"></div>
                        <div className="w-[3px] h-full bg-slate-800 dark:bg-slate-200 shrink-0"></div>
                        <div className="w-[1px] h-full bg-slate-800 dark:bg-slate-200 shrink-0"></div>
                        <div className="w-[2px] h-full bg-slate-800 dark:bg-slate-200 shrink-0"></div>
                        <div className="w-[4px] h-full bg-slate-800 dark:bg-slate-200 shrink-0"></div>
                        <div className="w-[1px] h-full bg-slate-800 dark:bg-slate-200 shrink-0"></div>
                        <div className="w-[2px] h-full bg-slate-800 dark:bg-slate-200 shrink-0"></div>
                        <div className="w-[3px] h-full bg-slate-800 dark:bg-slate-200 shrink-0"></div>
                        <div className="w-[1px] h-full bg-slate-800 dark:bg-slate-200 shrink-0"></div>
                        <div className="w-[2px] h-full bg-slate-800 dark:bg-slate-200 shrink-0"></div>
                        <div className="w-[4px] h-full bg-slate-800 dark:bg-slate-200 shrink-0"></div>
                        <div className="w-[1px] h-full bg-slate-800 dark:bg-slate-200 shrink-0"></div>
                        <div className="w-[2px] h-full bg-slate-800 dark:bg-slate-200 shrink-0"></div>
                      </div>
                      <span className="text-[7.5px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">VOUCHER-{selectedClaim.id.toUpperCase()}</span>
                    </div>

                  </div>
                </div>

              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 border-t border-slate-100 dark:border-white/[0.04] bg-slate-50/50 dark:bg-white/[0.005] flex gap-3.5">
                <button
                  onClick={() => downloadClaimVoucher(selectedClaim)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#070D1A] text-slate-700 dark:text-slate-350 text-xs font-black flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-white/[0.04] active:scale-[0.98] transition-all cursor-pointer shadow-sm"
                >
                  <FileSpreadsheet size={13} className="text-emerald-500" />
                  Export Voucher
                </button>
                {selectedClaim.status !== 'Approved' && (
                  <button
                    onClick={() => handleDeleteClaim(selectedClaim.id)}
                    className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer shadow-sm shadow-rose-500/10"
                  >
                    <Trash2 size={13} />
                    Delete Request
                  </button>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState(demoAnnouncements);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        // Pull from the general employee overview which carries broadcast announcements
        const res = await api.get('/dashboard/employee-overview');
        // Upcoming meetings can serve as company-level announcements; for now keep demo for broadcast
        // The backend doesn't have a dedicated announcements endpoint yet, so we use demoAnnouncements as reliable fallback
        if (res.data && res.data.success) {
          setAnnouncements(demoAnnouncements); // Maintained as high-quality demo until endpoint exists
        }
      } catch (err) {
        console.error('Announcements fetch fallback:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const TONE_MAP = { Finance: 'blue', HR: 'green', 'IT Ops': 'amber' };

  return (
    <div className="space-y-6">
      <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Latest Company Broadcasts</h3>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {announcements.map(item => (
          <motion.div
            key={item.id}
            whileHover={{ y: -4 }}
            className={`${card} flex min-h-[230px] flex-col justify-between p-5`}
          >
            <div>
              <div className="flex items-center justify-between gap-3">
                <StatusPill tone={TONE_MAP[item.owner] || 'blue'}>{item.owner}</StatusPill>
                <span className={`text-xs font-bold ${soft}`}>{item.date}</span>
              </div>
              <h2 className="mt-4 text-base font-black text-slate-950 dark:text-white">{item.title}</h2>
              <p className={`mt-2 text-sm leading-relaxed ${soft}`}>{item.message}</p>
            </div>
            <button className="mt-5 text-left text-xs font-black text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 transition-colors">
              Read announcement →
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function MeetingsPage() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setLoading(true);
        const res = await api.get('/meetings/my');
        if (res.data && res.data.meetings && res.data.meetings.length > 0) {
          setMeetings(res.data.meetings);
        } else {
          setMeetings(demoMeetings);
        }
      } catch (err) {
        console.error('Error fetching meetings:', err);
        setMeetings(demoMeetings);
      } finally {
        setLoading(false);
      }
    };
    fetchMeetings();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[350px] w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-blue-600 border-t-transparent" />
      </div>
    );
  }

  const displayMeetings = meetings.length > 0 ? meetings : demoMeetings;

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
      <div className={`${card} p-5`}>
        <h2 className="text-sm font-black text-slate-950 dark:text-white">Today&apos;s schedule</h2>
        <p className={`mb-4 text-xs ${soft}`}>Meetings, attendees, and live actions</p>
        <div className="space-y-3">
          {displayMeetings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar size={24} className="text-slate-300 mb-2" />
              <p className="text-sm font-bold text-slate-500">No meetings scheduled today</p>
            </div>
          ) : (
            displayMeetings.map(meeting => (
              <div key={meeting._id || meeting.id} className="rounded-[16px] border border-slate-100 bg-slate-50 p-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-blue-600" />
                      <span className="text-xs font-black text-blue-600 dark:text-blue-300">
                        {new Date(meeting.startTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} — {meeting.duration || '1 hr'}
                      </span>
                    </div>
                    <h3 className="mt-2 text-sm font-black text-slate-950 dark:text-white">{meeting.title}</h3>
                    <p className={`mt-1 text-xs ${soft}`}>{meeting.description}</p>
                  </div>
                  <button className="shrink-0 rounded-xl bg-blue-600 px-4 py-2 text-xs font-black text-white hover:bg-blue-700 transition-colors">
                    Join Meeting
                  </button>
                </div>
                {meeting.participants && meeting.participants.length > 0 && (
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {meeting.participants.map((person, i) => (
                      <StatusPill key={person._id || i} tone="slate">
                        {person.fullName || person}
                      </StatusPill>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      <div className={`${card} p-5`}>
        <h2 className="text-sm font-black text-slate-950 dark:text-white">AI summaries</h2>
        <p className={`mb-4 text-xs ${soft}`}>Generated from agenda and project context</p>
        <div className="space-y-3">
          {displayMeetings.map(meeting => (
            <div key={(meeting._id || meeting.id) + '-summary'} className="rounded-[16px] bg-blue-50 p-4 text-sm font-semibold leading-relaxed text-blue-800 dark:bg-blue-500/10 dark:text-blue-200">
              <p className="mb-1 font-black">{meeting.title}</p>
              {meeting.summary || `Agenda: ${meeting.description || 'To be confirmed by organizer.'}`}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notifications');
      if (res.data && res.data.notifications) {
        setNotifications(res.data.notifications);
      } else {
        setNotifications(demoNotifications);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setNotifications(demoNotifications);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id, isRead) => {
    if (isRead) return;
    try {
      // If it's a demo notification (doesn't look like MongoDB ObjectId)
      if (String(id).startsWith('n') || id.length < 10) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
        return;
      }
      const res = await api.patch(`/notifications/${id}/read`);
      if (res.data && res.data.success) {
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      }
    } catch (err) {
      console.error('Error marking read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const hasReal = notifications.some(n => n._id && !n.read);
      if (hasReal) {
        await api.patch('/notifications/read-all');
      }
      setNotifications(prev => prev.map(n => ({ ...n, read: true, unread: false })));
      setAlertMessage("All notifications marked as read.");
      setTimeout(() => setAlertMessage(null), 3000);
    } catch (err) {
      console.error('Error marking all read:', err);
    }
  };

  const unreadCount = notifications.filter(n => n.unread || (n.read === false)).length;
  const taskCount = notifications.filter(n => n.type === 'task').length;
  const meetingCount = notifications.filter(n => n.type === 'meeting').length;
  const approvalsCount = notifications.filter(n => ['leave', 'payroll'].includes(n.type)).length;

  if (loading) {
    return (
      <div className="flex h-[350px] w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {alertMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-6 left-1/2 z-50 px-5 py-3 rounded-full bg-slate-900/90 dark:bg-white/95 backdrop-blur-md text-white dark:text-slate-900 border border-slate-800 dark:border-white text-xs font-bold shadow-xl flex items-center gap-2.5"
          >
            <Check size={14} className="text-emerald-500" />
            {alertMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Status Dashboard</h2>
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllAsRead}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 border border-blue-250/20 dark:border-blue-500/20 cursor-pointer transition-colors"
            >
              <CheckCircle2 size={13} />
              Mark all as read
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <MetricCard label="Unread" value={unreadCount} icon={Bell} color="#2563eb" />
          <MetricCard label="Task Alerts" value={taskCount} icon={CheckCircle2} color="#10b981" />
          <MetricCard label="Meeting Alerts" value={meetingCount} icon={Calendar} color="#f59e0b" />
          <MetricCard label="Approvals" value={approvalsCount} icon={FileText} color="#8b5cf6" />
        </div>

        <div className={`${card} divide-y divide-slate-100 dark:divide-white/[0.05] overflow-hidden`}>
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-450 dark:text-slate-550 text-sm">
              <Bell size={24} className="mx-auto mb-2 text-slate-300" />
              No notifications yet.
            </div>
          ) : (
            notifications.map(item => {
              const isUnread = item.unread || (item.read === false);
              const itemId = item._id || item.id;
              const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : (item.time || 'Recently');
              
              return (
                <div 
                  key={itemId} 
                  onClick={() => handleMarkAsRead(itemId, !isUnread)}
                  className={`flex items-start gap-4 p-5 transition-colors cursor-pointer ${isUnread ? 'bg-blue-50/40 dark:bg-blue-500/[0.03] hover:bg-blue-50/60 dark:hover:bg-blue-500/[0.05]' : 'hover:bg-slate-50/50 dark:hover:bg-white/[0.01]'}`}
                >
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300 shrink-0">
                    <Bell size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`text-sm text-slate-950 dark:text-white ${isUnread ? 'font-black' : 'font-bold'}`}>{item.title}</h3>
                      {isUnread && <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0" />}
                    </div>
                    <p className={`mt-1 text-xs ${isUnread ? 'text-slate-800 dark:text-slate-200 font-semibold' : 'text-slate-500 dark:text-slate-400 font-medium'}`}>{item.message}</p>
                  </div>
                  <span className={`text-[10px] font-bold whitespace-nowrap ${soft}`}>{dateStr}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

function DashboardByRoute({ pageKey }) {
  const pages = {
    messages: <MessagesPage />,
    timesheets: <TimesheetsPage />,
    performance: <PerformancePage />,
    salary: <SalaryPage />,
    expenses: <ExpensesPage />,
    announcements: <AnnouncementsPage />,
    meetings: <MeetingsPage />,
    notifications: <NotificationsPage />,
  };
  return pages[pageKey] || <EmptyState title="Workspace module ready" description="This employee portal module is ready for configuration." />;
}

const PlaceholderPage = ({ title, description }) => {
  const location = useLocation();
  const pageKey = useMemo(() => location.pathname.split('/').filter(Boolean).pop(), [location.pathname]);
  const meta = routeMeta[pageKey] || { title, description, eyebrow: 'Employee Workspace', icon: Sparkles };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="dash-page flex flex-col gap-6 text-slate-950 dark:text-slate-100">
      <PageHeader meta={meta} />
      <DashboardByRoute pageKey={pageKey} />
    </motion.div>
  );
};

export default PlaceholderPage;
export const EmployeeTasks = () => <PlaceholderPage title="My Tasks" description="A Kanban board or list view of your assigned tasks, subtasks, and deadlines." />;
export const EmployeeProjects = () => <PlaceholderPage title="My Projects" description="Detailed views and milestones for the projects you are currently a part of." />;
export const EmployeeProfile = () => <PlaceholderPage title="Employee Profile" description="Your personal information, HR documents, attendance record, and skills." />;
export const EmployeeSettings = () => <PlaceholderPage title="My Settings" description="Personal preferences, notification settings, and password management." />;
