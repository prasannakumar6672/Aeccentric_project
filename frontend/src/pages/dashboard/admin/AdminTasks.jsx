import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock3,
  FolderKanban,
  Plus,
  Search,
  Target,
  UserRound,
  Zap,
  ChevronDown,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import api from '../../../services/api';

const columns = [
  { id: 'todo', title: 'Todo', tone: 'blue' },
  { id: 'in_progress', title: 'In Progress', tone: 'amber' },
  { id: 'review', title: 'Review', tone: 'violet' },
  { id: 'completed', title: 'Completed', tone: 'emerald' },
];

const toneClasses = {
  blue: 'border-blue-200/70 bg-blue-500/[0.04] text-blue-600 dark:border-blue-500/20 dark:text-blue-300',
  amber: 'border-amber-200/70 bg-amber-500/[0.05] text-amber-600 dark:border-amber-500/20 dark:text-amber-300',
  violet: 'border-violet-200/70 bg-violet-500/[0.05] text-violet-600 dark:border-violet-500/20 dark:text-violet-300',
  emerald: 'border-emerald-200/70 bg-emerald-500/[0.05] text-emerald-600 dark:border-emerald-500/20 dark:text-emerald-300',
  rose: 'border-rose-200/70 bg-rose-500/[0.05] text-rose-600 dark:border-rose-500/20 dark:text-rose-300',
};

const columnAccentColors = {
  blue: 'bg-blue-500',
  amber: 'bg-amber-500',
  violet: 'bg-violet-500',
  emerald: 'bg-emerald-500',
};

const priorityClass = {
  low: 'bg-slate-100 text-slate-600 dark:bg-white/[0.06] dark:text-slate-350',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
  high: 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300',
  critical: 'bg-pink-100 text-pink-700 dark:bg-pink-500/10 dark:text-pink-300',
};

const normalizeStatus = (status) => {
  if (status === 'done' || status === 'completed') return 'completed';
  if (status === 'blocked') return 'review';
  return status || 'todo';
};

const isOverdue = (date, status) => {
  if (!date || normalizeStatus(status) === 'completed') return false;
  const due = new Date(date);
  due.setHours(23, 59, 59, 999);
  return due < new Date();
};

const initials = (name = 'U') => name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();

function TaskCard({ task, onMove }) {
  const status = normalizeStatus(task.status);
  const overdue = isOverdue(task.dueDate, status);
  const assignee = task.assignedTo?.fullName || 'Unassigned';

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      whileHover={{ y: -3 }}
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-gray-300 dark:border-white/[0.06] dark:bg-white/[0.025] transition-all relative group flex flex-col justify-between gap-5"
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-extrabold leading-snug text-gray-955 dark:text-white group-hover:text-blue-500 transition-colors">{task.title}</h3>
            {task.project?.name && (
              <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-bold text-gray-450 dark:text-slate-400">
                <FolderKanban size={12} className="text-blue-500" />
                <span className="truncate">{task.project.name}</span>
              </div>
            )}
          </div>

          <span className={`text-[9px] px-2.5 py-1 rounded-full font-extrabold uppercase shrink-0 ${priorityClass[task.priority] || priorityClass.medium}`}>
            {task.priority || 'medium'}
          </span>
        </div>

        {task.description && (
          <p className="mt-4 line-clamp-3 text-xs leading-relaxed text-gray-500 dark:text-slate-400 italic">
            "{task.description}"
          </p>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-white/[0.04] gap-2">
        {/* Assignee initials badge */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[9px] font-black uppercase border border-blue-500/10 shrink-0">
            {initials(assignee)}
          </div>
          <span className="text-[11px] font-bold text-gray-600 dark:text-slate-350 truncate" title={assignee}>{assignee}</span>
        </div>

        {/* Due Date capsule */}
        {task.dueDate && (
          <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-lg border shrink-0 ${
            overdue
              ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
              : 'bg-gray-100 dark:bg-white/[0.04] text-gray-500 dark:text-slate-400 border-gray-200 dark:border-white/[0.06]'
          }`}>
            <Calendar size={11} />
            {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>

      {/* Stage Change Pill Dropdown */}
      <div className="flex items-center justify-between gap-2 border-t border-gray-100 pt-4 dark:border-white/[0.04] text-[10px]">
        <span className="text-gray-400 dark:text-slate-500 font-semibold uppercase tracking-wider text-[9px]">Stage</span>
        <div className="relative group/select">
          <select
            value={status}
            onChange={(e) => onMove(task, e.target.value)}
            className={`text-[10px] font-extrabold uppercase pl-3.5 pr-8 py-1.5 rounded-xl border cursor-pointer appearance-none outline-none transition-all shadow-sm ${
              status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
              status === 'in_progress' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
              status === 'review' ? 'bg-violet-500/10 text-violet-500 border-violet-500/20' :
              'bg-blue-500/10 text-blue-500 border-blue-500/20'
            }`}
          >
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Review</option>
            <option value="completed">Completed</option>
          </select>
          <span className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 dark:text-slate-500 pointer-events-none">
            <ChevronDown size={11} />
          </span>
        </div>
      </div>
    </motion.article>
  );
}

function TaskModal({ open, employees, projects, onClose, onCreate }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    assignedTo: '',
    project: '',
    priority: 'medium',
    status: 'todo',
    dueDate: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    if (open) {
      setForm((prev) => ({
        ...prev,
        assignedTo: employees[0]?._id || '',
        project: projects[0]?._id || '',
      }));
    }
  }, [open, employees, projects]);

  const submit = (event) => {
    event.preventDefault();
    onCreate(form);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm">
          <motion.form
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            onSubmit={submit}
            className="glass-card w-full max-w-2xl p-8 border border-gray-200 dark:border-white/[0.08] relative"
          >
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-white/[0.04] pb-3">
              <div>
                <h2 className="text-lg font-extrabold font-syne text-gray-900 dark:text-white">Create New Task</h2>
                <p className="text-xs text-gray-500 dark:text-[#8892B8] mt-1">Assign a clear owner, deadline, and workflow state.</p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <span className="mb-1.5 block text-[11px] font-extrabold text-gray-400 dark:text-[#5A6282] uppercase tracking-wider block pl-1 mb-1.5">Task Title *</span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Finalize quarterly board slides"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full text-sm py-3.5 pl-4 pr-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-250 dark:border-white/[0.06] hover:border-blue-500/30 text-gray-900 dark:text-[#EDF0FA] placeholder-gray-400/50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-sm"
                />
              </div>
              
              <div className="md:col-span-2">
                <span className="mb-1.5 block text-[11px] font-extrabold text-gray-400 dark:text-[#5A6282] uppercase tracking-wider block pl-1 mb-1.5">Description</span>
                <textarea
                  rows="3"
                  placeholder="Describe the task deliverables..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full text-sm py-3.5 pl-4 pr-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-250 dark:border-white/[0.06] hover:border-blue-500/30 text-gray-900 dark:text-[#EDF0FA] placeholder-gray-400/50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-sm"
                />
              </div>

              <div>
                <span className="mb-1.5 block text-[11px] font-extrabold text-gray-400 dark:text-[#5A6282] uppercase tracking-wider block pl-1 mb-1.5">Assignee *</span>
                <div className="relative group">
                  <select
                    required
                    value={form.assignedTo}
                    onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                    className="w-full text-sm py-3.5 pl-4 pr-10 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-250 dark:border-white/[0.06] hover:border-blue-500/30 text-gray-805 dark:text-[#EDF0FA] focus:outline-none cursor-pointer appearance-none shadow-sm font-semibold"
                  >
                    <option value="">Choose employee</option>
                    {employees.map((employee) => <option key={employee._id} value={employee._id}>{employee.fullName}</option>)}
                  </select>
                  <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-450 dark:text-[#5A6282] pointer-events-none">
                    <ChevronDown size={14} />
                  </span>
                </div>
              </div>

              <div>
                <span className="mb-1.5 block text-[11px] font-extrabold text-gray-400 dark:text-[#5A6282] uppercase tracking-wider block pl-1 mb-1.5">Project</span>
                <div className="relative group">
                  <select
                    value={form.project}
                    onChange={(e) => setForm({ ...form, project: e.target.value })}
                    className="w-full text-sm py-3.5 pl-4 pr-10 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-250 dark:border-white/[0.06] hover:border-blue-500/30 text-gray-805 dark:text-[#EDF0FA] focus:outline-none cursor-pointer appearance-none shadow-sm font-semibold"
                  >
                    <option value="">No project</option>
                    {projects.map((project) => <option key={project._id} value={project._id}>{project.name}</option>)}
                  </select>
                  <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-450 dark:text-[#5A6282] pointer-events-none">
                    <ChevronDown size={14} />
                  </span>
                </div>
              </div>

              <div>
                <span className="mb-1.5 block text-[11px] font-extrabold text-gray-400 dark:text-[#5A6282] uppercase tracking-wider block pl-1 mb-1.5">Priority</span>
                <div className="relative group">
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="w-full text-sm py-3.5 pl-4 pr-10 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-250 dark:border-white/[0.06] hover:border-blue-500/30 text-gray-805 dark:text-[#EDF0FA] focus:outline-none cursor-pointer appearance-none shadow-sm font-semibold"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                  <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-455 dark:text-[#5A6282] pointer-events-none">
                    <ChevronDown size={14} />
                  </span>
                </div>
              </div>

              <div>
                <span className="mb-1.5 block text-[11px] font-extrabold text-gray-400 dark:text-[#5A6282] uppercase tracking-wider block pl-1 mb-1.5">Due date</span>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  className="w-full text-sm py-3.5 pl-4 pr-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-250 dark:border-white/[0.06] hover:border-blue-500/30 text-gray-805 dark:text-[#EDF0FA] focus:outline-none shadow-sm cursor-pointer"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4 dark:border-white/[0.04]">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-gray-100 dark:bg-white/[0.04] hover:bg-gray-200 text-gray-700 dark:text-[#EDF0FA] rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/10 cursor-pointer"
              >
                Create task
              </button>
            </div>
          </motion.form>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function AdminTasks() {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [tasksRes, employeesRes, projectsRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/employees?limit=100'),
        api.get('/projects'),
      ]);
      setTasks(tasksRes.data.tasks || []);
      setEmployees(employeesRes.data.employees || []);
      setProjects(projectsRes.data.projects || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load the task board.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredTasks = useMemo(() => {
    const term = query.trim().toLowerCase();
    return tasks.filter((task) => {
      const matchesQuery = !term
        || task.title?.toLowerCase().includes(term)
        || task.assignedTo?.fullName?.toLowerCase().includes(term)
        || task.project?.name?.toLowerCase().includes(term);
      const matchesProject = !projectFilter || task.project?._id === projectFilter;
      return matchesQuery && matchesProject;
    });
  }, [tasks, query, projectFilter]);

  const stats = useMemo(() => {
    const total = filteredTasks.length;
    const completed = filteredTasks.filter((task) => normalizeStatus(task.status) === 'completed').length;
    const overdue = filteredTasks.filter((task) => isOverdue(task.dueDate, task.status)).length;
    const critical = filteredTasks.filter((task) => task.priority === 'critical' || task.priority === 'high').length;
    return {
      total,
      completed,
      overdue,
      critical,
      completion: total ? Math.round((completed / total) * 100) : 0,
    };
  }, [filteredTasks]);

  const moveTask = async (task, status) => {
    const apiStatus = status === 'completed' ? 'completed' : status;
    try {
      const res = await api.put(`/tasks/${task._id}`, { status: apiStatus });
      if (res.data.success) {
        setTasks((prev) => prev.map((item) => item._id === task._id ? res.data.task : item));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update task status.');
    }
  };

  const createTask = async (payload) => {
    try {
      const res = await api.post('/tasks', payload);
      if (res.data.success) {
        setTasks((prev) => [res.data.task, ...prev]);
        setModalOpen(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create task.');
    }
  };

  return (
    <div className="flex flex-col gap-10 text-gray-900 dark:text-[#EDF0FA] px-1 sm:px-2">

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-5">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-blue-500 font-extrabold uppercase tracking-wider pl-1 select-none">
            <Zap size={13} className="animate-pulse" /> Work orchestration
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight font-syne dark:text-white flex items-center gap-2 mt-1">
            Task <span className="text-blue-600 dark:text-blue-400">Command Board</span>
            <Sparkles className="w-5 h-5 text-blue-500" />
          </h1>
          <p className="text-sm text-gray-500 dark:text-[#8892B8] mt-1.5">
            Track ownership, deadlines, project context, and delivery status from one stable Kanban surface.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-600/10 hover:shadow-blue-600/20 hover:-translate-y-0.5 self-start md:self-auto cursor-pointer"
        >
          <Plus size={15} />
          New Task
        </button>
      </div>

      {/* STATS BENTO ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          ['Total Tasks', stats.total, Target, 'rgba(26, 86, 219, 0.08)', 'text-blue-600 dark:text-blue-400'],
          ['Completion Rate', `${stats.completion}%`, CheckCircle2, 'rgba(14, 159, 110, 0.08)', 'text-emerald-600 dark:text-emerald-400'],
          ['Overdue', stats.overdue, Clock3, 'rgba(239, 68, 68, 0.08)', 'text-rose-600 dark:text-rose-400'],
          ['High Priority', stats.critical, AlertCircle, 'rgba(245, 158, 11, 0.08)', 'text-amber-600 dark:text-amber-400'],
        ].map(([label, value, Icon, bg, textCls]) => (
          <div key={label} className="kpi-card relative" style={{ padding: '22px 24px 24px' }}>
            <div className="flex items-start justify-between">
              <span className="kpi-label">{label}</span>
              <div className="kpi-icon" style={{ backgroundColor: bg }}>
                <Icon size={17} className={textCls} />
              </div>
            </div>
            <div className="kpi-number mt-5">{value}</div>
          </div>
        ))}
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="px-6 py-5 bg-gray-50/50 dark:bg-white/[0.01] border border-gray-200 dark:border-white/[0.04] rounded-2xl flex flex-col md:flex-row gap-4 items-center">
        {/* Search Console */}
        <div className="relative flex-1 w-full group">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 dark:text-[#8892B8] pointer-events-none group-focus-within:text-blue-500 transition-colors">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search task, assignee, or project..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-[13px] pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-white/[0.02] border border-gray-250 dark:border-white/[0.06] hover:border-blue-500/30 text-gray-900 dark:text-[#EDF0FA] placeholder-gray-400/50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200 shadow-sm"
          />
        </div>

        {/* Project Select Filter */}
        <div className="relative w-full md:w-auto min-w-[240px] group">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-450 dark:text-[#8892B8] pointer-events-none">
            <FolderKanban size={16} className="text-blue-500" />
          </span>
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="w-full text-[13px] pl-11 pr-10 py-3 rounded-xl bg-white dark:bg-white/[0.02] border border-gray-250 dark:border-white/[0.06] hover:border-blue-500/30 text-gray-808 dark:text-[#EDF0FA] focus:outline-none cursor-pointer appearance-none shadow-sm font-semibold"
          >
            <option value="">All Projects</option>
            {projects.map((project) => <option key={project._id} value={project._id}>{project.name}</option>)}
          </select>
          <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-slate-500 pointer-events-none">
            <ChevronDown size={15} />
          </span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl flex items-center gap-3 text-sm">
          <AlertCircle className="shrink-0 w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 text-center gap-4 text-gray-500">
          <RefreshCw size={32} className="text-blue-500 animate-spin" />
          <p className="text-sm font-bold dark:text-[#EDF0FA]">Loading board stages...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8 items-start">
          {columns.map((column) => {
            const columnTasks = filteredTasks.filter((task) => normalizeStatus(task.status) === column.id);
            return (
              <section key={column.id} className="rounded-3xl border border-gray-200 dark:border-white/[0.06] p-5 bg-slate-50/30 dark:bg-white/[0.005] flex flex-col gap-5">

                {/* Column Lane Header */}
                <div className="flex items-center justify-between gap-3 border-b border-gray-100 dark:border-white/[0.04] pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-3 h-3 rounded-full ${columnAccentColors[column.tone]}`} />
                    <h2 className="text-sm font-black dark:text-white tracking-tight">{column.title}</h2>
                  </div>
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/[0.06] text-gray-600 dark:text-slate-400">
                    {columnTasks.length}
                  </span>
                </div>

                {/* Column Cards Lane */}
                <div className="space-y-5 max-h-[680px] overflow-y-auto pr-1 custom-scrollbar">
                  <AnimatePresence>
                    {columnTasks.map((task) => <TaskCard key={task._id} task={task} onMove={moveTask} />)}
                  </AnimatePresence>

                  {columnTasks.length === 0 && (
                    <div className="rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/[0.06] bg-white/40 p-10 text-center text-xs font-bold text-gray-400 dark:bg-white/[0.01]">
                      No tasks in stage
                    </div>
                  )}
                </div>

              </section>
            );
          })}
        </div>
      )}

      <TaskModal
        open={modalOpen}
        employees={employees}
        projects={projects}
        onClose={() => setModalOpen(false)}
        onCreate={createTask}
      />
    </div>
  );
}
