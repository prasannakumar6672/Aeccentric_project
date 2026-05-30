import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, CheckCircle, XCircle, Clock, Users,
  FileText, RefreshCw, Sparkles, Stethoscope, Plane, Baby, Zap, Briefcase
} from 'lucide-react';
import api from '../../../services/api';
import { useTheme } from '../../../context/ThemeContext';

/* ─── Animations ─── */
const fadeUp  = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } };
const stagger = { animate: { transition: { staggerChildren: 0.07 } } };

/* ─── Leave type config ─── */
const LEAVE_CONFIG = {
  sick:       { label: 'Sick Leave',         icon: Stethoscope, color: '#ef4444', bg: 'bg-rose-50 dark:bg-rose-500/[0.1]',    text: 'text-rose-600 dark:text-rose-400' },
  annual:     { label: 'Annual Leave',        icon: Plane,       color: '#3b82f6', bg: 'bg-blue-50 dark:bg-blue-500/[0.1]',    text: 'text-blue-600 dark:text-blue-400' },
  casual:     { label: 'Casual Leave',        icon: Zap,         color: '#f59e0b', bg: 'bg-amber-50 dark:bg-amber-500/[0.1]',  text: 'text-amber-600 dark:text-amber-400' },
  maternity:  { label: 'Maternity Leave',     icon: Baby,        color: '#ec4899', bg: 'bg-pink-50 dark:bg-pink-500/[0.1]',    text: 'text-pink-600 dark:text-pink-400' },
  paternity:  { label: 'Paternity Leave',     icon: Baby,        color: '#8b5cf6', bg: 'bg-violet-50 dark:bg-violet-500/[0.1]', text: 'text-violet-600 dark:text-violet-400' },
  emergency:  { label: 'Emergency Leave',     icon: Zap,         color: '#f97316', bg: 'bg-orange-50 dark:bg-orange-500/[0.1]', text: 'text-orange-600 dark:text-orange-400' },
  unpaid:     { label: 'Unpaid Leave',        icon: Briefcase,   color: '#64748b', bg: 'bg-slate-50 dark:bg-slate-500/[0.1]',  text: 'text-slate-600 dark:text-slate-400' },
};

const STATUS_CONFIG = {
  pending:  { label: 'Pending',  cls: 'bg-amber-50 dark:bg-amber-500/[0.12] text-amber-700 dark:text-amber-400' },
  approved: { label: 'Approved', cls: 'bg-emerald-50 dark:bg-emerald-500/[0.12] text-emerald-700 dark:text-emerald-400' },
  rejected: { label: 'Rejected', cls: 'bg-rose-50 dark:bg-rose-500/[0.12] text-rose-600 dark:text-rose-400' },
};

/* ─── Widget wrapper ─── */
const Widget = ({ children, className = '' }) => (
  <div className={`dashboard-card ${className}`}>
    {children}
  </div>
);

const StatCard = ({ label, value, icon: Icon, color, sub }) => (
  <motion.div variants={fadeUp}>
    <Widget className="p-5 flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: color + '18' }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-black text-gray-905 dark:text-white leading-none">{value}</p>
        <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mt-1">{label}</p>
        {sub && <p className="text-[10px] text-gray-450 dark:text-slate-600 mt-0.5">{sub}</p>}
      </div>
    </Widget>
  </motion.div>
);

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';

export default function AdminLeaves() {
  const [leaves, setLeaves]     = useState([]);
  const [stats, setStats]       = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [filter, setFilter]     = useState('all');   // all | pending | approved | rejected
  const [loading, setLoading]   = useState(true);
  const [reviewing, setReviewing] = useState(null);   // { id, action }
  const [note, setNote]         = useState('');
  const [showNoteBox, setShowNoteBox] = useState(null); // leaveId
  const { theme }               = useTheme();

  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    try {
      const q = filter !== 'all' ? `?status=${filter}` : '';
      const res = await api.get(`/leaves${q}`);
      if (res.data.success) {
        setLeaves(res.data.leaves);
        const all = res.data.leaves;
        setStats({
          total:    res.data.total || all.length,
          pending:  all.filter(l => l.status === 'pending').length,
          approved: all.filter(l => l.status === 'approved').length,
          rejected: all.filter(l => l.status === 'rejected').length,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchLeaves(); }, [fetchLeaves]);

  const handleReview = async (id, action) => {
    setReviewing({ id, action });
    try {
      await api.patch(`/leaves/${id}/review`, { action, reviewNote: note });
      setNote('');
      setShowNoteBox(null);
      fetchLeaves();
    } catch (e) {
      console.error(e);
    } finally {
      setReviewing(null);
    }
  };

  const displayed = filter === 'all' ? leaves : leaves.filter(l => l.status === filter);

  return (
    <motion.div variants={stagger} initial="initial" animate="animate"
      className="flex flex-col gap-6 md:gap-8 text-gray-900 dark:text-slate-100">

      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500">Leave Operations</span>
            <span className="inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/[0.1] border border-blue-150/40 text-[9px] font-bold text-blue-600 dark:text-blue-400">
              <Sparkles size={8} /> HR Board
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight font-syne dark:text-white leading-none">Leave Requests</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1.5">Review, approve, and track employee leave applications globally.</p>
        </div>
        <button onClick={fetchLeaves}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--border-default)] hover:border-[var(--border-hover)] bg-[var(--surface-L1)] text-xs font-bold text-gray-700 dark:text-slate-300 hover:text-gray-900 transition-all cursor-pointer shadow-sm">
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          Sync Index
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Requests"   value={stats.total}    icon={FileText}    color="#3b82f6" />
        <StatCard label="Pending Review"   value={stats.pending}  icon={Clock}       color="#f59e0b" sub="Awaiting action" />
        <StatCard label="Approved"         value={stats.approved} icon={CheckCircle} color="#10b981" />
        <StatCard label="Rejected"         value={stats.rejected} icon={XCircle}     color="#ef4444" />
      </motion.div>

      {/* Filter Tabs */}
      <motion.div variants={fadeUp}>
        <Widget className="p-1.5 flex gap-1 w-fit">
          {['all', 'pending', 'approved', 'rejected'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-xl text-[12px] font-bold capitalize transition-all cursor-pointer ${
                filter === f
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/10'
                  : 'text-gray-500 dark:text-slate-500 hover:text-gray-900 dark:hover:text-slate-350'
              }`}>
              {f}
              {f === 'pending' && stats.pending > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-4.5 h-4.5 rounded-full bg-white/20 text-[9px] font-extrabold font-mono">
                  {stats.pending}
                </span>
              )}
            </button>
          ))}
        </Widget>
      </motion.div>

      {/* Leave Cards */}
      <motion.div variants={stagger} className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {loading ? (
            [...Array(6)].map((_, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Widget className="p-5 animate-pulse">
                  <div className="h-4 bg-gray-100 dark:bg-white/[0.05] rounded-lg w-3/4 mb-3" />
                  <div className="h-3 bg-gray-100 dark:bg-white/[0.05] rounded-lg w-1/2 mb-4" />
                  <div className="h-8 bg-gray-100 dark:bg-white/[0.05] rounded-xl w-full" />
                </Widget>
              </motion.div>
            ))
          ) : displayed.length === 0 ? (
            <motion.div variants={fadeUp} className="col-span-full">
              <Widget className="p-12 flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/[0.04] flex items-center justify-center">
                  <CheckCircle size={22} className="text-emerald-500" />
                </div>
                <p className="font-bold text-gray-700 dark:text-slate-350">Queue is clear</p>
                <p className="text-xs text-gray-450 dark:text-slate-500">No {filter !== 'all' ? filter : ''} leave requests found.</p>
              </Widget>
            </motion.div>
          ) : (
            displayed.map(leave => {
              const cfg = LEAVE_CONFIG[leave.type] || LEAVE_CONFIG.casual;
              const Icon = cfg.icon;
              const sc  = STATUS_CONFIG[leave.status] || STATUS_CONFIG.pending;
              const emp = leave.employee;
              const isActing = reviewing?.id === leave._id;

              return (
                <motion.div key={leave._id} variants={fadeUp}
                  exit={{ opacity: 0, scale: 0.95 }} layout>
                  <Widget className="p-6 flex flex-col gap-4 hover:border-gray-200 dark:hover:border-white/[0.1] transition-all">
                    
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg}`}>
                          <Icon size={16} className={cfg.text} />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-gray-900 dark:text-slate-105 leading-snug">
                            {emp?.fullName || 'Unknown'}
                          </p>
                          <p className="text-[11px] text-gray-450 dark:text-slate-500 font-semibold mt-0.5">
                            {emp?.department || '-'} / {emp?.employeeId || '-'}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${sc.cls}`}>
                        {sc.label}
                      </span>
                    </div>

                    {/* Leave info */}
                    <div className={`px-4 py-3 rounded-xl ${cfg.bg} flex items-center justify-between`}>
                      <span className={`text-[12px] font-extrabold tracking-wide ${cfg.text}`}>{cfg.label}</span>
                      <span className="text-[11.5px] text-gray-500 dark:text-slate-400 font-bold">{leave.days} day{leave.days > 1 ? 's' : ''}</span>
                    </div>

                    {/* Dates */}
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-400 font-medium">
                      <Calendar size={12} />
                      <span>{fmtDate(leave.startDate)}</span>
                      {leave.days > 1 && <><span>/</span><span>{fmtDate(leave.endDate)}</span></>}
                    </div>

                    {/* Reason */}
                    {leave.reason && (
                      <p className="text-[12px] text-gray-650 dark:text-slate-400 italic leading-relaxed line-clamp-2">
                        "{leave.reason}"
                      </p>
                    )}

                    {/* Note box */}
                    {showNoteBox === leave._id && leave.status === 'pending' && (
                      <textarea
                        value={note}
                        onChange={e => setNote(e.target.value)}
                        placeholder="Optional review note..."
                        rows={2}
                        className="w-full text-xs px-4 py-3 rounded-xl border border-[var(--border-default)] bg-[var(--surface-L2)] text-gray-950 dark:text-slate-150 placeholder:text-gray-400 resize-none focus:outline-none focus:border-blue-500 transition-all"
                      />
                    )}

                    {/* Action buttons (only for pending) */}
                    {leave.status === 'pending' && (
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => {
                            if (showNoteBox !== leave._id) { setShowNoteBox(leave._id); return; }
                            handleReview(leave._id, 'approve');
                          }}
                          disabled={isActing}
                          className="flex-1 flex items-center justify-center gap-1.5 h-10 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/[0.1] hover:bg-emerald-100 dark:hover:bg-emerald-500/[0.18] transition-colors disabled:opacity-50 cursor-pointer">
                          <CheckCircle size={13} />
                          {isActing && reviewing.action === 'approve' ? 'Approving...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleReview(leave._id, 'reject')}
                          disabled={isActing}
                          className="flex-1 flex items-center justify-center gap-1.5 h-10 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/[0.1] hover:bg-rose-100 dark:hover:bg-rose-500/[0.18] transition-colors disabled:opacity-50 cursor-pointer">
                          <XCircle size={13} />
                          {isActing && reviewing.action === 'reject' ? 'Rejecting...' : 'Reject'}
                        </button>
                      </div>
                    )}

                    {/* Review note display */}
                    {leave.status !== 'pending' && leave.reviewNote && (
                      <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/[0.015] border border-[var(--border-default)]">
                        <p className="text-[11px] text-gray-500 dark:text-slate-450 italic leading-relaxed">
                          <span className="font-bold uppercase tracking-wider text-[9px] text-gray-400 mr-1 not-italic">Note:</span> 
                          "{leave.reviewNote}"
                        </p>
                      </div>
                    )}
                  </Widget>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
