import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, RefreshCw, MessageSquare, FolderKanban, CreditCard, Calendar, Sparkles } from 'lucide-react';
import api from '../../../services/api';
import { useTheme } from '../../../context/ThemeContext';

const iconMap = {
  MessageSquare: <MessageSquare size={18} />,
  FolderKanban: <FolderKanban size={18} />,
  CreditCard: <CreditCard size={18} />,
  Calendar: <Calendar size={18} />,
  Zap: <Zap size={18} />,
};

const fadeUp  = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } };
const stagger = { animate: { transition: { staggerChildren: 0.05 } } };

export default function Integrations() {
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);
  const { theme } = useTheme();

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard/integrations');
      if (res.data && res.data.success) {
        setIntegrations(res.data.integrations);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const handleToggle = async (id) => {
    setTogglingId(id);
    try {
      const res = await api.put(`/dashboard/integrations/${id}/toggle`);
      if (res.data && res.data.success) {
        setIntegrations((prev) =>
          prev.map((item) => (item._id === id ? res.data.integration : item))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <motion.div 
      variants={stagger} 
      initial="initial" 
      animate="animate"
      className="flex flex-col gap-6 md:gap-8 text-gray-900 dark:text-slate-100"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500">Workspace Hub</span>
            <span className="inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/[0.1] border border-blue-150/40 text-[9px] font-bold text-blue-600 dark:text-blue-400">
              <Sparkles size={8} /> Active pipelines
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight font-syne dark:text-white flex items-center gap-2">
            Third-party <span className="text-blue-600 dark:text-blue-400">Integrations</span>
            <Zap className="w-6 h-6 text-blue-500 shrink-0" />
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-405 mt-1">
            Connect developer repositories, push notification bots, and payroll invoice databases to your workspace OS.
          </p>
        </div>

        <button
          onClick={fetchIntegrations}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--surface-L1)] hover:bg-[var(--surface-L2)] text-gray-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all border border-[var(--border-default)] hover:border-[var(--border-hover)] cursor-pointer shadow-sm"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          Refresh Integration Index
        </button>
      </motion.div>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3 h-[300px]">
          <RefreshCw size={24} className="text-blue-500 animate-spin" />
          <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">Scanning connected pipelines...</p>
        </div>
      ) : (
        <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {integrations.map((item) => (
            <motion.div
              variants={fadeUp}
              key={item._id}
              className="dashboard-card p-6 flex flex-col justify-between gap-5 hover:border-blue-500/30 dark:hover:border-blue-500/20 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 dark:bg-blue-500/[0.08] text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-sm">
                  {iconMap[item.icon] || <Zap size={18} />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-gray-950 dark:text-white leading-tight">{item.name}</h3>
                    <span className="px-2 py-0.5 rounded bg-gray-150 dark:bg-white/[0.04] text-[9px] text-gray-405 dark:text-slate-500 uppercase font-extrabold tracking-wider border border-[var(--border-default)]">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-2.5 leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[var(--border-default)]">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      item.status === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-450'
                    }`}
                  />
                  <span className="text-[11.5px] font-bold capitalize text-gray-650 dark:text-slate-400">
                    {item.status}
                  </span>
                </div>

                <button
                  onClick={() => handleToggle(item._id)}
                  disabled={togglingId === item._id}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer h-9 shadow-sm ${
                    item.status === 'connected'
                      ? 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/[0.08] dark:text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/30 border border-rose-500/10'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/10'
                  }`}
                >
                  {togglingId === item._id
                    ? 'Syncing...'
                    : item.status === 'connected'
                    ? 'Disconnect'
                    : 'Connect Integration'}
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
