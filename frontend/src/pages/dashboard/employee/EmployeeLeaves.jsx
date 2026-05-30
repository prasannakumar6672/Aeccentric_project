import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, CheckCircle, XCircle, Clock, Plus,
  Plane, Stethoscope, Baby, Briefcase, Zap,
  AlertCircle, Trash2, FileText, ChevronDown,
  Download, Eye, Users, Award, TrendingUp, BarChart2,
  BookOpen, HelpCircle, X, ShieldAlert, Check
} from 'lucide-react';
import api from '../../../services/api';
import { demoLeaves } from './employeeWorkspaceData';

/* ─── Animations ─── */
const fadeUp  = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };
const stagger = { animate: { transition: { staggerChildren: 0.08 } } };

/* ─── Config ─── */
const LEAVE_TYPES = [
  { value: 'sick',      label: 'Sick Leave',      icon: Stethoscope, color: '#ef4444' },
  { value: 'annual',    label: 'Annual Leave',     icon: Plane,       color: '#3b82f6' },
  { value: 'casual',    label: 'Casual Leave',     icon: Zap,         color: '#f59e0b' },
  { value: 'emergency', label: 'Emergency Leave',  icon: AlertCircle, color: '#f97316' },
  { value: 'maternity', label: 'Maternity Leave',  icon: Baby,        color: '#ec4899' },
  { value: 'paternity', label: 'Paternity Leave',  icon: Baby,        color: '#8b5cf6' },
  { value: 'unpaid',    label: 'Unpaid Leave',     icon: Briefcase,   color: '#64748b' },
];

const STATUS = {
  pending: { 
    label: 'Pending',  
    cls: 'inline-flex items-center justify-center h-6 px-3 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 dark:bg-amber-500/[0.08] text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-500/20' 
  },
  approved: { 
    label: 'Approved', 
    cls: 'inline-flex items-center justify-center h-6 px-3 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 dark:bg-emerald-500/[0.08] text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20' 
  },
  rejected: { 
    label: 'Rejected', 
    cls: 'inline-flex items-center justify-center h-6 px-3 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 dark:bg-rose-500/[0.08] text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-500/20' 
  },
};

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

/* ─── Shared UI Card ─── */
const PremiumCard = ({ children, className = '' }) => (
  <div className={`rounded-[20px] bg-white dark:bg-[#0d1526] border border-gray-150 dark:border-white/[0.07] shadow-[0_2px_8px_rgba(15,23,42,0.015),0_8px_24px_rgba(15,23,42,0.015)] p-6 ${className}`}>
    {children}
  </div>
);

/* ─── Circular SVG Balance Chart ─── */
const CircularBalance = ({ used, total }) => {
  const remaining = Math.max(0, total - used);
  const percent = total > 0 ? (remaining / total) * 100 : 0;
  const radius = 64;
  const circ = 2 * Math.PI * radius;
  const strokeDashoffset = circ - (percent / 100) * circ;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg className="w-44 h-44 transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx="88"
          cy="88"
          r={radius}
          className="stroke-slate-100 dark:stroke-white/[0.04]"
          strokeWidth="10"
          fill="transparent"
        />
        {/* Glowing Progress Circle */}
        <circle
          cx="88"
          cy="88"
          r={radius}
          className="stroke-blue-600 transition-all duration-500 ease-out"
          strokeWidth="12"
          strokeDasharray={circ}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          style={{ filter: 'drop-shadow(0px 2px 8px rgba(37, 99, 235, 0.2))' }}
        />
      </svg>
      {/* Absolute center details */}
      <div className="absolute text-center mt-[-2px]">
        <div className="text-4xl font-black text-slate-900 dark:text-white leading-none tracking-tight">
          {remaining}
        </div>
        <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1.5 leading-none">
          Days Available
        </div>
      </div>
    </div>
  );
};

/* ─── Interactive Policy Drawer/Modal ─── */
function PolicyModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-lg bg-white dark:bg-[#0d1526] rounded-2xl border border-gray-150 dark:border-white/[0.08] shadow-2xl p-6"
      >
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-white/[0.04]">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="text-blue-500" size={18} />
            Aeccentric Leave Policies
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-white/[0.04] cursor-pointer">
            <X size={18} />
          </button>
        </div>
        
        <div className="flex flex-col gap-4 mt-4 max-h-[400px] overflow-y-auto pr-1">
          <div className="p-3.5 bg-slate-50 dark:bg-white/[0.015] rounded-xl border border-slate-150/40 dark:border-white/[0.02]">
            <h4 className="text-xs font-black text-rose-500 uppercase tracking-wider">Sick Leave (12 Days / Yr)</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Provides 100% paid recovery time. Leaves extending beyond two consecutive days require a signed medical certificate submitted directly to HR.
            </p>
          </div>
          <div className="p-3.5 bg-slate-50 dark:bg-white/[0.015] rounded-xl border border-slate-150/40 dark:border-white/[0.02]">
            <h4 className="text-xs font-black text-amber-500 uppercase tracking-wider">Casual Leave (10 Days / Yr)</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Used for personal errands or unplanned responsibilities. Requires a minimum of 24 hours prior notification via the portal to ensure task coverage.
            </p>
          </div>
          <div className="p-3.5 bg-slate-50 dark:bg-white/[0.015] rounded-xl border border-slate-150/40 dark:border-white/[0.02]">
            <h4 className="text-xs font-black text-blue-500 uppercase tracking-wider">Earned Leave (15 Days / Yr)</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Paid planned vacation leaves. Accrues monthly. Must be submitted at least 7 calendar days in advance and coordinated with your Engineering or Team Lead.
            </p>
          </div>
          <div className="p-3.5 bg-slate-50 dark:bg-white/[0.015] rounded-xl border border-slate-150/40 dark:border-white/[0.02]">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider">Accrual & Carry Forward</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              A maximum of 10 unused Earned Leaves can be carried forward into the subsequent calendar year. Sick and Casual leaves will lapse automatically on Dec 31st.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Interactive Team Calendar Popup ─── */
function TeamCalendarModal({ onClose }) {
  const absences = [
    { name: 'Rahul Sharma', role: 'Engineering Lead', status: 'On Sick Leave', days: 'May 30 (Today)' },
    { name: 'Nisha Rao', role: 'QA Analyst', status: 'On Casual Leave', days: 'May 31 - Jun 1' },
    { name: 'Aditi Menon', role: 'HR Partner', status: 'On Earned Leave', days: 'Jun 4 - Jun 8' },
  ];

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
            <Users className="text-blue-500" size={18} />
            Teammate Absence Calendar
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-white/[0.04] cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {absences.map((a, i) => (
            <div key={i} className="flex justify-between items-center p-3.5 bg-slate-50 dark:bg-white/[0.015] rounded-xl border border-slate-150/50 dark:border-white/[0.03]">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-none">{a.name}</h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">{a.role}</p>
              </div>
              <div className="text-right">
                <span className="inline-block text-[9.5px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 leading-none bg-blue-50 dark:bg-blue-500/[0.06] px-2 py-1 rounded">
                  {a.status}
                </span>
                <p className="text-[9.5px] text-slate-400 dark:text-slate-500 mt-1.5 leading-none">{a.days}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Apply Leave Modal ─── */
function ApplyModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ type: 'annual', startDate: '', endDate: '', reason: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.startDate || !form.endDate) { setError('Please fill in all dates.'); return; }
    if (new Date(form.endDate) < new Date(form.startDate)) { setError('End date cannot be before start date.'); return; }
    setLoading(true);
    setError('');
    try {
      await api.post('/leaves', form);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit leave.');
    } finally {
      setLoading(false);
    }
  };

  const inp = 'w-full text-[13px] px-3.5 py-3 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.03] text-gray-900 dark:text-slate-200 focus:outline-none focus:border-blue-500 transition-colors';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.22 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-[#0d1526] rounded-2xl border border-gray-150 dark:border-white/[0.08] shadow-2xl p-6"
      >
        <h2 className="text-lg font-black text-gray-900 dark:text-white mb-1">Apply for Leave</h2>
        <p className="text-xs text-gray-400 dark:text-slate-500 mb-5">Fill in the details to submit your leave request.</p>

        {error && (
          <div className="mb-4 px-3.5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-500/[0.1] border border-rose-100 dark:border-rose-500/20 text-rose-600 dark:text-rose-455 text-[12px] flex items-center gap-2 font-semibold">
            <AlertCircle size={14} className="shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={submit} className="flex flex-col gap-4">
          {/* Type */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Leave Type</label>
            <div className="relative">
              <select value={form.type} onChange={e => set('type', e.target.value)} className={inp + ' appearance-none pr-8 cursor-pointer'}>
                {LEAVE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3.5 top-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Start Date</label>
              <input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} className={inp} required />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">End Date</label>
              <input type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)} className={inp} required />
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Reason <span className="text-gray-300 dark:text-slate-600">(optional)</span></label>
            <textarea value={form.reason} onChange={e => set('reason', e.target.value)} rows={3}
              placeholder="Brief description of your leave reason..."
              className={inp + ' resize-none'} />
          </div>

          <div className="flex gap-2.5 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-white/[0.08] text-[13px] font-bold text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold transition-all disabled:opacity-60 cursor-pointer shadow-sm shadow-blue-500/10 active:scale-[0.98]">
              {loading ? 'Submitting…' : 'Submit Request'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN PAGE Component
   ═══════════════════════════════════════════════ */
export default function EmployeeLeaves() {
  const [leaves, setLeaves]   = useState([]);
  const [stats, setStats]     = useState({ total: 0, pending: 0, approved: 0, rejected: 0, totalDays: 0 });
  const [filter, setFilter]   = useState('all');
  const [loading, setLoading] = useState(true);
  
  /* Modals */
  const [showModal, setShowModal] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
  const [showTeamCalendar, setShowTeamCalendar] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  
  const [cancelling, setCancelling] = useState(null);

  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/leaves/my');
      if (res.data.success) {
        const rows = res.data.leaves?.length ? res.data.leaves : demoLeaves;
        setLeaves(rows);
        setStats(res.data.leaves?.length ? res.data.stats : {
          total: rows.length,
          pending: rows.filter(l => l.status === 'pending').length,
          approved: rows.filter(l => l.status === 'approved').length,
          rejected: rows.filter(l => l.status === 'rejected').length,
          totalDays: rows.filter(l => l.status === 'approved').reduce((s, l) => s + (l.days || 0), 0),
        });
      }
    } catch (e) {
      console.error(e);
      setLeaves(demoLeaves);
      setStats({
        total: demoLeaves.length,
        pending: demoLeaves.filter(l => l.status === 'pending').length,
        approved: demoLeaves.filter(l => l.status === 'approved').length,
        rejected: demoLeaves.filter(l => l.status === 'rejected').length,
        totalDays: demoLeaves.filter(l => l.status === 'approved').reduce((s, l) => s + (l.days || 0), 0),
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLeaves(); }, [fetchLeaves]);

  const handleCancel = async (id) => {
    setCancelling(id);
    try {
      if (String(id).startsWith('demo-')) {
        setLeaves(prev => prev.filter(leave => leave._id !== id));
        return;
      }
      await api.delete(`/leaves/${id}`);
      fetchLeaves();
    } catch (e) {
      console.error(e);
    } finally {
      setCancelling(null);
    }
  };

  const downloadReport = () => {
    setAlertMessage("Generating CSV leave statement... Download started!");
    setTimeout(() => setAlertMessage(null), 4000);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Leave Type,Start Date,End Date,Days,Status,Reason\n"
      + leaves.map(l => `${l.type},${l.startDate},${l.endDate},${l.days},${l.status},"${l.reason || ''}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `leave_report_${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const scrollHistory = () => {
    const el = document.getElementById('leave-history-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  /* Calculated metrics based on active list */
  const approvedSick = leaves.filter(l => l.status === 'approved' && l.type === 'sick').reduce((s, l) => s + (l.days || 0), 0);
  const approvedCasual = leaves.filter(l => l.status === 'approved' && l.type === 'casual').reduce((s, l) => s + (l.days || 0), 0);
  const approvedEarned = leaves.filter(l => l.status === 'approved' && ['annual', 'earned'].includes(l.type)).reduce((s, l) => s + (l.days || 0), 0);

  const sickLeft = Math.max(0, 12 - approvedSick);
  const casualLeft = Math.max(0, 10 - approvedCasual);
  const earnedLeft = Math.max(0, 15 - approvedEarned);
  const totalLeft = sickLeft + casualLeft + earnedLeft;
  const totalEntitled = 12 + 10 + 15;
  const totalUsed = totalEntitled - totalLeft;

  const displayed = filter === 'all' ? leaves : leaves.filter(l => l.status === filter);

  return (
    <>
      <AnimatePresence>
        {showModal && (
          <ApplyModal onClose={() => setShowModal(false)} onSuccess={() => { setShowModal(false); fetchLeaves(); }} />
        )}
        {showPolicy && (
          <PolicyModal onClose={() => setShowPolicy(false)} />
        )}
        {showTeamCalendar && (
          <TeamCalendarModal onClose={() => setShowTeamCalendar(false)} />
        )}
      </AnimatePresence>

      {/* Floating Statement Toast Alert */}
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

      <motion.div variants={stagger} initial="initial" animate="animate"
        className="dash-page flex flex-col gap-8 text-gray-900 dark:text-slate-100 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">

        {/* Page Header */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2 border-b border-slate-100 dark:border-white/[0.04]">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1.5">Employee HR Suite</p>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-none">Leave Center</h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-450 mt-2.5 font-semibold">Coordinate vacation balance, review teammate schedules, and log leaves.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
            <button onClick={() => setShowPolicy(true)}
              className="flex items-center justify-center gap-2 px-4.5 rounded-xl border border-slate-200 dark:border-white/[0.08] hover:bg-slate-50 dark:hover:bg-white/[0.04] text-slate-650 dark:text-slate-350 text-[13px] font-bold transition-all h-11 w-full sm:w-auto cursor-pointer">
              <BookOpen size={15} />
              Policy
            </button>
            <button onClick={() => setShowModal(true)}
              className="flex items-center justify-center gap-2 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold transition-all shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.98] h-11 w-full sm:w-auto cursor-pointer">
              <Plus size={16} />
              Request Leave
            </button>
          </div>
        </motion.div>

        {/* Grid System Layout: Left Main Column (Span 8), Right Side Column (Span 4) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
          
          {/* LEFT COLUMN: Overviews and History Timeline */}
          <div className="lg:col-span-8 flex flex-col gap-8 w-full min-w-0">
            
            {/* SECTION 1 — HERO LEAVE OVERVIEW */}
            <div className="flex flex-col gap-3.5">
              <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Hero Leave Balances</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
                
                {/* Balance Card: Sick Leave */}
                <div className="rounded-xl bg-white dark:bg-[#0d1526] border border-slate-150 dark:border-white/[0.08] p-5 hover:border-rose-500/30 dark:hover:border-rose-500/30 hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between min-h-[145px] shadow-[0_1px_3px_rgba(15,23,42,0.015),0_4px_12px_rgba(15,23,42,0.015)]"
                  style={{ borderLeft: '4.5px solid #ef4444' }}>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10.5px] font-extrabold uppercase text-slate-500 dark:text-slate-350 tracking-wider">Sick Leave</span>
                      <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 shrink-0">
                        <Stethoscope size={13} />
                      </div>
                    </div>
                    <div className="text-3xl font-black text-slate-900 dark:text-white mt-3 leading-none tracking-tight">
                      {sickLeft}
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 font-bold leading-none">
                      Out of 12 days entitled
                    </p>
                  </div>
                  <div className="flex items-center gap-1 mt-4 text-[9.5px] font-bold text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-white/[0.05] pt-2.5 w-full truncate leading-none">
                    <TrendingUp size={10} className="text-emerald-500 shrink-0" />
                    <span>Used {approvedSick} day{approvedSick === 1 ? '' : 's'} this year</span>
                  </div>
                </div>

                {/* Balance Card: Casual Leave */}
                <div className="rounded-xl bg-white dark:bg-[#0d1526] border border-slate-150 dark:border-white/[0.08] p-5 hover:border-amber-500/30 dark:hover:border-amber-500/30 hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between min-h-[145px] shadow-[0_1px_3px_rgba(15,23,42,0.015),0_4px_12px_rgba(15,23,42,0.015)]"
                  style={{ borderLeft: '4.5px solid #f59e0b' }}>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10.5px] font-extrabold uppercase text-slate-500 dark:text-slate-350 tracking-wider">Casual Leave</span>
                      <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 shrink-0">
                        <Zap size={13} />
                      </div>
                    </div>
                    <div className="text-3xl font-black text-slate-900 dark:text-white mt-3 leading-none tracking-tight">
                      {casualLeft}
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 font-bold leading-none">
                      Out of 10 days entitled
                    </p>
                  </div>
                  <div className="flex items-center gap-1 mt-4 text-[9.5px] font-bold text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-white/[0.05] pt-2.5 w-full truncate leading-none">
                    <TrendingUp size={10} className="text-emerald-500 shrink-0" />
                    <span>Used {approvedCasual} day{approvedCasual === 1 ? '' : 's'} this year</span>
                  </div>
                </div>

                {/* Balance Card: Earned Leave */}
                <div className="rounded-xl bg-white dark:bg-[#0d1526] border border-slate-150 dark:border-white/[0.08] p-5 hover:border-blue-500/30 dark:hover:border-blue-500/30 hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between min-h-[145px] shadow-[0_1px_3px_rgba(15,23,42,0.015),0_4px_12px_rgba(15,23,42,0.015)]"
                  style={{ borderLeft: '4.5px solid #3b82f6' }}>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10.5px] font-extrabold uppercase text-slate-500 dark:text-slate-350 tracking-wider">Earned Leave</span>
                      <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500 shrink-0">
                        <Plane size={13} />
                      </div>
                    </div>
                    <div className="text-3xl font-black text-slate-900 dark:text-white mt-3 leading-none tracking-tight">
                      {earnedLeft}
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 font-bold leading-none">
                      Out of 15 days entitled
                    </p>
                  </div>
                  <div className="flex items-center gap-1 mt-4 text-[9.5px] font-bold text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-white/[0.05] pt-2.5 w-full truncate leading-none">
                    <TrendingUp size={10} className="text-emerald-500 shrink-0" />
                    <span>Used {approvedEarned} day{approvedEarned === 1 ? '' : 's'} this year</span>
                  </div>
                </div>

                {/* Balance Card: Pending */}
                <div className="rounded-xl bg-white dark:bg-[#0d1526] border border-slate-150 dark:border-white/[0.08] p-5 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between min-h-[145px] shadow-[0_1px_3px_rgba(15,23,42,0.015),0_4px_12px_rgba(15,23,42,0.015)]"
                  style={{ borderLeft: '4.5px solid #8b5cf6' }}>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10.5px] font-extrabold uppercase text-slate-500 dark:text-slate-350 tracking-wider">Pending</span>
                      <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500 shrink-0">
                        <Clock size={13} />
                      </div>
                    </div>
                    <div className="text-3xl font-black text-slate-900 dark:text-white mt-3 leading-none tracking-tight">
                      {stats.pending}
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 font-bold leading-none">
                      Awaiting review
                    </p>
                  </div>
                  <div className="flex items-center gap-1 mt-4 text-[9.5px] font-bold text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-white/[0.05] pt-2.5 w-full truncate leading-none">
                    <AlertCircle size={10} className="text-amber-500 shrink-0" />
                    <span>Submissions locked active</span>
                  </div>
                </div>

              </div>
            </div>

            {/* SECTION 2 — TIMELINE & REQUEST FILTER SYSTEM */}
            <div id="leave-history-section" className="flex flex-col gap-4 mt-2">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Leave Request Timeline</h3>
                
                {/* Pills with animated borders */}
                <div className="flex flex-wrap items-center gap-2">
                  {['all', 'pending', 'approved', 'rejected'].map(f => {
                    const isActive = filter === f;
                    return (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`h-8 px-4 rounded-full text-[11px] font-bold transition-all duration-300 border flex items-center justify-center gap-1.5 cursor-pointer leading-none ${
                          isActive
                            ? 'bg-blue-600 border-blue-600 text-white shadow shadow-blue-500/10'
                            : 'bg-white dark:bg-[#0d1526] border-slate-200 dark:border-white/[0.06] text-slate-655 dark:text-slate-450 hover:border-slate-300 dark:hover:border-white/[0.12] hover:bg-slate-50 dark:hover:bg-white/[0.02]'
                        }`}
                      >
                        <span className="capitalize">{f}</span>
                        <span className={`text-[9.5px] px-1.5 py-0.5 rounded-full font-black leading-none ${
                          isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-white/[0.05] text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-white/[0.02]'
                        }`}>
                          {f === 'all' ? stats.total : stats[f]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* TIMELINE HISTORY LIST */}
              <div className="relative border-l border-slate-150 dark:border-white/[0.05] pl-6 ml-3.5 space-y-6 pt-1">
                <AnimatePresence>
                  {loading ? (
                    [...Array(2)].map((_, i) => (
                      <div key={i} className="relative">
                        <div className="absolute -left-[30px] top-1 w-3 h-3 rounded-full bg-slate-200 dark:bg-white/[0.08]" />
                        <PremiumCard className="animate-pulse">
                          <div className="h-4 bg-gray-150 dark:bg-white/[0.05] rounded w-1/3 mb-3" />
                          <div className="h-3 bg-gray-150 dark:bg-white/[0.05] rounded w-1/2" />
                        </PremiumCard>
                      </div>
                    ))
                  ) : displayed.length === 0 ? (
                    <motion.div variants={fadeUp} className="relative">
                      <div className="absolute -left-[30px] top-1 w-3 h-3 rounded-full bg-blue-500" />
                      <PremiumCard className="p-8 text-center flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                          <Calendar size={22} className="text-blue-500" />
                        </div>
                        <p className="font-bold text-slate-700 dark:text-slate-350 text-sm">No leave records timeline</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs leading-relaxed">No leave events mapped under active filter "{filter}" criteria.</p>
                      </PremiumCard>
                    </motion.div>
                  ) : (
                    displayed.map(leave => {
                      const typeCfg = LEAVE_TYPES.find(t => t.value === leave.type) || LEAVE_TYPES[0];
                      const Icon    = typeCfg.icon;
                      const sc      = STATUS[leave.status] || STATUS.pending;

                      return (
                        <motion.div key={leave._id} variants={fadeUp} className="relative"
                          exit={{ opacity: 0, height: 0, marginBottom: 0 }} layout>
                          
                          {/* Left Timeline Indicator bullet */}
                          <div className="absolute -left-[31.5px] top-4 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#0f172a] shadow-sm z-10" 
                            style={{ backgroundColor: typeCfg.color }} />

                          <PremiumCard className="hover:border-slate-300 dark:hover:border-white/[0.12] hover:shadow-[0_4px_16px_rgba(15,23,42,0.02)] transition-all duration-300">
                            <div className="flex flex-col gap-4">
                              
                              {/* Row 1: Leave Type (Left), Status Badge (Middle), Actions (Right) */}
                              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-white/[0.04] pb-3.5">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-slate-200/20 shadow-sm"
                                    style={{ background: typeCfg.color + '14' }}>
                                    <Icon size={16} style={{ color: typeCfg.color }} />
                                  </div>
                                  <span className="text-sm font-black text-slate-900 dark:text-white leading-none">
                                    {typeCfg.label}
                                  </span>
                                </div>
                                
                                <div className="flex items-center gap-3.5">
                                  <span className={sc.cls}>
                                    {sc.label}
                                  </span>
                                  
                                  {leave.status === 'pending' && (
                                    <button
                                      onClick={() => handleCancel(leave._id)}
                                      disabled={cancelling === leave._id}
                                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold text-rose-600 dark:text-rose-455 bg-rose-50 dark:bg-rose-500/[0.08] hover:bg-rose-100 dark:hover:bg-rose-500/[0.15] transition-colors disabled:opacity-50 shrink-0 cursor-pointer h-7 border border-rose-250/20 dark:border-rose-500/20">
                                      <Trash2 size={11} />
                                      <span>Cancel</span>
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Row 2: Date Range & Duration */}
                              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-655 dark:text-slate-400 bg-slate-50 dark:bg-white/[0.015] rounded-xl px-4 py-3 border border-slate-150/40 dark:border-white/[0.02] w-fit">
                                <div className="flex items-center gap-2">
                                  <Calendar size={13} className="text-slate-400 dark:text-slate-500" />
                                  <span className="text-slate-900 dark:text-slate-250 font-bold">
                                    {fmtDate(leave.startDate)}{leave.days > 1 ? ` → ${fmtDate(leave.endDate)}` : ''}
                                  </span>
                                </div>
                                <span className="text-slate-300 dark:text-white/[0.08]">·</span>
                                <div className="flex items-center gap-1.5">
                                  <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-500/[0.08] text-blue-700 dark:text-blue-400 text-[10px] font-black uppercase">
                                    {leave.days} day{leave.days > 1 ? 's' : ''}
                                  </span>
                                </div>
                              </div>
                              
                              {/* Row 3: Reason */}
                              {leave.reason && (
                                <div className="bg-slate-50/50 dark:bg-white/[0.01] border border-slate-200/40 dark:border-white/[0.04] p-4 rounded-xl text-slate-700 dark:text-slate-350 leading-relaxed text-xs">
                                  <span className="block text-[9px] uppercase font-black text-slate-450 dark:text-slate-555 tracking-widest mb-1 leading-none">Employee Reason</span>
                                  <p className="whitespace-pre-wrap leading-relaxed mt-1">"{leave.reason}"</p>
                                </div>
                              )}
                              
                              {/* Row 4: HR Notes */}
                              {leave.reviewNote && (
                                <div className="bg-blue-50/50 dark:bg-blue-500/[0.03] border border-blue-500/10 p-4 rounded-xl text-blue-800 dark:text-blue-200 leading-relaxed text-xs">
                                  <span className="block text-[9px] uppercase font-black text-blue-600/70 dark:text-blue-400/60 tracking-widest mb-1 leading-none">HR Note Response</span>
                                  <p className="whitespace-pre-wrap leading-relaxed mt-1">{leave.reviewNote}</p>
                                </div>
                              )}
                              
                            </div>
                          </PremiumCard>
                        </motion.div>
                      );
                    })
                  )}
                </AnimatePresence>
              </div>

            </div>

          </div>

          {/* RIGHT COLUMN: Donut Chart and Quick Actions sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-8 w-full min-w-0">
            
            {/* SECTION 3 — LEAVE BALANCE VISUALIZATION */}
            <div className="flex flex-col gap-3.5">
              <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Balance Visualization</h3>
              <PremiumCard className="flex flex-col items-center">
                <CircularBalance used={totalUsed} total={totalEntitled} />
                
                <div className="w-full mt-6 space-y-3 pt-4 border-t border-slate-100 dark:border-white/[0.04]">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-400">Total Leaves Entitled</span>
                    <span className="text-slate-900 dark:text-white font-extrabold">{totalEntitled} Days</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-400">Total Leaves Approved</span>
                    <span className="text-slate-900 dark:text-white font-extrabold">{totalUsed} Days</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-white/[0.04] rounded-full overflow-hidden mt-1 flex">
                    <div className="bg-rose-500 h-full" style={{ width: `${(approvedSick / totalEntitled) * 100}%` }} />
                    <div className="bg-amber-500 h-full" style={{ width: `${(approvedCasual / totalEntitled) * 100}%` }} />
                    <div className="bg-blue-500 h-full" style={{ width: `${(approvedEarned / totalEntitled) * 100}%` }} />
                  </div>
                  <div className="flex justify-between gap-1 flex-wrap text-[10px] pt-1">
                    <span className="flex items-center gap-1 font-bold text-slate-500"><span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Sick: {approvedSick}d</span>
                    <span className="flex items-center gap-1 font-bold text-slate-500"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Casual: {approvedCasual}d</span>
                    <span className="flex items-center gap-1 font-bold text-slate-500"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Earned: {approvedEarned}d</span>
                  </div>
                </div>
              </PremiumCard>
            </div>

            {/* QUICK ACTIONS SIDEBAR CARD */}
            <div className="flex flex-col gap-3.5">
              <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Quick Actions</h3>
              <PremiumCard className="grid grid-cols-2 gap-3 p-4">
                
                <button onClick={() => setShowModal(true)}
                  className="flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-white/[0.015] border border-slate-150 dark:border-white/[0.04] rounded-xl hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-500/[0.03] text-center gap-1.5 group transition-all cursor-pointer h-[80px]">
                  <Plus size={14} className="text-blue-500 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-350 leading-tight">New Request</span>
                </button>

                <button onClick={downloadReport}
                  className="flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-white/[0.015] border border-slate-150 dark:border-white/[0.04] rounded-xl hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-500/[0.03] text-center gap-1.5 group transition-all cursor-pointer h-[80px]">
                  <Download size={14} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-350 leading-tight">Download CSV</span>
                </button>

                <button onClick={() => setShowPolicy(true)}
                  className="flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-white/[0.015] border border-slate-150 dark:border-white/[0.04] rounded-xl hover:border-amber-500 dark:hover:border-amber-500 hover:bg-amber-500/[0.03] text-center gap-1.5 group transition-all cursor-pointer h-[80px]">
                  <BookOpen size={14} className="text-amber-500 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-350 leading-tight">View Policy</span>
                </button>

                <button onClick={() => setShowTeamCalendar(true)}
                  className="flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-white/[0.015] border border-slate-150 dark:border-white/[0.04] rounded-xl hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-500/[0.03] text-center gap-1.5 group transition-all cursor-pointer h-[80px]">
                  <Users size={14} className="text-indigo-500 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-350 leading-tight">Team Calendar</span>
                </button>

                <button onClick={scrollHistory}
                  className="flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-white/[0.015] border border-slate-150 dark:border-white/[0.04] rounded-xl hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-500/[0.03] text-center gap-1.5 group transition-all cursor-pointer h-[80px] col-span-2">
                  <Clock size={14} className="text-purple-500 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-350 leading-tight">Scroll History</span>
                </button>

              </PremiumCard>
            </div>

          </div>

        </div>
      </motion.div>
    </>
  );
}
