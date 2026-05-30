import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Folder, AlertCircle, BarChart3, CheckCircle2, Clock, Plus, Sparkles } from 'lucide-react';
import api from '../../../services/api';
import { completedStatuses, demoTasks } from './employeeWorkspaceData';

export default function EmployeeTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/tasks/my');
      if (res.data.success) {
        setTasks(res.data.tasks?.length ? res.data.tasks : demoTasks);
      }
    } catch (err) {
      console.error(err);
      setTasks(demoTasks);
      setError('Failed to fetch your assigned tasks.');
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      if (String(taskId).startsWith('demo-')) {
        setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
        return;
      }
      const res = await api.put(`/tasks/${taskId}`, { status: newStatus });
      if (res.data.success) {
        // Update local state
        setTasks(prev => prev.map(t => t._id === taskId ? res.data.task : t));
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update task status.');
    }
  };

  const columns = [
    { id: 'todo', title: 'To Do', color: 'border-t-4 border-t-blue-500 bg-blue-500/[0.02]', btnText: 'Start Work', nextStatus: 'in_progress', btnColor: 'bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/10' },
    { id: 'in_progress', title: 'In Progress', color: 'border-t-4 border-t-amber-500 bg-amber-500/[0.02]', btnText: 'Send Review', nextStatus: 'review', btnColor: 'bg-amber-600 hover:bg-amber-700 shadow-sm shadow-amber-500/10' },
    { id: 'review', title: 'Review', color: 'border-t-4 border-t-violet-500 bg-violet-500/[0.02]', btnText: 'Complete', nextStatus: 'completed', btnColor: 'bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-500/10' },
    { id: 'completed', title: 'Completed', color: 'border-t-4 border-t-emerald-500 bg-emerald-500/[0.02]', btnText: 'Re-open', nextStatus: 'todo', btnColor: 'bg-gray-600 hover:bg-gray-700 shadow-sm shadow-gray-500/10' },
    { id: 'blocked', title: 'Blocked', color: 'border-t-4 border-t-rose-500 bg-rose-500/[0.02]', btnText: 'Unblock', nextStatus: 'todo', btnColor: 'bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/10' }
  ];

  const completedCount = tasks.filter(t => completedStatuses.includes(t.status)).length;
  const dueToday = tasks.filter(t => t.dueDate && new Date(t.dueDate).toDateString() === new Date().toDateString()).length;
  const highPriority = tasks.filter(t => ['critical', 'high'].includes(t.priority)).length;

  return (
    <div className="dash-page flex flex-col gap-6 md:gap-8 text-slate-950 dark:text-[#f8fafc]">
      
      {/* ── SECTION 1: PAGE HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold tracking-wider text-gray-400 dark:text-slate-500 uppercase">AECCENTRIC EMS</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/[0.1] border border-blue-100 dark:border-blue-500/20 text-[10px] font-bold text-blue-600 dark:text-blue-400">
              <Sparkles size={9} />
              Taskboard
            </span>
          </div>
          <h1 className="text-[32px] font-bold tracking-tight text-gray-950 dark:text-white leading-none">
            My Tasks
          </h1>
          <p className="text-[13px] text-gray-500 dark:text-[#94a3b8] mt-2 font-normal">
            Review and update status of your assigned tasks and deliverables.
          </p>
        </div>
      </div>

      {/* ── SECTION 2: KPI STRIP ── */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          ['Assigned', tasks.length, Folder, 'text-blue-600 dark:text-blue-400', 'rgba(26, 86, 219, 0.08)'],
          ['Due Today', dueToday, Clock, 'text-amber-600 dark:text-amber-500', 'rgba(245, 158, 11, 0.08)'],
          ['High Priority', highPriority, AlertCircle, 'text-rose-600 dark:text-rose-450', 'rgba(239, 68, 68, 0.08)'],
          ['Completed', completedCount, CheckCircle2, 'text-emerald-600 dark:text-emerald-400', 'rgba(14, 159, 110, 0.08)'],
        ].map(([label, value, Icon, text, bg]) => (
          <div key={label} className="kpi-card flex flex-col justify-between h-full min-h-[120px] relative overflow-hidden">
            <div className="flex items-start justify-between">
              <span className="kpi-label">{label}</span>
              <div className={`kpi-icon ${text}`} style={{ backgroundColor: bg }}>
                <Icon size={15} />
              </div>
            </div>
            <div className="kpi-number mt-3 text-2xl font-black text-gray-950 dark:text-white">
              {value}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl flex items-center gap-3 text-sm">
          <AlertCircle className="shrink-0 w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5 items-stretch w-full">
          {columns.map(col => {
            const colTasks = tasks.filter(t => t.status === col.id);
            return (
              <div
                key={col.id}
                className={`flex flex-col gap-4 rounded-2xl border border-slate-200/60 dark:border-white/[0.06] p-4 bg-slate-50/40 dark:bg-white/[0.01] hover:bg-slate-50/70 dark:hover:bg-white/[0.02] transition-colors duration-300 min-h-[600px] h-full ${col.color}`}
              >
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/65 dark:border-white/[0.06] mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${
                      col.id === 'todo' ? 'bg-blue-500 shadow-sm shadow-blue-550/30' :
                      col.id === 'in_progress' ? 'bg-amber-500 shadow-sm shadow-amber-550/30' :
                      col.id === 'review' ? 'bg-violet-500 shadow-sm shadow-violet-550/30' :
                      col.id === 'completed' ? 'bg-emerald-500 shadow-sm shadow-emerald-550/30' :
                      'bg-rose-500 shadow-sm shadow-rose-550/30'
                    }`} />
                    <span className="font-extrabold text-[11px] tracking-wider uppercase text-slate-500 dark:text-slate-400">
                      {col.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/50 dark:bg-white/[0.06] text-slate-700 dark:text-slate-355 min-w-[22px] text-center border border-slate-300/20 dark:border-white/[0.03]">
                    {colTasks.length}
                  </span>
                </div>

                <div className="flex-1 flex flex-col gap-3.5 overflow-y-auto max-h-[680px] custom-scrollbar pr-1.5">
                  <AnimatePresence>
                    {colTasks.map(task => (
                      <motion.div
                        key={task._id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="rounded-xl border border-slate-200/80 bg-white p-5 md:p-6 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_8px_20px_rgba(15,23,42,0.03)] dark:border-white/[0.06] dark:bg-[#0d1526] flex flex-col gap-4 relative hover:border-slate-350 dark:hover:border-white/[0.12] hover:shadow-[0_4px_12px_rgba(15,23,42,0.05),0_12px_28px_rgba(15,23,42,0.06)] hover:translate-y-[-2px] transition-all duration-300 ease-out"
                      >
                        <div>
                          <h4 className="font-bold text-sm leading-snug text-slate-900 dark:text-slate-50 break-words tracking-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed font-normal">
                              {task.description}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          {task.project && (
                            <span
                              className="text-[10px] px-2.5 h-6 rounded-md border font-semibold flex items-center gap-1.5 shrink-0"
                              style={{ borderColor: task.project.color + '33', color: task.project.color, backgroundColor: task.project.color + '0e' }}
                            >
                              <Folder size={11} className="shrink-0" />
                              <span className="truncate max-w-[90px]">{task.project.name}</span>
                            </span>
                          )}
                          <span className={`text-[10px] px-2.5 h-6 rounded-md border font-extrabold capitalize shrink-0 flex items-center justify-center gap-1 ${
                            task.priority === 'high' || task.priority === 'critical' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' :
                            task.priority === 'medium' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-550 border-amber-500/20' :
                            'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                          }`}>
                            <span className={`w-1 h-1 rounded-full shrink-0 ${
                              task.priority === 'high' || task.priority === 'critical' ? 'bg-rose-500' :
                              task.priority === 'medium' ? 'bg-amber-500' :
                              'bg-blue-500'
                            }`} />
                            {task.priority}
                          </span>
                        </div>

                        {/* Due Date */}
                        {task.dueDate && (
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                            <Calendar size={12} className="text-slate-400 dark:text-slate-500 shrink-0" />
                            <span>Due {new Date(task.dueDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}</span>
                          </div>
                        )}

                        {/* Status & Quick Action Area */}
                        <div className="flex items-center gap-3 mt-1.5 pt-3.5 border-t border-slate-100 dark:border-white/[0.04]">
                          <div className="flex flex-col gap-1 flex-1 min-w-0">
                            <span className="text-[9px] font-extrabold text-slate-455 dark:text-slate-500 uppercase tracking-wider">Status</span>
                            <select
                              value={task.status}
                              onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                              className="h-9 w-full text-xs font-semibold rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#070D1A] text-slate-700 dark:text-slate-300 px-2 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-500/50 transition-all"
                            >
                              {columns.map(c => (
                                <option key={c.id} value={c.id}>{c.title}</option>
                              ))}
                            </select>
                          </div>
                          <div className="flex flex-col gap-1 flex-1 min-w-0">
                            <span className="text-[9px] font-extrabold text-slate-455 dark:text-slate-500 uppercase tracking-wider">Action</span>
                            <button
                              onClick={() => updateTaskStatus(task._id, col.nextStatus)}
                              className={`h-9 w-full rounded-lg text-xs font-extrabold text-white transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1 ${col.btnColor}`}
                            >
                              {col.btnText}
                            </button>
                          </div>
                        </div>

                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {colTasks.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 px-4 rounded-xl border border-dashed border-slate-200 dark:border-white/[0.06] bg-slate-50/20 dark:bg-white/[0.005] text-center mt-2">
                      <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/[0.03] flex items-center justify-center mb-2.5 text-slate-400 dark:text-slate-500 border border-slate-200/50 dark:border-white/[0.02]">
                        <Folder size={15} />
                      </div>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-350">Lane is empty</p>
                      <p className="text-[10px] text-slate-455 dark:text-slate-500 mt-1 max-w-[120px] leading-normal font-medium">
                        There are no tasks assigned to this stage.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
