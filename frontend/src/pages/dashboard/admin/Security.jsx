import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Plus, RefreshCw, AlertTriangle, CheckCircle, ShieldAlert, Cpu, Sparkles, SlidersHorizontal, Terminal, Mail, ChevronDown, User, ShieldCheck } from 'lucide-react';
import api from '../../../services/api';

export default function Security() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  // Form State
  const [event, setEvent] = useState('');
  const [severity, setSeverity] = useState('low');
  const [userEmail, setUserEmail] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/dashboard/security');
      if (res.data && res.data.success) {
        setLogs(res.data.logs);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch security logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!event.trim() || !userEmail.trim() || creating) return;

    setCreating(true);
    try {
      const res = await api.post('/dashboard/security', { event, severity, userEmail });
      if (res.data && res.data.success) {
        setLogs((prev) => [res.data.log, ...prev]);
        setEvent('');
        setUserEmail('');
        setShowAddForm(false);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to log security incident.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 text-gray-900 dark:text-[#EDF0FA]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-blue-500 font-extrabold uppercase tracking-wider pl-1 select-none">
            <Cpu size={13} className="animate-pulse" /> Security intelligence logs
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight font-syne dark:text-white flex items-center gap-2 mt-1">
            Workspace & Server <span className="text-blue-600 dark:text-blue-400">Security</span>
            <Sparkles className="w-5 h-5 text-blue-500" />
          </h1>
          <p className="text-sm text-gray-500 dark:text-[#8892B8] mt-1.5">
            Real-time SSH warning events, login audit trails, role-based configuration changes, and active blocklists.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchLogs}
            className="flex items-center justify-center p-3 bg-gray-100 hover:bg-gray-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-gray-500 dark:text-[#EDF0FA] border border-gray-250 dark:border-white/[0.06] rounded-xl transition-all cursor-pointer shadow-sm"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/10 cursor-pointer"
          >
            <Plus size={14} />
            Post Audit Log
          </button>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="glass-card p-5 border border-rose-500/20 bg-rose-500/[0.02] dark:bg-rose-500/[0.015] flex items-center gap-4.5 rounded-3xl backdrop-blur-md shadow-sm">
        <div className="w-11 h-11 rounded-2xl bg-rose-500/15 text-rose-500 flex items-center justify-center shrink-0 border border-rose-500/15 relative">
          <ShieldAlert size={20} className="animate-pulse" />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-450 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
        </div>
        <div>
          <h4 className="text-sm font-black text-gray-900 dark:text-white">Active SecOps Shield Status</h4>
          <p className="text-[11.5px] text-gray-500 dark:text-slate-500 mt-1 font-bold leading-relaxed">
            Automatic firewall rate-limits are active. Two login failure warning flags from external IPs have been quarantined for administrator review.
          </p>
        </div>
      </div>

      {/* Add Log Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-8 border border-gray-200 dark:border-white/[0.06] rounded-3xl bg-white/60 dark:bg-white/[0.005] backdrop-blur-md">
              <div className="pb-4 border-b border-gray-100 dark:border-white/[0.04] mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-gray-900 dark:text-white">Post Security Incident Audit Log</h3>
                  <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-1 font-bold">Log configuration changes, credentials revisions, or external access spikes manually.</p>
                </div>
                <SlidersHorizontal size={14} className="text-gray-400" />
              </div>

              <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-wider pl-1">Event Name</label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 pointer-events-none group-focus-within:text-blue-500 transition-colors">
                      <Terminal size={14} />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Configuration file modified"
                      value={event}
                      onChange={(e) => setEvent(e.target.value)}
                      className="w-full text-xs pl-11 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-250 dark:border-white/[0.06] text-gray-905 dark:text-slate-200 focus:outline-none focus:border-blue-500 transition-all font-semibold shadow-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-wider pl-1">Severity Level</label>
                  <div className="relative group">
                    <select
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value)}
                      className="w-full text-xs py-3.5 pl-4 pr-10 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-250 dark:border-white/[0.06] text-gray-800 dark:text-[#EDF0FA] focus:outline-none focus:border-blue-500 transition-all font-semibold shadow-sm cursor-pointer appearance-none"
                    >
                      <option value="low">Low Severity</option>
                      <option value="medium">Medium Severity</option>
                      <option value="high">High Severity</option>
                    </select>
                    <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-slate-500 pointer-events-none">
                      <ChevronDown size={14} />
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-wider pl-1">User Email Involved</label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 pointer-events-none group-focus-within:text-blue-500 transition-colors">
                      <Mail size={14} />
                    </span>
                    <input
                      type="email"
                      required
                      placeholder="e.g. admin@test.com"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full text-xs pl-11 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-250 dark:border-white/[0.06] text-gray-905 dark:text-slate-200 focus:outline-none focus:border-blue-500 transition-all font-semibold shadow-sm"
                    />
                  </div>
                </div>

                <div className="col-span-1 md:col-span-3 flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/[0.04]">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-5 py-2.5 text-xs font-bold text-gray-600 dark:text-slate-350 hover:bg-gray-100 dark:hover:bg-white/[0.05] rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors cursor-pointer shadow-md shadow-blue-600/10"
                  >
                    {creating ? 'Submitting...' : 'Log Audit Event'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Incident List */}
      <div className="glass-card border border-gray-200 dark:border-white/[0.05] shadow-sm rounded-3xl bg-white/60 dark:bg-white/[0.005] backdrop-blur-md overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-white/[0.04]">
          <h2 className="text-sm font-black text-gray-900 dark:text-white">Workspace Security Logs</h2>
          <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-1 font-bold">Live database updates, rate limits warnings, and operational changes registry.</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <RefreshCw size={24} className="text-blue-500 animate-spin" />
            <p className="text-xs font-bold text-gray-500">Retrieving security incident logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Shield className="text-gray-400 w-10 h-10 mb-2 opacity-50 animate-pulse" />
            <p className="text-sm font-bold text-gray-500">No security events logged yet</p>
          </div>
        ) : (
          <div className="table-responsive-wrapper p-0">
            <table className="data-table w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-4 font-black uppercase text-[10px] text-gray-400 dark:text-[#5A6282] tracking-wider select-none">Incident Event</th>
                  <th className="p-4 font-black uppercase text-[10px] text-gray-400 dark:text-[#5A6282] tracking-wider select-none">Severity</th>
                  <th className="p-4 font-black uppercase text-[10px] text-gray-400 dark:text-[#5A6282] tracking-wider select-none">IP Address</th>
                  <th className="p-4 font-black uppercase text-[10px] text-gray-400 dark:text-[#5A6282] tracking-wider select-none">User Account</th>
                  <th className="p-4 font-black uppercase text-[10px] text-gray-400 dark:text-[#5A6282] tracking-wider select-none">Status</th>
                  <th className="p-4 font-black uppercase text-[10px] text-gray-400 dark:text-[#5A6282] tracking-wider select-none text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/50 dark:divide-white/[0.02]">
                {logs.map((item, index) => (
                  <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.015] transition-colors">
                    <td className="p-4 font-bold text-gray-900 dark:text-white text-xs flex items-center gap-2.5">
                      {item.severity === 'high' ? (
                        <span className="relative flex h-2 w-2 shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-450 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                        </span>
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                      )}
                      {item.event}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${
                          item.severity === 'high'
                            ? 'bg-rose-500/10 text-rose-500 border-rose-500/10'
                            : item.severity === 'medium'
                            ? 'bg-amber-500/10 text-amber-500 border-amber-500/10'
                            : 'bg-blue-500/10 text-blue-500 border-blue-500/10'
                        }`}
                      >
                        {item.severity}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-[10.5px] bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.04] py-0.5 px-2 rounded-lg text-gray-600 dark:text-slate-400 font-bold">
                        {item.ipAddress || 'unknown'}
                      </span>
                    </td>
                    <td className="p-4 text-xs font-bold text-gray-600 dark:text-slate-450 flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-slate-500/10 flex items-center justify-center text-[9px] shrink-0 border border-slate-500/10">
                        <User size={10} />
                      </div>
                      {item.userEmail}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-500 border border-emerald-500/10 bg-emerald-500/10 px-2.5 py-0.5 rounded-full uppercase">
                        <ShieldCheck size={10} />
                        {item.status || 'quarantined'}
                      </span>
                    </td>
                    <td className="p-4 text-right text-[11px] font-bold text-gray-400 dark:text-slate-600">
                      {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ·{' '}
                      {new Date(item.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
