import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Users, DollarSign, TrendingUp, TrendingDown,
  Plus, Calendar, Clock, CheckCircle, XCircle,
  Landmark, UserCheck, Sparkles, ArrowUpRight,
  Activity, FolderKanban, Building, FolderOpen,
  Filter, MoreHorizontal
} from 'lucide-react';
import api from '../../../services/api';
import { useTheme } from '../../../context/ThemeContext';

/* ─── ANIMATION VARIANTS ─────────────────────────────────────── */
const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] } },
};
const stagger = { animate: { transition: { staggerChildren: 0.06 } } };

/* ─── COUNT-UP ANIMATION COMPONENT ───────────────────────────── */
const CountUpNumber = ({ value, duration = 1200, format }) => {
  const [displayVal, setDisplayVal] = useState(0);

  useEffect(() => {
    let start = null;
    const target = Number(value) || 0;
    if (target === 0) {
      setDisplayVal(0);
      return;
    }
    let animationFrameId;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplayVal(Math.floor(easedProgress * target));
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };
    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [value, duration]);

  if (format === 'currency') {
    return <span>₹{displayVal.toLocaleString('en-IN')}</span>;
  }
  if (format === 'percent') {
    return <span>{displayVal}%</span>;
  }
  return <span>{displayVal.toLocaleString()}</span>;
};

/* ─── INLINE SVG SPARKLINE ───────────────────────────────────── */
const Sparkline = ({ data, color }) => {
  if (!data || data.length === 0) return null;
  const width = 120;
  const height = 30;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height - 2; // offset border safety
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg className="kpi-sparkline" viewBox={`0 0 ${width} ${height}`} width="100%" height="30">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        points={points}
      />
    </svg>
  );
};

/* ─── REDESIGNED KPI CARD ────────────────────────────────────── */
const KPICard = ({ label, value, trend, trendLabel, icon: Icon, color, loading, sparkData, secondaryMetric }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const colors = {
    blue:   { bg: 'rgba(26, 86, 219, 0.08)',   text: 'text-blue-600 dark:text-blue-400',   accent: isDark ? '#3B82F6' : '#1A56DB' },
    emerald:{ bg: 'rgba(14, 159, 110, 0.08)', text: 'text-emerald-600 dark:text-emerald-450', accent: isDark ? '#10B981' : '#0E9F6E' },
    amber:  { bg: 'rgba(245, 158, 11, 0.08)',  text: 'text-amber-600 dark:text-amber-455',  accent: '#F59E0B' },
    purple: { bg: 'rgba(124, 58, 237, 0.08)', text: 'text-purple-600 dark:text-purple-400', accent: isDark ? '#A78BFA' : '#7C3AED' },
    teal:   { bg: 'rgba(13, 148, 136, 0.08)',   text: 'text-teal-650 dark:text-teal-400',   accent: isDark ? '#14B8A6' : '#0D9488' },
  };
  const c = colors[color] || colors.blue;

  return (
    <motion.div variants={fadeUp} className="kpi-card">
      <div className="flex items-start justify-between">
        <span className="kpi-label">{label}</span>
        <div className="kpi-icon" style={{ backgroundColor: c.bg }}>
          <Icon size={15} className={c.text} />
        </div>
      </div>

      <div className="kpi-number">
        {loading ? (
          <span className="inline-block w-20 h-8 bg-gray-100 dark:bg-white/[0.08] rounded animate-pulse" />
        ) : (
          <CountUpNumber 
            value={value} 
            format={
              label.toUpperCase().includes('PAYROLL') || 
              label.toUpperCase().includes('BUDGET') || 
              label.toUpperCase().includes('HEALTH') 
                ? 'currency' 
                : 'integer'
            } 
          />
        )}
      </div>

      {trendLabel && (
        <div className={`kpi-trend mt-1 ${trend === 'up' ? 'up' : trend === 'down' ? 'down' : 'flat'}`}>
          {trend === 'up' && <TrendingUp size={12} />}
          {trend === 'down' && <TrendingDown size={12} />}
          {!['up', 'down'].includes(trend) && <Activity size={12} />}
          <span>{trendLabel}</span>
        </div>
      )}

      {sparkData && <Sparkline data={sparkData} color={c.accent} />}
      
      {secondaryMetric && (
        <span className="kpi-secondary">{secondaryMetric}</span>
      )}
    </motion.div>
  );
};

/* ─── STATUS PILL ─────────────────────────────────────────────── */
const StatusPill = ({ status }) => {
  const map = {
    active:   'chip chip-success',
    on_leave: 'chip chip-warning',
    inactive: 'chip chip-neutral',
  };
  const labels = { active: 'Active', on_leave: 'On Leave', inactive: 'Inactive' };
  return <span className={map[status] || 'chip chip-neutral'}>{labels[status] || status}</span>;
};

/* ─── APPLICANT STATUS PILL ───────────────────────────────────── */
const ApplicantPill = ({ status }) => {
  const map = {
    Applied:      'chip chip-info',
    Interviewing: 'chip chip-warning',
    Offered:      'chip chip-purple',
    Hired:        'chip chip-success',
    Rejected:     'chip chip-danger',
  };
  return <span className={map[status] || 'chip chip-neutral'}>{status}</span>;
};

/* ─── DEPT DOT ────────────────────────────────────────────────── */
const deptDot = {
  Engineering: '#1A56DB', HR: '#7C3AED', Finance: '#B45309',
  Marketing: '#DB2777', Operations: '#0E9F6E', General: '#9CA3AF',
};
const deptLabel = {
  Engineering: 'text-blue-600 dark:text-blue-400',
  HR:          'text-purple-600 dark:text-purple-400',
  Finance:     'text-amber-700 dark:text-amber-500',
  Marketing:   'text-pink-600 dark:text-pink-400',
  Operations:  'text-emerald-600 dark:text-emerald-400',
  General:     'text-gray-500 dark:text-slate-500',
};

/* ═══════════════════════════════════════════════════════════════
   MAIN ADMIN DASHBOARD
   ═══════════════════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);

  const [overview, setOverview] = useState({
    total: 248, active: 236, onLeave: 12, departmentCount: 6,
    newHiresThisMonth: 8, growthRate: 14.5,
  });

  const [recentEmployees, setRecentEmployees] = useState([]);

  const [payroll, setPayroll] = useState({
    monthlyBudget: 950000, avgSalary: 173077,
    nextPayday: 'May 31, 2026', growth: 2.4,
    paymentStatus: [
      { name: 'Processed', value: 85, color: '#0E9F6E' },
      { name: 'Processing', value: 15, color: '#3B82F6' },
    ],
  });

  const [leaveRequests, setLeaveRequests] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [meetingForm, setMeetingForm]       = useState({ title: '', startTime: '', endTime: '', type: '' });
  const [showMeetingForm, setShowMeetingForm] = useState(false);

  const [applicants, setApplicants] = useState([]);
  const [newApplicant, setNewApplicant]         = useState({ name: '', role: '' });
  const [showAddApplicant, setShowAddApplicant] = useState(false);
  const [activities, setActivities] = useState([]);

  /* Interactive States */
  const [leaveFilter, setLeaveFilter] = useState('Pending');
  const [selectedDept, setSelectedDept] = useState('All');

  const MOCK_EMPLOYEES = [
    { _id: 'seed-1', fullName: 'David Patel',     department: 'Engineering', designation: 'Senior Developer',  status: 'active',   joiningDate: '2025-10-15' },
    { _id: 'seed-2', fullName: 'Elena Rostova',   department: 'Operations',  designation: 'Operations Director', status: 'active',   joiningDate: '2026-02-10' },
  ];

  /* ─── API FETCH ───────────────────────────────────────────── */
  const fetchData = async () => {
    try {
      setLoading(true);
      const overviewRes = await api.get('/dashboard/admin-overview');
      if (overviewRes.data?.success) {
        const d = overviewRes.data;
        setOverview(d.overview);
        setLeaveRequests(d.leaveRequests);
        setMeetings(d.meetings);
        setApplicants(d.applicants);
        setActivities(d.activities);
        setPayroll(d.payroll);
      }
      const empRes = await api.get('/employees?limit=6');
      setRecentEmployees(empRes.data?.employees?.length ? empRes.data.employees : MOCK_EMPLOYEES);
    } catch (err) {
      console.error('Error fetching admin dashboard overview:', err);
      setRecentEmployees(MOCK_EMPLOYEES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ─── HANDLERS ────────────────────────────────────────────── */
  const handleLeaveAction = async (id, action) => {
    try {
      await api.patch(`/leaves/${id}/review`, { action: action === 'Approve' ? 'approve' : 'reject' });
      fetchData();
    } catch (err) {
      console.error('Error reviewing leave:', err);
    }
  };

  const convertTo24Hour = (timeStr) => {
    if (!timeStr) return '09:00';
    const cleanTime = timeStr.trim();
    const modifier = cleanTime.slice(-2).toUpperCase();
    let time = cleanTime.slice(0, -2).trim();
    let [hours, minutes] = time.split(':');
    if (!minutes) minutes = '00';
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    return `${String(hours).padStart(2, '0')}:${minutes}`;
  };

  const handleAddMeeting = async (e) => {
    e.preventDefault();
    if (!meetingForm.title || !meetingForm.startTime || !meetingForm.endTime) return;
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const startDateTime = new Date(`${todayStr}T${meetingForm.startTime}:00`);
      const endDateTime = new Date(`${todayStr}T${meetingForm.endTime}:00`);
      
      // Calculate duration dynamically for display
      const diffMs = endDateTime - startDateTime;
      let durationStr = '30 mins';
      if (diffMs > 0) {
        const diffMins = Math.round(diffMs / 60000);
        if (diffMins >= 60) {
          const hours = Math.floor(diffMins / 60);
          const mins = diffMins % 60;
          durationStr = mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
        } else {
          durationStr = `${diffMins} mins`;
        }
      }
      
      await api.post('/meetings', {
        title: meetingForm.title,
        startTime: startDateTime,
        endTime: endDateTime,
        duration: durationStr,
        type: meetingForm.type || 'Online'
      });
      setMeetingForm({ title: '', startTime: '', endTime: '', type: '' });
      setShowMeetingForm(false);
      fetchData();
    } catch (err) {
      console.error('Error adding meeting:', err);
    }
  };

  const handleApplicantStatus = async (id, newStatus) => {
    try {
      await api.patch(`/candidates/${id}/status`, { status: newStatus });
      fetchData();
    } catch (err) {
      console.error('Error updating candidate status:', err);
    }
  };

  const handleAddApplicant = async (e) => {
    e.preventDefault();
    if (!newApplicant.name || !newApplicant.role) return;
    try {
      await api.post('/candidates', {
        name: newApplicant.name,
        role: newApplicant.role
      });
      setNewApplicant({ name: '', role: '' });
      setShowAddApplicant(false);
      fetchData();
    } catch (err) {
      console.error('Error adding applicant:', err);
    }
  };

  /* Filter items in memory */
  const filteredLeaves = leaveRequests.filter(req => {
    if (leaveFilter === 'All') return true;
    return req.status?.toLowerCase() === leaveFilter.toLowerCase() || 
           (!req.status && leaveFilter === 'Pending'); // default fallback
  });

  const filteredEmployees = selectedDept === 'All'
    ? recentEmployees
    : recentEmployees.filter(emp => emp.department === selectedDept);

  const inputCls = 'w-full text-sm px-4 h-11 rounded-xl bg-[var(--surface-L2)] border border-[var(--border-default)] text-gray-950 dark:text-slate-100 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500/80 transition-all';

  return (
    <motion.div
      variants={stagger}
      initial="initial"
      animate="animate"
      className="flex flex-col gap-6 md:gap-8 text-gray-900 dark:text-slate-100"
    >
      {/* ── SECTION 1: PAGE HEADER ── */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold tracking-wider text-gray-400 dark:text-slate-500 uppercase">AECCENTRIC EMS</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/[0.1] border border-blue-100 dark:border-blue-500/20 text-[10px] font-bold text-blue-600 dark:text-blue-400">
              <Sparkles size={9} />
              Command Center
            </span>
          </div>
          <h1 className="text-[32px] font-bold tracking-tight text-gray-950 dark:text-white leading-none">
            Admin Command Center
          </h1>
          <p className="text-[13px] text-gray-500 dark:text-slate-405 mt-2 font-normal">
            Real-time workforce metrics, payroll budget tracker, live activities, and organization recruitment.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setShowMeetingForm(true)}
            className="flex items-center gap-1.5 px-4 h-10 rounded-xl bg-[var(--surface-L1)] border border-[var(--border-default)] text-gray-700 dark:text-slate-300 font-semibold text-[12px] hover:bg-[var(--surface-L2)] transition-colors cursor-pointer"
          >
            <Calendar size={13} />
            Schedule
          </button>
          <Link
            to="/dashboard/admin/employees/create"
            className="flex items-center gap-1.5 px-4 h-10 rounded-xl bg-blue-600 text-white font-semibold text-[12px] hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/10 shrink-0"
          >
            <Plus size={13} />
            Onboard Employee
          </Link>
        </div>
      </motion.div>

      {/* ── ZONE 1: KPI STRIP (6 Cards, 2-col each) ── */}
      <div>
        <div className="zone-label mb-3">Zone 1: Executive Key Metrics</div>
        <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <KPICard
            label="Total Headcount"
            value={overview.total}
            trend="up"
            trendLabel={`+${overview.growthRate || 14.5}% MoM`}
            icon={Users}
            color="blue"
            loading={loading}
            sparkData={[180, 195, 205, 212, 220, 235, 242, 248]}
            secondaryMetric="Across 6 departments"
          />
          <KPICard
            label="Active Employees"
            value={overview.active}
            trend="neutral"
            trendLabel="In office or remote"
            icon={UserCheck}
            color="emerald"
            loading={loading}
            sparkData={[170, 185, 195, 202, 210, 224, 230, 236]}
            secondaryMetric={`${overview.active} currently connected`}
          />
          <KPICard
            label="Staff on Leave"
            value={overview.onLeave}
            trend="neutral"
            trendLabel="Approved leaves"
            icon={Clock}
            color="amber"
            loading={loading}
            sparkData={[15, 18, 12, 10, 14, 16, 11, 12]}
            secondaryMetric="3 returning tomorrow"
          />
          <KPICard
            label="Departments"
            value={overview.departmentCount}
            trend="flat"
            trendLabel="Fully operational"
            icon={Landmark}
            color="purple"
            loading={loading}
            sparkData={[4, 4, 5, 5, 5, 6, 6, 6]}
            secondaryMetric={`${overview.newHiresThisMonth || 8} new hires this month`}
          />
          <KPICard
            label="Active Projects"
            value={42}
            trend="up"
            trendLabel="+12% from Q1"
            icon={FolderOpen}
            color="teal"
            loading={loading}
            sparkData={[30, 32, 35, 38, 40, 42, 41, 42]}
            secondaryMetric="39 on track · 3 at risk"
          />
          <KPICard
            label="Payroll Health"
            value={payroll.monthlyBudget}
            trend="up"
            trendLabel={`+${payroll.growth}% from last month`}
            icon={DollarSign}
            color="emerald"
            loading={loading}
            sparkData={[880, 890, 910, 920, 935, 942, 948, 950]}
            secondaryMetric="Next payout May 31"
          />
        </motion.div>
      </div>

      {/* ── ZONE 2: OPERATIONS ROW (Leave 4-col, Meeting 4-col, Activity Feed 4-col) ── */}
      <div>
        <div className="zone-label mb-3">Zone 2: Operational Heartbeat</div>
        <motion.div variants={stagger} className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
          
          {/* Leave Requests Card */}
          <motion.div variants={fadeUp} className="dashboard-card h-full">
            <div className="card-header">
              <div>
                <h2 className="card-title">Leave Requests</h2>
                <p className="card-subtitle">Pending HR review queue</p>
              </div>
              <span className="chip chip-warning">
                {leaveRequests.filter(l => l.status?.toLowerCase() === 'pending' || !l.status).length} Pending
              </span>
            </div>

            {/* compact tab filter pills */}
            <div className="filter-pills-container hide-scrollbar" style={{ padding: '8px 20px', borderBottom: '1px solid var(--border-default)' }}>
              {['Pending', 'Approved', 'Rejected', 'All'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setLeaveFilter(tab)}
                  className={`filter-pill ${leaveFilter === tab ? 'active' : ''}`}
                  style={{ height: '24px', fontSize: '10.5px' }}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="card-body p-5 space-y-3.5 max-h-[340px] overflow-y-auto custom-scrollbar flex-1">
              <AnimatePresence initial={false}>
                {filteredLeaves.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-2 text-center h-full">
                    <CheckCircle size={28} className="text-emerald-500" />
                    <p className="text-[12.5px] font-bold text-gray-700 dark:text-slate-300">All Cleared</p>
                    <p className="text-[11.5px] text-gray-400">No requests in this queue</p>
                  </div>
                ) : (
                  filteredLeaves.map(req => {
                    const initial = req.name?.charAt(0) || 'L';
                    const avatarClass = req.department ? `avatar-${req.department.toLowerCase()}` : 'avatar-engineering';
                    return (
                      <motion.div
                        key={req.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        className="p-3.5 rounded-xl bg-[var(--surface-L2)] border border-[var(--border-default)] hover:border-blue-200/50 dark:hover:border-blue-500/20 transition-all flex flex-col gap-2 relative group"
                      >
                        {/* Active indicator bar */}
                        <div className="absolute left-0 top-3 bottom-3 w-[2px] bg-blue-600 scale-y-0 group-hover:scale-y-100 transition-transform origin-center" />
                        
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-full avatar flex items-center justify-center font-bold text-[11px] ${avatarClass || 'avatar-engineering'}`}>
                              {initial}
                            </div>
                            <div>
                              <div className="text-[12.5px] font-bold text-gray-900 dark:text-slate-200 leading-tight">{req.name}</div>
                              <div className="text-[11px] text-gray-450 dark:text-slate-500 mt-0.5">{req.type} · {req.duration}</div>
                            </div>
                          </div>
                          {req.status?.toLowerCase() === 'pending' || !req.status ? (
                            <span className="chip chip-warning">Pending</span>
                          ) : req.status?.toLowerCase() === 'approved' ? (
                            <span className="chip chip-success">Approved</span>
                          ) : (
                            <span className="chip chip-danger">Rejected</span>
                          )}
                        </div>
                        
                        <p className="text-[11.5px] text-gray-500 dark:text-slate-450 italic pl-1.5 border-l border-gray-200 dark:border-white/[0.08]">
                          "{req.reason}"
                        </p>

                        <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-[var(--border-default)]">
                          <span className="text-[10px] font-mono text-gray-400">{req.date}</span>
                          {(req.status?.toLowerCase() === 'pending' || !req.status) && (
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => handleLeaveAction(req.id, 'Reject')}
                                className="px-2.5 py-1 text-[10px] font-bold rounded bg-rose-50 text-rose-600 dark:bg-rose-500/[0.1] hover:bg-rose-100 transition-colors cursor-pointer"
                              >
                                Reject
                              </button>
                              <button
                                onClick={() => handleLeaveAction(req.id, 'Approve')}
                                className="px-2.5 py-1 text-[10px] font-bold rounded bg-emerald-50 text-emerald-600 dark:bg-emerald-500/[0.1] hover:bg-emerald-100 transition-colors cursor-pointer"
                              >
                                Approve
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Meeting Schedule Card */}
          <motion.div variants={fadeUp} className="dashboard-card h-full">
            <div className="card-header">
              <div>
                <h2 className="card-title">Meeting Schedule</h2>
                <p className="card-subtitle">Today's call listings</p>
              </div>
              <button
                onClick={() => setShowMeetingForm(v => !v)}
                className="px-2.5 py-1 text-[10.5px] font-bold rounded bg-blue-50 text-blue-600 dark:bg-blue-500/[0.1] hover:bg-blue-100 transition-colors cursor-pointer"
              >
                {showMeetingForm ? 'Close' : '+ Add'}
              </button>
            </div>

            <div className="card-body p-5 relative max-h-[380px] overflow-y-auto custom-scrollbar flex-1 flex flex-col justify-start">
              
              {/* Quick schedule form */}
              <AnimatePresence>
                {showMeetingForm && (
                  <motion.form
                    onSubmit={handleAddMeeting}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mb-4 border border-blue-200/40 dark:border-blue-500/20 p-4 bg-blue-50/20 dark:bg-blue-500/[0.03] rounded-xl space-y-3.5 shrink-0"
                  >
                    <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Schedule New Session</div>
                    <input type="text" required placeholder="Session Topic" value={meetingForm.title} onChange={e => setMeetingForm({...meetingForm, title: e.target.value})} className={inputCls} />
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" required placeholder="Time (e.g. 2:00 PM)" value={meetingForm.time} onChange={e => setMeetingForm({...meetingForm, time: e.target.value})} className={inputCls} />
                      <input type="text" placeholder="Duration" value={meetingForm.duration} onChange={e => setMeetingForm({...meetingForm, duration: e.target.value})} className={inputCls} />
                    </div>
                    <input type="text" placeholder="Platform Link / Room" value={meetingForm.type} onChange={e => setMeetingForm({...meetingForm, type: e.target.value})} className={inputCls} />
                    <div className="flex justify-end gap-2 pt-1">
                      <button type="button" onClick={() => setShowMeetingForm(false)} className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-all">Cancel</button>
                      <button type="submit" className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-sm shadow-blue-500/10">Schedule</button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {meetings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400 h-full flex-1">
                  <Calendar size={32} className="text-gray-300 dark:text-slate-650 mb-2" />
                  <div className="text-[12.5px] font-semibold text-gray-700 dark:text-slate-350">No Sessions Configured</div>
                  <div className="text-[11px]">Click schedule above to add today's syncs</div>
                </div>
              ) : (
                <div className="space-y-4 relative flex-1">
                  {meetings.map((m, idx) => (
                    <div key={m.id} className="relative flex gap-3 group">
                      {/* timeline line connector */}
                      {idx < meetings.length - 1 && <div className="timeline-connector" />}
                      
                      <div className="flex flex-col items-center relative z-10">
                        <div className="w-[28px] h-[28px] rounded-full bg-blue-50 dark:bg-blue-500/[0.1] text-blue-600 dark:text-blue-400 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 border border-blue-150/45">
                          {m.time ? m.time.split(':')[0] : '10'}
                        </div>
                      </div>

                      <div className="flex-1 p-3.5 rounded-xl bg-[var(--surface-L2)] border border-[var(--border-default)] group-hover:border-blue-500/30 transition-colors">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-[12.5px] font-semibold text-gray-900 dark:text-slate-200">{m.title}</div>
                            <div className="text-[11px] text-gray-450 mt-1">{m.type} · {m.duration || '30 mins'}</div>
                          </div>
                          <span className="text-[11.5px] font-mono font-bold text-blue-650 dark:text-blue-400">{m.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Activity Feed Card */}
          <motion.div variants={fadeUp} className="dashboard-card h-full">
            <div className="card-header">
              <div>
                <h2 className="card-title">Activity Feed</h2>
                <p className="card-subtitle">Live corporate changes</p>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
                <span className="live-dot" />
                <span>LIVE</span>
              </div>
            </div>

            <div className="card-body p-5 max-h-[380px] overflow-y-auto custom-scrollbar flex-1">
              <div className="space-y-4 relative">
                {activities.map((act, i) => (
                  <div key={act.id || i} className="relative flex gap-3 group">
                    {i < activities.length - 1 && <div className="timeline-connector" style={{ left: '16px' }} />}
                    
                    {/* Avatar or department initial circle */}
                    <div className="relative z-10 shrink-0 mt-0.5">
                      <div
                        className="w-[32px] h-[32px] rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0 shadow-sm"
                        style={{ backgroundColor: deptDot[act.dept] || '#94a3b8' }}
                      >
                        {act.dept?.charAt(0) || 'O'}
                      </div>
                    </div>

                    <div className="flex-1 pb-1">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider ${deptLabel[act.dept] || 'text-gray-500'}`}>
                          {act.dept}
                        </span>
                        <span className="text-[10px] font-mono text-gray-400 shrink-0">{act.time}</span>
                      </div>
                      <p className="text-[12px] text-gray-600 dark:text-slate-400 leading-relaxed font-medium">
                        {act.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ── ZONE 3: PROJECTS + RECRUITMENT ROW (Projects 7-col, Pipeline 5-col) ── */}
      <div>
        <div className="zone-label mb-3">Zone 3: Strategic Initiatives & Pipeline</div>
        <motion.div variants={stagger} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Active Projects Card (7-col) */}
          <motion.div variants={fadeUp} className="dashboard-card lg:col-span-7 h-full flex flex-col justify-between">
            <div className="card-header">
              <div>
                <h2 className="card-title">Active Projects</h2>
                <p className="card-subtitle">Ongoing corporate initiatives</p>
              </div>
              <span className="chip chip-info">42 Active</span>
            </div>

            <div className="card-body table-responsive-wrapper p-0 flex-1">
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '35%' }}>Project Name</th>
                    <th style={{ width: '20%' }} className="hidden md:table-cell">Lead</th>
                    <th style={{ width: '15%' }} className="hidden sm:table-cell">Status</th>
                    <th style={{ width: '25%' }}>Progress</th>
                    <th style={{ width: '5%', textAlign: 'right' }}>%</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Project Aeon", type: "AI predictive maintenance system", lead: "Sarah Jenkins", progress: 76, status: "Active", fillClass: "active", initial: "S" },
                    { name: "Nova3D Platform", type: "Enterprise 3D printing marketplace", lead: "David Patel", progress: 89, status: "Active", fillClass: "active", initial: "D" },
                    { name: "Core OS Migration", type: "Cloud infrastructure optimization", lead: "James Smith", progress: 34, status: "Planning", fillClass: "info", initial: "J" },
                    { name: "Project Titan", type: "Assembly line IoT automation", lead: "Elena Rostova", progress: 95, status: "In Review", fillClass: "warning", initial: "E" }
                  ].map((p, idx) => (
                    <tr key={idx}>
                      <td>
                        <div className="py-2.5">
                          <div className="font-semibold text-gray-900 dark:text-slate-200 text-sm hover:underline cursor-pointer leading-tight">{p.name}</div>
                          <div className="text-[10px] text-gray-450 mt-1 leading-snug">{p.type}</div>
                        </div>
                      </td>
                      <td className="hidden md:table-cell">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 text-[9px] font-bold flex items-center justify-center shrink-0">
                            {p.initial}
                          </div>
                          <span className="text-[12px] font-medium text-gray-700 dark:text-slate-350">{p.lead}</span>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell">
                        <span className={`chip ${p.status === 'Active' ? 'chip-success' : p.status === 'In Review' ? 'chip-warning' : 'chip-info'}`}>
                          {p.status}
                        </span>
                      </td>
                      <td>
                        <div className="progress-bar">
                          <div className={`progress-bar-fill ${p.fillClass}`} style={{ width: `${p.progress}%` }} />
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="font-mono text-[12px] font-bold text-gray-805 dark:text-slate-105">{p.progress}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Recruitment Pipeline Card (5-col) */}
          <motion.div variants={fadeUp} className="dashboard-card lg:col-span-5 h-full flex flex-col justify-between">
            <div className="card-header">
              <div>
                <h2 className="card-title">Recruitment Pipeline</h2>
                <p className="card-subtitle">Active screening candidates</p>
              </div>
              <button
                onClick={() => setShowAddApplicant(v => !v)}
                className="px-2.5 py-1 text-[10.5px] font-bold rounded bg-blue-50 text-blue-600 dark:bg-blue-500/[0.1] hover:bg-blue-100 transition-colors cursor-pointer"
              >
                {showAddApplicant ? 'Close' : '+ Add'}
              </button>
            </div>

            <div className="card-body p-0 flex-1 flex flex-col justify-start">
              {/* Quick funnel stats bar */}
              <div className="px-5 py-2.5 border-b border-[var(--border-default)] bg-[var(--surface-L2)] flex items-center justify-between text-[11px] font-bold text-gray-500 shrink-0">
                <div>FUNNEL STATISTICS:</div>
                <div className="flex items-center gap-1.5">
                  <span className="text-blue-600 dark:text-blue-400">4</span> Applied
                  <span className="text-gray-300 dark:text-slate-650 mx-0.5">/</span>
                  <span className="text-amber-500">2</span> Intv
                  <span className="text-gray-300 dark:text-slate-650 mx-0.5">/</span>
                  <span className="text-emerald-600 dark:text-emerald-450">1</span> Offer
                </div>
              </div>

              {/* Quick Add Candidate Form */}
              <AnimatePresence>
                {showAddApplicant && (
                  <motion.form
                    onSubmit={handleAddApplicant}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden p-4 bg-blue-50/10 dark:bg-blue-500/[0.03] border-b border-[var(--border-default)] space-y-3 shrink-0"
                  >
                    <input type="text" required placeholder="Candidate Name" value={newApplicant.name} onChange={e => setNewApplicant({...newApplicant, name: e.target.value})} className={inputCls} />
                    <input type="text" required placeholder="Applied Role" value={newApplicant.role} onChange={e => setNewApplicant({...newApplicant, role: e.target.value})} className={inputCls} />
                    <div className="flex justify-end gap-2 pt-1">
                      <button type="button" onClick={() => setShowAddApplicant(false)} className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/[0.04]">Cancel</button>
                      <button type="submit" className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700">Add</button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              <div className="max-h-[300px] overflow-y-auto custom-scrollbar flex-1">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Candidate</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicants.map(cand => (
                      <tr key={cand.id} className={cand.status === 'Rejected' ? 'opacity-50 line-through' : ''}>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                              {cand.name.charAt(0)}
                            </div>
                            <div className="truncate">
                              <span className="font-semibold text-gray-900 dark:text-slate-200 text-[12.5px]">{cand.name}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="text-[12px] text-gray-500 dark:text-slate-450 truncate block max-w-[80px]">{cand.role}</span>
                        </td>
                        <td>
                          <ApplicantPill status={cand.status} />
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {cand.status !== 'Hired' && cand.status !== 'Rejected' ? (
                            <div className="flex items-center justify-end gap-1 actions">
                              <button onClick={() => handleApplicantStatus(cand.id, 'Interviewing')} className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 transition-colors cursor-pointer animate-none">Intv</button>
                              <button onClick={() => handleApplicantStatus(cand.id, 'Hired')}        className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 transition-colors cursor-pointer animate-none">Hire</button>
                              <button onClick={() => handleApplicantStatus(cand.id, 'Rejected')}     className="px-2 py-0.5 rounded text-[9px] font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 transition-colors cursor-pointer animate-none">Rej</button>
                            </div>
                          ) : cand.status === 'Hired' ? (
                            <Link
                              to={`/dashboard/admin/employees/create?name=${encodeURIComponent(cand.name)}&role=${encodeURIComponent(cand.role)}`}
                              className="inline-flex px-2 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-650 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 transition-colors shrink-0"
                            >
                              Onboard
                            </Link>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ── ZONE 4: WORKFORCE INTELLIGENCE ROW (Directory 8-col, Payroll 4-col) ── */}
      <div>
        <div className="zone-label mb-3">Zone 4: Workforce Intelligence & Operations</div>
        <motion.div variants={stagger} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Employee Directory Snapshot Card (8-col) */}
          <motion.div variants={fadeUp} className="dashboard-card lg:col-span-8 h-full flex flex-col justify-between">
            <div className="card-header">
              <div>
                <h2 className="card-title">Employee Directory Snapshot</h2>
                <p className="card-subtitle">Recent workforce and department snapshot</p>
              </div>
              <Link
                to="/dashboard/admin/employees"
                className="flex items-center gap-1 text-[11px] font-bold text-blue-650 dark:text-blue-400 hover:underline shrink-0 group"
              >
                Full Directory ↗
              </Link>
            </div>

            {/* Department Horizontal Scroll filter bar */}
            <div className="filter-pills-container hide-scrollbar" style={{ borderBottom: '1px solid var(--border-default)' }}>
              {['All', 'Engineering', 'HR', 'Marketing', 'Operations', 'Finance'].map(dept => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`filter-pill ${selectedDept === dept ? 'active' : ''}`}
                >
                  {dept}
                </button>
              ))}
            </div>

            <div className="card-body table-responsive-wrapper p-0 flex-1 max-h-[340px]">
              <table className="data-table">
                <thead className="sticky top-0 bg-[var(--surface-L1)] z-10">
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th className="hidden md:table-cell">Designation</th>
                    <th>Status</th>
                    <th className="hidden sm:table-cell">Joined</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map(emp => {
                    const initial = emp.fullName?.charAt(0) || 'E';
                    const avatarClass = emp.department ? `avatar-${emp.department.toLowerCase()}` : 'avatar-engineering';
                    return (
                      <tr key={emp._id}>
                        <td>
                          <div className="flex items-center gap-2.5 py-1.5">
                            <div className={`w-8 h-8 rounded-full avatar flex items-center justify-center font-bold text-[11px] shrink-0 ${avatarClass}`}>
                              {initial}
                            </div>
                            <div>
                              <div className="text-[12.5px] font-bold text-gray-900 dark:text-slate-200 leading-tight">{emp.fullName}</div>
                              <div className="text-[10px] text-gray-450 dark:text-slate-500 mt-0.5">{emp.designation}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="text-[12.5px] font-medium text-gray-700 dark:text-slate-350">{emp.department}</span>
                        </td>
                        <td className="hidden md:table-cell">
                          <span className="text-[12px] text-gray-555 dark:text-slate-450 truncate block max-w-[120px]">{emp.designation}</span>
                        </td>
                        <td>
                          <StatusPill status={emp.status} />
                        </td>
                        <td className="hidden sm:table-cell">
                          <span className="font-mono text-[11px] text-gray-450 dark:text-slate-500 font-semibold">
                            {new Date(emp.joiningDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="flex items-center justify-end gap-1.5 actions">
                            <Link
                              to={`/dashboard/admin/employees/${emp._id}`}
                              className="px-2.5 py-1 bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] hover:border-gray-300 dark:hover:border-slate-700 hover:text-gray-900 text-gray-500 dark:text-slate-400 rounded-lg text-[10px] font-bold transition-all shrink-0"
                            >
                              View
                            </Link>
                            <Link
                              to={`/dashboard/admin/employees/edit/${emp._id}`}
                              className="px-2.5 py-1 bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] hover:border-gray-300 dark:hover:border-slate-700 hover:text-gray-900 text-gray-500 dark:text-slate-400 rounded-lg text-[10px] font-bold transition-all shrink-0"
                            >
                              Edit
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Payroll Card (4-col) */}
          <motion.div variants={fadeUp} className="dashboard-card lg:col-span-4 h-full flex flex-col justify-between">
            <div className="card-header">
              <div>
                <h2 className="card-title">Payroll Overview</h2>
                <p className="card-subtitle">Monthly balance statistics</p>
              </div>
              <span className="chip chip-success">Healthy</span>
            </div>

            <div className="card-body p-5 space-y-5 flex-1 flex flex-col justify-between">
              {/* Top Budget section */}
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">MONTHLY PAYROLL BUDGET</div>
                <div className="text-[32px] font-black text-blue-600 dark:text-blue-450 tracking-tight mt-1">
                  ₹{payroll.monthlyBudget?.toLocaleString('en-IN') || '9,50,000'}
                </div>
                <div className="flex items-center gap-1 mt-1 text-[11.5px] font-bold text-emerald-600 dark:text-emerald-450">
                  <TrendingUp size={11} />
                  <span>+2.4% from last month</span>
                </div>
              </div>

              {/* Average salaries */}
              <div className="grid grid-cols-2 gap-4 py-3 border-y border-[var(--border-default)]">
                <div>
                  <div className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase">Avg Salary</div>
                  <div className="text-[14px] font-extrabold text-gray-900 dark:text-white mt-0.5">
                    ₹{payroll.avgSalary?.toLocaleString('en-IN') || '1,73,077'}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase">Next Pay Date</div>
                  <div className="text-[14px] font-extrabold text-gray-900 dark:text-white mt-0.5 font-mono">
                    {payroll.nextPayday || 'May 31, 2026'}
                  </div>
                </div>
              </div>

              {/* Progress breakdown release status */}
              <div>
                <div className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase mb-2">RELEASE STATUS</div>
                <div className="progress-bar flex h-2 rounded-full overflow-hidden bg-gray-100 dark:bg-white/[0.06]">
                  <div className="bg-emerald-500 h-full" style={{ width: '85%' }} />
                  <div className="bg-blue-500 h-full" style={{ width: '15%' }} />
                </div>
                
                <div className="flex items-center justify-between mt-2.5">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Processed (85%)
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Processing (15%)
                  </div>
                </div>
              </div>

              {/* Run button */}
              <div className="pt-2">
                <button className="w-full flex items-center justify-center gap-1.5 h-10 px-3 rounded-xl bg-blue-600 text-white font-bold text-[12px] hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/10 cursor-pointer">
                  Run Monthly Payroll
                </button>
                <div className="text-center mt-3">
                  <Link to="/dashboard/admin/finance" className="text-[11px] font-bold text-blue-650 dark:text-blue-400 hover:underline">
                    View Financial Reports
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
