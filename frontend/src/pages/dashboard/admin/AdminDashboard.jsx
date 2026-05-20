import React from 'react';
import StatCard from '../../../components/dashboard/StatCard';
import ActivityCard from '../../../components/dashboard/ActivityCard';
import ProjectCard from '../../../components/dashboard/ProjectCard';
import { Users, FolderKanban, TrendingUp, Bell } from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    { title: 'Total Workforce', value: '248', change: '+12%', icon: <Users size={24} />, accent: '#2563EB' },
    { title: 'Project Load', value: '42', change: '+5%', icon: <FolderKanban size={24} />, accent: '#1D4ED8' },
    { title: 'Quarterly Revenue', value: '$1.2M', change: '+18%', icon: <TrendingUp size={24} />, accent: '#10B981' },
    { title: 'Security Alerts', value: '0', change: 'Stable', icon: <Bell size={24} />, accent: '#F43F5E' },
  ];

  const recentActivity = [
    { action: 'Sarah Jenkins completed task "UI Design"', target: 'Project Alpha', time: '2 hours ago' },
    { action: 'New employee onboarded', target: 'Michael Chen', time: '5 hours ago' },
    { action: 'Project milestone reached', target: 'Website Redesign', time: '1 day ago' },
    { action: 'Weekly report generated', target: 'System Admin', time: '2 days ago' },
  ];

  return (
    <div className="space-y-12">
      {/* Admin Hero Section */}
      <div className="bg-[#0B1A2B] rounded-[40px] p-10 sm:p-16 text-white shadow-[0_30px_60px_rgba(0,0,0,0.25)] relative overflow-hidden group">
        {/* Complex Animated Backgrounds */}
        <div className="absolute top-[-40%] right-[-10%] w-[600px] h-[600px] bg-[#2563EB] blur-[150px] opacity-20 rounded-full animate-pulse pointer-events-none" />
        <div className="absolute bottom-[-30%] left-[-10%] w-[400px] h-[400px] bg-indigo-500 blur-[120px] opacity-15 rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              <span className="text-[11px] font-black tracking-[0.2em] uppercase text-blue-100">Executive Command Center</span>
            </div>
            
            <h2 className="text-4xl sm:text-6xl font-black mb-6 tracking-tight leading-[1.05]">
              Hello, <span className="text-blue-400">Admin.</span><br />
              <span className="opacity-80">Everything is under control.</span>
            </h2>
            <p className="text-white/40 text-[18px] leading-relaxed font-medium max-w-xl">
              All systems are operational. You have <span className="text-white">4 active sprints</span> and <span className="text-white">12 pending approvals</span> today.
            </p>
          </div>

          <div className="flex gap-4">
            <button className="px-8 py-4 rounded-[20px] bg-[#2563EB] text-white text-[14px] font-black tracking-widest hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:-translate-y-1 transition-all uppercase">
              Launch Report
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[24px] font-black text-[#0F172A] tracking-tight">Project Portfolio</h3>
              <p className="text-[#64748b] text-[14px] font-medium mt-1">Real-time status of all active organization initiatives.</p>
            </div>
            <button className="text-[#2563EB] text-[14px] font-black uppercase tracking-widest hover:underline">Manage All</button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <ProjectCard name="AECCENTRIC Website Redesign" status="Active" progress={75} members={4} />
            <ProjectCard name="Enterprise EMS System" status="Active" progress={40} members={8} />
            <ProjectCard name="Client X Dashboard" status="On Hold" progress={20} members={3} />
            <ProjectCard name="AI Model Training" status="Completed" progress={100} members={5} />
          </div>
        </div>

        {/* Sidebar Activity Area */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
             <h4 className="text-[14px] font-black uppercase tracking-widest text-slate-400 mb-6">Quick Actions</h4>
             <div className="grid grid-cols-2 gap-4">
                <button className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 hover:text-blue-600 transition-all text-center">
                   <div className="text-[20px] mb-2">âž•</div>
                   <span className="text-[12px] font-black uppercase">Add Staff</span>
                </button>
                <button className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 hover:text-blue-600 transition-all text-center">
                   <div className="text-[20px] mb-2">ðŸ“‚</div>
                   <span className="text-[12px] font-black uppercase">New Project</span>
                </button>
             </div>
          </div>
          <ActivityCard title="Organization Activity" activities={recentActivity} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
