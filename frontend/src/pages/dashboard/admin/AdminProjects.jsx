import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, Edit3, Calendar, Folder, User, Users, Briefcase,
  AlertCircle, Sparkles, Check, ChevronDown, Clock, Search, Filter, FolderKanban, RefreshCw
} from 'lucide-react';
import api from '../../../services/api';

/* ─── ANIMATION VARIANTS ─── */
const containerVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const cardVariants = {
  initial: { opacity: 0, y: 15, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planning',
    lead: '',
    members: [], // array of employee IDs
    startDate: '',
    endDate: '',
    color: '#4f46e5'
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name'); // 'name', 'progress', 'endDate'

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [projRes, empRes] = await Promise.all([
        api.get('/projects'),
        api.get('/employees?limit=100')
      ]);

      if (projRes.data.success) setProjects(projRes.data.projects);
      if (empRes.data.success) setEmployees(empRes.data.employees);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch projects and employees.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleMemberSelection = (empId) => {
    setFormData(prev => {
      const members = prev.members.includes(empId)
        ? prev.members.filter(id => id !== empId)
        : [...prev.members, empId];
      return { ...prev, members };
    });
  };

  const openCreateModal = () => {
    setFormData({
      name: '',
      description: '',
      status: 'planning',
      lead: employees[0]?._id || '',
      members: [],
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      color: '#4f46e5'
    });
    setIsCreateOpen(true);
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post('/projects', formData);
      if (res.data.success) {
        setProjects(prev => [res.data.project, ...prev]);
        setIsCreateOpen(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    }
  };

  const openEditModal = (proj) => {
    setCurrentProject(proj);
    setFormData({
      name: proj.name,
      description: proj.description || '',
      status: proj.status,
      lead: proj.lead?._id || '',
      members: proj.members ? proj.members.map(m => m._id) : [],
      startDate: proj.startDate ? proj.startDate.split('T')[0] : '',
      endDate: proj.endDate ? proj.endDate.split('T')[0] : '',
      color: proj.color || '#4f46e5'
    });
    setIsEditOpen(true);
  };

  const handleEditProject = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.put(`/projects/${currentProject._id}`, formData);
      if (res.data.success) {
        setProjects(prev => prev.map(p => p._id === currentProject._id ? res.data.project : p));
        setIsEditOpen(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update project');
    }
  };

  const handleDeleteProject = async (projId) => {
    if (!window.confirm('Are you sure you want to delete this project? Unassigned tasks will remain active but have their project set to null.')) return;
    try {
      const res = await api.delete(`/projects/${projId}`);
      if (res.data.success) {
        setProjects(prev => prev.filter(p => p._id !== projId));
      }
    } catch (err) {
      alert('Failed to delete project');
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'progress') {
      return b.progress - a.progress; // highest progress first
    }
    if (sortBy === 'endDate') {
      if (!a.endDate) return 1;
      if (!b.endDate) return -1;
      return new Date(a.endDate) - new Date(b.endDate); // earliest end date first
    }
    return 0;
  });

  const colors = [
    { name: 'Indigo', value: '#4f46e5' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Emerald', value: '#10b981' },
    { name: 'Amber', value: '#f59e0b' },
    { name: 'Rose', value: '#f43f5e' },
    { name: 'Purple', value: '#8b5cf6' }
  ];

  return (
    <div className="flex flex-col gap-8 text-gray-900 dark:text-[#EDF0FA]">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight font-syne dark:text-white flex items-center gap-2">
            Project <span className="text-blue-600 dark:text-blue-400">Hub</span>
            <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
          </h1>
          <p className="text-sm text-gray-500 dark:text-[#8892B8] mt-1">
            Create high-level organizational initiatives, define teams, and track completion milestones.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-600/10 hover:shadow-blue-600/20 hover:-translate-y-0.5 self-start md:self-auto cursor-pointer"
        >
          <Plus size={16} />
          Create Project
        </button>
      </div>

      {/* MULTI-FILTER BAR */}
      <div className="p-6 bg-gray-50/50 dark:bg-white/[0.01] border border-gray-200 dark:border-white/[0.04] rounded-2xl flex flex-col gap-5">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          
          {/* Search bar */}
          <div className="lg:col-span-5 relative group">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 dark:text-[#8892B8] pointer-events-none group-focus-within:text-blue-500 transition-colors">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search projects by name or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-[13px] pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-white/[0.02] border border-gray-255 dark:border-white/[0.06] hover:border-blue-500/30 text-gray-900 dark:text-[#EDF0FA] placeholder-gray-400/50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200 shadow-sm"
            />
          </div>

          {/* Status Dropdown */}
          <div className="lg:col-span-4 relative group">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 dark:text-[#8892B8] pointer-events-none">
              <Filter size={15} className="text-blue-500" />
            </span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full text-[13px] pl-11 pr-10 py-3 rounded-xl bg-white dark:bg-white/[0.02] border border-gray-255 dark:border-white/[0.06] hover:border-blue-500/30 text-gray-805 dark:text-[#EDF0FA] focus:outline-none cursor-pointer appearance-none shadow-sm font-semibold"
            >
              <option value="All">All Statuses</option>
              <option value="planning">Planning Mode</option>
              <option value="active">Active Projects</option>
              <option value="in_review">In Review</option>
              <option value="completed">Completed Projects</option>
              <option value="on_hold">On Hold</option>
            </select>
            <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-[#5A6282] pointer-events-none">
              <ChevronDown size={15} />
            </span>
          </div>

          {/* Sort dropdown */}
          <div className="lg:col-span-3 relative group">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 dark:text-[#8892B8] pointer-events-none">
              <Clock size={15} className="text-indigo-500" />
            </span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="w-full text-[13px] pl-11 pr-10 py-3 rounded-xl bg-white dark:bg-white/[0.02] border border-gray-255 dark:border-white/[0.06] hover:border-blue-500/30 text-gray-805 dark:text-[#EDF0FA] focus:outline-none cursor-pointer appearance-none shadow-sm font-semibold"
            >
              <option value="name">Sort by Name (A-Z)</option>
              <option value="progress">Sort by Progress (Highest)</option>
              <option value="endDate">Sort by Due Date (Earliest)</option>
            </select>
            <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-450 dark:text-[#5A6282] pointer-events-none">
              <ChevronDown size={15} />
            </span>
          </div>

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
          <p className="text-sm font-bold dark:text-[#EDF0FA]">Loading project files...</p>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredProjects.map(proj => {
              // Pulse color for active projects
              const statusPulsers = {
                completed: 'bg-emerald-500',
                active: 'bg-blue-500',
                in_review: 'bg-amber-500',
                planning: 'bg-gray-400'
              };
              const activePulse = statusPulsers[proj.status] || 'bg-gray-400';

              return (
                <motion.div
                  key={proj._id}
                  variants={cardVariants}
                  layout
                  className="glass-card p-6 flex flex-col justify-between min-h-[260px] relative overflow-hidden group border border-white/[0.04] dark:border-white/[0.06] hover:border-gray-300 dark:hover:border-white/[0.15] hover:shadow-xl hover:shadow-[#4f46e5]/5 hover:-translate-y-0.5 transition-all duration-300"
                  style={{ borderLeft: `5px solid ${proj.color || '#4f46e5'}` }}
                >
                  {/* Decorative folder glow background watermark */}
                  <div 
                    className="absolute -right-10 -top-10 w-24 h-24 rounded-full blur-2xl opacity-10 transition-opacity group-hover:opacity-20"
                    style={{ backgroundColor: proj.color || '#4f46e5' }}
                  />

                  <div>
                    {/* Header bar (Status & Action buttons) */}
                    <div className="flex justify-between items-center gap-4">
                      {/* Status indicator with pulsing dot */}
                      <span className={`inline-flex items-center gap-1.5 text-[9px] px-2.5 py-1 rounded-full border font-extrabold uppercase ${
                        proj.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                        proj.status === 'active' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                        proj.status === 'in_review' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                        'bg-gray-500/10 text-gray-500 border-gray-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${activePulse} ${proj.status === 'active' ? 'animate-pulse' : ''}`} />
                        {proj.status.replace('_', ' ')}
                      </span>

                      {/* Modify Actions overlay */}
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
                        <button
                          onClick={() => openEditModal(proj)}
                          className="p-1.5 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] hover:bg-blue-500/10 text-blue-500 rounded-lg cursor-pointer transition-all hover:scale-105"
                          title="Edit Project"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(proj._id)}
                          className="p-1.5 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] hover:bg-rose-500/10 text-rose-500 rounded-lg cursor-pointer transition-all hover:scale-105"
                          title="Delete Project"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Folder Icon & Title */}
                    <div className="flex items-start gap-3 mt-4">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105 shadow-sm"
                        style={{ 
                          backgroundColor: `${proj.color}12`, 
                          borderColor: `${proj.color}35`, 
                          color: proj.color || '#4f46e5' 
                        }}
                      >
                        <FolderKanban size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-[15px] text-gray-900 dark:text-white font-syne truncate leading-tight group-hover:text-blue-500 transition-colors">
                          {proj.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-[#8892B8] mt-1 line-clamp-2 leading-relaxed">
                          {proj.description || 'No description provided.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progress & Bottom Info Metas */}
                  <div className="mt-6 flex flex-col gap-4">
                    
                    {/* Dynamic Progress Bar */}
                    <div>
                      <div className="flex justify-between items-center text-[10px] text-gray-400 dark:text-[#5A6282] mb-1.5 font-bold tracking-wider">
                        <span>COMPLETION RATE</span>
                        <span className="font-mono text-gray-900 dark:text-white">{proj.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 dark:bg-white/[0.04] border border-gray-200/50 dark:border-white/[0.02] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500 ease-out shadow-inner"
                          style={{ width: `${proj.progress}%`, backgroundColor: proj.color || '#4f46e5' }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[9px] text-gray-450 dark:text-slate-500 mt-1 font-medium">
                        <span>{proj.completedTasks} completed</span>
                        <span>{proj.totalTasks} total tasks</span>
                      </div>
                    </div>

                    {/* Stacked Team Avatar and Lead details */}
                    <div className="flex items-center justify-between border-t border-gray-100 dark:border-white/[0.04] pt-3 text-[11px] text-gray-500 dark:text-[#8892B8]">
                      
                      {/* Project Leader Capsule */}
                      <div className="flex items-center gap-1.5 bg-gray-50/50 dark:bg-white/[0.01] border border-gray-150 dark:border-white/[0.03] px-2.5 py-1 rounded-xl text-[10px] font-bold text-gray-600 dark:text-[#EDF0FA] shadow-sm select-none">
                        <span className="w-4.5 h-4.5 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center text-[8px] font-bold uppercase">{proj.lead?.fullName?.charAt(0) || 'L'}</span>
                        <span className="truncate max-w-[70px]" title={proj.lead?.fullName}>{proj.lead?.fullName || 'No Lead'}</span>
                      </div>

                      {/* Stacked Team members deck */}
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2 overflow-hidden select-none">
                          {proj.members && proj.members.slice(0, 3).map((m, index) => {
                            const initial = m.fullName?.charAt(0) || 'M';
                            return (
                              <div 
                                key={m._id} 
                                className="w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center font-bold text-[8px] text-blue-300 dark:text-blue-200 uppercase shadow-md"
                                title={m.fullName}
                              >
                                {initial}
                              </div>
                            );
                          })}
                          {proj.members && proj.members.length > 3 && (
                            <div className="w-6 h-6 rounded-full bg-slate-700 border-2 border-slate-900 flex items-center justify-center font-extrabold text-[8px] text-white shadow-md">
                              +{proj.members.length - 3}
                            </div>
                          )}
                        </div>
                        
                        {proj.endDate && (
                          <div className="flex items-center gap-1 text-[10px] font-extrabold text-rose-500 bg-rose-500/5 px-2 py-0.5 rounded border border-rose-500/10">
                            <Calendar size={11} />
                            <span>{new Date(proj.endDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
          {filteredProjects.length === 0 && (
            <div className="col-span-3 text-center py-16 text-gray-400 dark:text-[#525F8A]">
              No active initiatives found matching your parameters. Create one to get started!
            </div>
          )}
        </motion.div>
      )}

      {/* CREATE MODAL */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-lg p-8 border border-gray-200 dark:border-white/[0.08] relative"
            >
              <h3 className="text-lg font-extrabold tracking-tight mb-4 font-syne text-gray-900 dark:text-white flex items-center gap-2">
                <FolderKanban className="text-blue-500 w-5 h-5" /> Create New Project
              </h3>
              <form onSubmit={handleCreateProject} className="flex flex-col gap-5">
                <div>
                  <label className="text-[11px] font-extrabold text-gray-400 dark:text-[#5A6282] uppercase tracking-wider block pl-1 mb-1.5">Project Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Aeccentric Web Redevelopment"
                    className="w-full text-sm py-3.5 pl-4 pr-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-250 dark:border-white/[0.06] hover:border-blue-500/30 text-gray-900 dark:text-[#EDF0FA] placeholder-gray-400/50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-sm"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-extrabold text-gray-400 dark:text-[#5A6282] uppercase tracking-wider block pl-1 mb-1.5">Description</label>
                  <textarea
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the initiative's objectives..."
                    className="w-full text-sm py-3.5 pl-4 pr-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-250 dark:border-white/[0.06] hover:border-blue-500/30 text-gray-900 dark:text-[#EDF0FA] placeholder-gray-400/50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-extrabold text-gray-400 dark:text-[#5A6282] uppercase tracking-wider block pl-1 mb-1.5">Project Leader *</label>
                    <div className="relative group">
                      <select
                        name="lead"
                        required
                        value={formData.lead}
                        onChange={handleInputChange}
                        className="w-full text-sm py-3.5 pl-4 pr-10 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-250 dark:border-white/[0.06] hover:border-blue-500/30 text-gray-800 dark:text-[#EDF0FA] focus:outline-none cursor-pointer appearance-none shadow-sm font-semibold"
                      >
                        <option value="">Choose Lead</option>
                        {employees.map(e => (
                          <option key={e._id} value={e._id}>{e.fullName} ({e.designation})</option>
                        ))}
                      </select>
                      <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-450 dark:text-[#5A6282] pointer-events-none">
                        <ChevronDown size={14} />
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-extrabold text-gray-400 dark:text-[#5A6282] uppercase tracking-wider block pl-1 mb-1.5">Theme Color</label>
                    <div className="flex gap-2.5 items-center h-12 justify-center pl-2">
                      {colors.map(c => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, color: c.value }))}
                          className="w-7 h-7 rounded-full border border-white/20 hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-sm relative group/theme"
                          style={{ backgroundColor: c.value }}
                          title={c.name}
                        >
                          {formData.color === c.value && <Check size={14} className="text-white font-bold" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-extrabold text-gray-400 dark:text-[#5A6282] uppercase tracking-wider block pl-1 mb-1.5">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full text-sm py-3.5 pl-4 pr-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-250 dark:border-white/[0.06] hover:border-blue-500/30 text-gray-805 dark:text-[#EDF0FA] focus:outline-none shadow-sm cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-extrabold text-gray-400 dark:text-[#5A6282] uppercase tracking-wider block pl-1 mb-1.5">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full text-sm py-3.5 pl-4 pr-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-250 dark:border-white/[0.06] hover:border-blue-500/30 text-gray-805 dark:text-[#EDF0FA] focus:outline-none shadow-sm cursor-pointer"
                    />
                  </div>
                </div>

                {/* Members Checklist */}
                <div>
                  <label className="text-[11px] font-extrabold text-gray-400 dark:text-[#5A6282] uppercase tracking-wider block pl-1 mb-2">Assign Team Members</label>
                  <div className="max-h-36 overflow-y-auto border border-gray-200 dark:border-white/[0.06] rounded-xl p-3.5 bg-gray-50 dark:bg-white/[0.02] grid grid-cols-2 gap-2.5 custom-scrollbar">
                    {employees.map(e => (
                      <label key={e._id} className="flex items-center gap-2 text-xs cursor-pointer select-none hover:text-blue-500 transition-colors p-1 rounded hover:bg-blue-500/5">
                        <input
                          type="checkbox"
                          checked={formData.members.includes(e._id)}
                          onChange={() => toggleMemberSelection(e._id)}
                          className="rounded dark:bg-white/5 border-gray-300 dark:border-white/10 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="truncate font-semibold text-gray-700 dark:text-[#EDF0FA]">{e.fullName}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/[0.04] mt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="px-5 py-2.5 bg-gray-100 dark:bg-white/[0.04] hover:bg-gray-200 text-gray-700 dark:text-[#EDF0FA] rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/10 cursor-pointer"
                  >
                    Save Project
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {isEditOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-lg p-8 border border-gray-200 dark:border-white/[0.08] relative"
            >
              <h3 className="text-lg font-extrabold tracking-tight mb-4 font-syne text-gray-900 dark:text-white flex items-center gap-2">
                <FolderKanban className="text-blue-500 w-5 h-5" /> Edit Project Details
              </h3>
              <form onSubmit={handleEditProject} className="flex flex-col gap-5">
                <div>
                  <label className="text-[11px] font-extrabold text-gray-400 dark:text-[#5A6282] uppercase tracking-wider block pl-1 mb-1.5">Project Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full text-sm py-3.5 pl-4 pr-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-255 dark:border-white/[0.06] hover:border-blue-500/30 text-gray-900 dark:text-[#EDF0FA] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-sm"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-extrabold text-gray-400 dark:text-[#5A6282] uppercase tracking-wider block pl-1 mb-1.5">Description</label>
                  <textarea
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full text-sm py-3.5 pl-4 pr-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-255 dark:border-white/[0.06] hover:border-blue-500/30 text-gray-900 dark:text-[#EDF0FA] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-extrabold text-gray-400 dark:text-[#5A6282] uppercase tracking-wider block pl-1 mb-1.5">Project Status</label>
                    <div className="relative group">
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full text-sm py-3.5 pl-4 pr-10 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-255 dark:border-white/[0.06] hover:border-blue-500/30 text-gray-805 dark:text-[#EDF0FA] focus:outline-none cursor-pointer appearance-none shadow-sm font-semibold"
                      >
                        <option value="planning">Planning</option>
                        <option value="active">Active</option>
                        <option value="in_review">In Review</option>
                        <option value="completed">Completed</option>
                        <option value="on_hold">On Hold</option>
                      </select>
                      <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-455 dark:text-[#5A6282] pointer-events-none">
                        <ChevronDown size={14} />
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-extrabold text-gray-400 dark:text-[#5A6282] uppercase tracking-wider block pl-1 mb-1.5">Theme Color</label>
                    <div className="flex gap-2.5 items-center h-12 justify-center pl-2">
                      {colors.map(c => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, color: c.value }))}
                          className="w-7 h-7 rounded-full border border-white/20 hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-sm relative group/theme"
                          style={{ backgroundColor: c.value }}
                          title={c.name}
                        >
                          {formData.color === c.value && <Check size={14} className="text-white font-bold" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-extrabold text-gray-400 dark:text-[#5A6282] uppercase tracking-wider block pl-1 mb-1.5">Project Leader *</label>
                    <div className="relative group">
                      <select
                        name="lead"
                        required
                        value={formData.lead}
                        onChange={handleInputChange}
                        className="w-full text-sm py-3.5 pl-4 pr-10 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-255 dark:border-white/[0.06] hover:border-blue-500/30 text-gray-805 dark:text-[#EDF0FA] focus:outline-none cursor-pointer appearance-none shadow-sm font-semibold"
                      >
                        {employees.map(e => (
                          <option key={e._id} value={e._id}>{e.fullName}</option>
                        ))}
                      </select>
                      <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-450 dark:text-[#5A6282] pointer-events-none">
                        <ChevronDown size={14} />
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-extrabold text-gray-400 dark:text-[#5A6282] uppercase tracking-wider block pl-1 mb-1.5">Start Date</label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        className="w-full text-xs py-3 rounded-lg bg-gray-50 dark:bg-white/[0.02] border border-gray-250 dark:border-white/[0.06] hover:border-blue-500/30 text-gray-805 dark:text-[#EDF0FA] focus:outline-none shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-extrabold text-gray-400 dark:text-[#5A6282] uppercase tracking-wider block pl-1 mb-1.5">End Date</label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        className="w-full text-xs py-3 rounded-lg bg-gray-50 dark:bg-white/[0.02] border border-gray-250 dark:border-white/[0.06] hover:border-blue-500/30 text-gray-805 dark:text-[#EDF0FA] focus:outline-none shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-extrabold text-gray-400 dark:text-[#5A6282] uppercase tracking-wider block pl-1 mb-2">Assign Team Members</label>
                  <div className="max-h-32 overflow-y-auto border border-gray-200 dark:border-white/[0.06] rounded-xl p-3.5 bg-gray-50 dark:bg-white/[0.02] grid grid-cols-2 gap-2.5 custom-scrollbar">
                    {employees.map(e => (
                      <label key={e._id} className="flex items-center gap-2 text-xs cursor-pointer select-none hover:text-blue-500 transition-colors p-1 rounded hover:bg-blue-500/5">
                        <input
                          type="checkbox"
                          checked={formData.members.includes(e._id)}
                          onChange={() => toggleMemberSelection(e._id)}
                          className="rounded dark:bg-white/5 border-gray-300 dark:border-white/10 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="truncate font-semibold text-gray-700 dark:text-[#EDF0FA]">{e.fullName}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/[0.04] mt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    className="px-5 py-2.5 bg-gray-100 dark:bg-white/[0.04] hover:bg-gray-200 text-gray-700 dark:text-[#EDF0FA] rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/10 cursor-pointer"
                  >
                    Update Project
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
