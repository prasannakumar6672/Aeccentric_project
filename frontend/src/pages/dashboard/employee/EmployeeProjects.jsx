import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Folder, Users, Briefcase, AlertCircle, Clock, Target, Zap } from 'lucide-react';
import api from '../../../services/api';
import { demoProjects } from './employeeWorkspaceData';

export default function EmployeeProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await api.get('/projects/my');
      if (res.data.success) {
        setProjects(res.data.projects?.length ? res.data.projects : demoProjects);
      }
    } catch (err) {
      console.error(err);
      setProjects(demoProjects);
      setError('Failed to fetch your assigned projects.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dash-page flex flex-col gap-6 text-gray-900 dark:text-[#EDF0FA]">
      
      {/* HEADER */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight font-syne dark:text-white flex items-center gap-2">
          My <span className="text-blue-600 dark:text-blue-400">Projects</span>
        </h1>
        <p className="text-sm text-gray-500 dark:text-[#8892B8] mt-1">
          Track milestones, progress, and team details for projects you participate in.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {[
          ['Active Projects', projects.length, Folder, '#2563eb'],
          ['Avg Progress', projects.length ? Math.round(projects.reduce((s, p) => s + (p.progress || 0), 0) / projects.length) + '%' : '0%', Target, '#10b981'],
          ['Open Tasks', projects.reduce((s, p) => s + (p.openTasks || Math.max((p.totalTasks || 0) - (p.completedTasks || 0), 0)), 0), Clock, '#f59e0b'],
          ['Critical Focus', projects.filter(p => ['Critical', 'High'].includes(p.priority)).length, Zap, '#ef4444'],
        ].map(([label, value, Icon, color]) => (
          <div key={label} className="glass-card flex min-h-[112px] flex-col justify-between p-5">
            <div className="grid h-9 w-9 place-items-center rounded-xl" style={{ color, backgroundColor: `${color}14` }}><Icon size={18} /></div>
            <div>
              <div className="text-2xl font-black text-gray-950 dark:text-white">{value}</div>
              <div className="text-xs font-bold text-gray-500 dark:text-slate-400">{label}</div>
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
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {projects.map(proj => (
            <motion.div
              key={proj._id}
              layout
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card flex min-h-[300px] flex-col justify-between p-6 cursor-pointer hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] hover:scale-[1.01] transition-all duration-300"
              style={{ borderLeft: `4px solid ${proj.color || '#4f46e5'}` }}
              onClick={() => setSelectedProject(proj)}
            >
              <div>
                <div className="flex justify-between items-start gap-4">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase ${
                    proj.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                    proj.status === 'active' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                    proj.status === 'in_review' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                    'bg-gray-500/10 text-gray-500 border-gray-500/20'
                  }`}>
                    {proj.status.replace('_', ' ')}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black text-slate-500 dark:bg-white/[0.06] dark:text-slate-300">
                    {proj.priority || 'Medium'}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-gray-900 dark:text-white mt-3 font-syne truncate">
                  {proj.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-[#8892B8] mt-1.5 line-clamp-2">
                  {proj.description || 'No description provided.'}
                </p>
                <div className="mt-4 rounded-xl border border-blue-500/10 bg-blue-50/70 p-3 text-[11px] font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                  {proj.aiInsight || 'AI insight: focus on open tasks closest to the project deadline.'}
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-4">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between items-center text-[10px] text-gray-500 dark:text-[#8892B8] mb-1 font-bold">
                    <span>PROGRESS</span>
                    <span>{proj.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 dark:bg-white/[0.05] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${proj.progress}%`, backgroundColor: proj.color || '#4f46e5' }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[9px] text-gray-400 mt-1">
                    <span>{proj.completedTasks || 0} completed</span>
                    <span>{proj.totalTasks || 0} total tasks</span>
                  </div>
                </div>

                {/* Date & Members */}
                <div className="flex items-center justify-between border-t border-gray-100 dark:border-white/[0.04] pt-3 text-[11px] text-gray-500 dark:text-[#8892B8]">
                  <div className="flex items-center gap-1.5">
                    <Briefcase size={11} className="text-gray-400" />
                    <span className="font-medium truncate max-w-[90px]">{proj.lead?.fullName || 'No Lead'}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Users size={11} className="text-gray-400" />
                      <span>{proj.members ? proj.members.length : 0} team</span>
                    </div>
                    {proj.endDate && (
                      <div className="flex items-center gap-1 text-[10px] font-semibold text-rose-500">
                        <Calendar size={11} />
                        <span>{new Date(proj.endDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </motion.div>
          ))}

          {projects.length === 0 && (
            <div className="col-span-3 text-center py-12 text-gray-400 dark:text-[#525F8A]">
              No active projects assigned yet. Contact your lead to get added to the next sprint.
            </div>
          )}
        </div>
      )}

      {/* Dynamic Project Details Modal Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative w-full max-w-2xl bg-white dark:bg-[#0d1526] rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header Accent Bar */}
              <div className="h-1.5 w-full shrink-0" style={{ backgroundColor: selectedProject.color || '#4f46e5' }} />

              {/* Close Button & Header */}
              <div className="flex justify-between items-start p-6 pb-4 shrink-0">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-bold uppercase ${
                      selectedProject.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                      selectedProject.status === 'active' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                      selectedProject.status === 'in_review' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                      'bg-gray-500/10 text-gray-500 border-gray-500/20'
                    }`}>
                      {selectedProject.status.replace('_', ' ')}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black text-slate-500 dark:bg-white/[0.06] dark:text-slate-300">
                      {selectedProject.priority || 'Medium'}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black font-syne text-slate-900 dark:text-white leading-tight">
                    {selectedProject.name}
                  </h2>
                  {selectedProject.client && (
                    <p className="text-xs text-slate-400 dark:text-slate-555 mt-0.5">
                      Client: <span className="font-semibold text-slate-605 dark:text-slate-400">{selectedProject.client}</span>
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-white/[0.06] hover:bg-slate-100 dark:hover:bg-white/[0.04] text-slate-455 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar flex flex-col gap-6">
                
                {/* Description */}
                <div>
                  <h4 className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-2">Description</h4>
                  <p className="text-xs text-slate-605 dark:text-[#a0aec0] leading-relaxed font-medium">
                    {selectedProject.description || 'No description provided.'}
                  </p>
                </div>

                {/* Milestones & Progress */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 rounded-xl bg-slate-50/50 dark:bg-white/[0.01] border border-slate-200/50 dark:border-white/[0.03]">
                  <div>
                    <div className="flex justify-between items-center text-[10px] text-slate-455 dark:text-slate-500 font-bold mb-1.5">
                      <span>PROGRESS</span>
                      <span className="text-slate-700 dark:text-slate-350">{selectedProject.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${selectedProject.progress}%`, backgroundColor: selectedProject.color || '#4f46e5' }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2 font-semibold">
                      <span>{selectedProject.completedTasks || 0} Completed</span>
                      <span>{selectedProject.totalTasks || 0} Total Tasks</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-slate-200/60 dark:border-white/[0.06] pt-3 md:pt-0 md:pl-5">
                    {selectedProject.startDate && (
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <Calendar size={13} className="text-slate-400 shrink-0" />
                        <span>Started: <strong className="font-semibold text-slate-755 dark:text-slate-300">{new Date(selectedProject.startDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}</strong></span>
                      </div>
                    )}
                    {selectedProject.endDate && (
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <Calendar size={13} className="text-rose-500 shrink-0" />
                        <span>Deadline: <strong className="font-semibold text-rose-500">{new Date(selectedProject.endDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}</strong></span>
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Insight */}
                {selectedProject.aiInsight && (
                  <div className="rounded-xl border border-blue-500/10 bg-blue-50/50 p-4 text-xs leading-relaxed text-blue-755 dark:bg-blue-500/[0.08] dark:text-blue-300 flex items-start gap-3">
                    <Zap size={15} className="shrink-0 mt-0.5 text-blue-500" />
                    <div>
                      <span className="font-bold block mb-0.5 text-blue-800 dark:text-blue-200">AI Insight</span>
                      {selectedProject.aiInsight}
                    </div>
                  </div>
                )}

                {/* Project Lead */}
                {selectedProject.lead && (
                  <div>
                    <h4 className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-3">Project Lead</h4>
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200/50 dark:border-white/[0.03] bg-slate-50/30 dark:bg-white/[0.005]">
                      <div className="w-10 h-10 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center font-bold text-blue-600 dark:text-blue-400 shrink-0">
                        {selectedProject.lead.fullName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-sm text-slate-905 dark:text-white truncate">
                            {selectedProject.lead.fullName}
                          </h5>
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            selectedProject.lead.status === 'Online' ? 'bg-emerald-500 animate-pulse' :
                            selectedProject.lead.status === 'In Meeting' ? 'bg-amber-500' :
                            selectedProject.lead.status === 'Away' ? 'bg-amber-400 animate-pulse' : 'bg-slate-400'
                          }`} />
                        </div>
                        <p className="text-xs text-slate-455 dark:text-slate-550 truncate">
                          {selectedProject.lead.designation || 'Project Lead'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Team Members */}
                {selectedProject.members && selectedProject.members.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-3">
                      Team Members ({selectedProject.members.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedProject.members.map(member => (
                        <div key={member._id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200/50 dark:border-white/[0.03] bg-slate-50/20 dark:bg-white/[0.002] hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-all">
                          <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/[0.04] border border-slate-250/20 dark:border-white/[0.03] flex items-center justify-center font-semibold text-xs text-slate-700 dark:text-slate-300 shrink-0">
                            {member.fullName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h5 className="font-semibold text-xs text-slate-905 dark:text-white truncate">
                                {member.fullName}
                              </h5>
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                member.status === 'Online' ? 'bg-emerald-500 animate-pulse' :
                                member.status === 'In Meeting' ? 'bg-amber-500' :
                                member.status === 'Away' ? 'bg-amber-400 animate-pulse' : 'bg-slate-400'
                              }`} />
                            </div>
                            <p className="text-[10px] text-slate-455 dark:text-slate-550 truncate">
                              {member.designation || 'Contributor'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
