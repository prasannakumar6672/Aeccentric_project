import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FolderKanban, CheckSquare, BarChart3, Settings, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isOpen, onClose, role }) => {
  const navigate = useNavigate();

  const adminLinks = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboard/admin' },
    { name: 'Employees', icon: <Users size={18} />, path: '/dashboard/admin/employees' },
    { name: 'Projects', icon: <FolderKanban size={18} />, path: '/dashboard/admin/projects' },
    { name: 'Tasks', icon: <CheckSquare size={18} />, path: '/dashboard/admin/tasks' },
    { name: 'Analytics', icon: <BarChart3 size={18} />, path: '/dashboard/admin/analytics' },
    { name: 'Settings', icon: <Settings size={18} />, path: '/dashboard/admin/settings' },
  ];

  const employeeLinks = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboard/employee' },
    { name: 'My Tasks', icon: <CheckSquare size={18} />, path: '/dashboard/employee/tasks' },
    { name: 'Projects', icon: <FolderKanban size={18} />, path: '/dashboard/employee/projects' },
    { name: 'Profile', icon: <User size={18} />, path: '/dashboard/employee/profile' },
    { name: 'Settings', icon: <Settings size={18} />, path: '/dashboard/employee/settings' },
  ];

  const isAdmin = ['super_admin', 'admin', 'hr'].includes(role);
  const links = isAdmin ? adminLinks : employeeLinks;

  const handleLogout = () => {
    localStorage.removeItem('ems_token');
    localStorage.removeItem('ems_user');
    navigate('/ems-login');
  };

  const SidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-gray-100 w-[260px] py-8">
      {/* Logo */}
      <div className="px-8 mb-12">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#0F172A] flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white rounded-sm" />
          </div>
          <span className="text-[#0F172A] text-[16px] font-black uppercase tracking-wider">
            AECCENTRIC
          </span>
        </div>
        <div className="mt-1 px-11">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#2563EB]">
            {role} Portal
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            end={link.path === '/dashboard/admin' || link.path === '/dashboard/employee'}
            onClick={() => onClose?.()}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-bold transition-all duration-300
              ${isActive 
                ? 'bg-[#2563EB]/10 text-[#2563EB]' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-[#0F172A]'
              }
            `}
          >
            {link.icon}
            {link.name}
          </NavLink>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="px-4 pt-8 mt-auto">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-[13px] font-bold text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-300"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-screen sticky top-0">
        {SidebarContent}
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 shadow-2xl"
            >
              {SidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
