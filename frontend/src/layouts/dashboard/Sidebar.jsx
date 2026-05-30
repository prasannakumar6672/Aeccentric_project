import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, FolderKanban, CheckSquare, BarChart3,
  Settings, LogOut, ChevronLeft, Search,
  Bot, Shield, CreditCard, MessageSquare, Calendar, Zap,
  FileText, CalendarDays, Clock, Plane, Receipt, Megaphone,
  Bell, UserCircle, WalletCards, Timer
} from 'lucide-react';
import { navItemHover, sidebarVariants, staggerItem, tapFeedback } from '../../lib/motion';

const mainLinks = [
  { name: 'Overview',   icon: LayoutDashboard, path: '/dashboard/admin',             end: true },
  { name: 'Employees',  icon: Users,            path: '/dashboard/admin/employees' },
  { name: 'Attendance', icon: Clock,            path: '/dashboard/admin/attendance' },
  { name: 'Projects',   icon: FolderKanban,     path: '/dashboard/admin/projects' },
  { name: 'Tasks',      icon: CheckSquare,      path: '/dashboard/admin/tasks' },
  { name: 'Leaves',     icon: CalendarDays,     path: '/dashboard/admin/leaves' },
  { name: 'Analytics',  icon: BarChart3,        path: '/dashboard/admin/analytics' },
];

const platformLinks = [
  { name: 'AI Copilot', icon: Bot, path: '/dashboard/admin/ai' },
  { name: 'Reports', icon: FileText, path: '/dashboard/admin/reports' },
  { name: 'Finance', icon: CreditCard, path: '/dashboard/admin/finance' },
  { name: 'Security', icon: Shield, path: '/dashboard/admin/security' },
  { name: 'Messages', icon: MessageSquare, path: '/dashboard/admin/messages', badge: 5 },
  { name: 'Calendar', icon: Calendar, path: '/dashboard/admin/calendar' },
];

const systemLinks = [
  { name: 'Integrations', icon: Zap,      path: '/dashboard/admin/integrations' },
  { name: 'Settings',     icon: Settings, path: '/dashboard/admin/settings' },
];

/* ── NAV ITEM ──────────────────────────────────────────────── */
const NavItem = ({ link, compact, onClose, index = 0 }) => {
  const Icon = link.icon;
  return (
    <motion.div {...staggerItem(index)}>
    <NavLink
      to={link.path}
      end={link.end}
      onClick={onClose}
      className={({ isActive }) =>
        `group relative flex h-9 items-center rounded-[10px]
         ${compact ? 'justify-center' : 'gap-2.5'}
         ${isActive
           ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/[0.12] dark:text-blue-400 font-semibold'
           : 'text-gray-500 dark:text-slate-500 hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-white/[0.04] dark:hover:text-slate-200 font-medium'
         }`
      }
    >
      {({ isActive }) => (
        <motion.div
          {...(!isActive ? navItemHover : {})}
          className={`relative flex h-9 w-full items-center rounded-[10px] ${compact ? 'justify-center' : 'gap-2.5 px-3'}`}
        >
          {/* Active bar */}
          {isActive && (
            <motion.div
              layoutId="sidebar-pill"
              className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-blue-600 dark:bg-blue-400"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}

          <Icon size={18} className="shrink-0" />

          {!compact && (
            <>
              <span className="flex-1 truncate text-[13px]">{link.name}</span>
              {link.badge && (
                <span className={`min-w-[22px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-bold px-1.5 tabular-nums ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300'
                    : 'bg-gray-100 text-gray-500 dark:bg-white/[0.07] dark:text-slate-500'
                }`}>
                  {link.badge}
                </span>
              )}
            </>
          )}

          {/* Compact badge dot */}
          {compact && link.badge && (
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-blue-500" />
          )}

          {/* Compact tooltip */}
          {compact && (
            <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 dark:bg-slate-800 text-white text-[12px] font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 whitespace-nowrap pointer-events-none shadow-xl z-50">
              {link.name}
              {link.badge && <span className="ml-1.5 text-blue-400 font-bold">({link.badge})</span>}
            </div>
          )}
        </motion.div>
      )}
    </NavLink>
    </motion.div>
  );
};

/* ── SECTION DIVIDER ──────────────────────────────────────────── */
const SectionGroup = ({ label, links, compact, onClose }) => (
  <div>
    {!compact ? (
      <div className="px-2 mb-1">
        <span className="text-[9.5px] font-bold tracking-[0.14em] uppercase text-gray-400/70 dark:text-slate-600">
          {label}
        </span>
      </div>
    ) : (
      <div className="h-px bg-gray-100 dark:bg-white/[0.05] mx-2 mb-2" />
    )}
    <div className="space-y-0.5">
      {links.map((link, index) => (
        <NavItem key={link.name} link={link} compact={compact} onClose={onClose} index={index} />
      ))}
    </div>
  </div>
);

/* ── SIDEBAR CONTENT ──────────────────────────────────────────── */
const SidebarContent = ({ compact = false, role, onClose, onToggleCollapse, onOpenPalette, handleLogout }) => {
  const userStr = localStorage.getItem('ems_user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isEmployee = role === 'employee';

  const employeeGroups = [
    {
      label: 'My Workspace',
      links: [
        { name: 'Overview', icon: LayoutDashboard, path: '/dashboard/employee', end: true },
        { name: 'My Tasks', icon: CheckSquare, path: '/dashboard/employee/tasks' },
        { name: 'My Projects', icon: FolderKanban, path: '/dashboard/employee/projects' },
        { name: 'Messages', icon: MessageSquare, path: '/dashboard/employee/messages', badge: 3 },
      ],
    },
    {
      label: 'Work & Time',
      links: [
        { name: 'Attendance', icon: CalendarDays, path: '/dashboard/employee/attendance' },
        { name: 'My Leaves', icon: Plane, path: '/dashboard/employee/leaves' },
        { name: 'Timesheets', icon: Timer, path: '/dashboard/employee/timesheets' },
        { name: 'My Performance', icon: BarChart3, path: '/dashboard/employee/performance' },
      ],
    },
    {
      label: 'Finance',
      links: [
        { name: 'My Salary', icon: WalletCards, path: '/dashboard/employee/salary' },
        { name: 'Expenses', icon: Receipt, path: '/dashboard/employee/expenses' },
      ],
    },
    {
      label: 'Communication',
      links: [
        { name: 'Announcements', icon: Megaphone, path: '/dashboard/employee/announcements' },
        { name: 'Meetings', icon: Calendar, path: '/dashboard/employee/meetings' },
        { name: 'Notifications', icon: Bell, path: '/dashboard/employee/notifications', badge: 5 },
      ],
    },
    {
      label: 'Profile',
      links: [
        { name: 'My Profile', icon: UserCircle, path: '/dashboard/employee/profile' },
        { name: 'Settings', icon: Settings, path: '/dashboard/employee/settings' },
      ],
    },
  ];

  const visibleMainLinks = isEmployee ? [] : mainLinks;
  const visiblePlatformLinks = isEmployee ? [] : platformLinks;
  const visibleSystemLinks = isEmployee ? [] : systemLinks;

  const userDisplayName = user?.fullName || user?.email?.split('@')[0] || (isEmployee ? 'Employee User' : 'Admin User');
  const userEmail = user?.email || (isEmployee ? 'employee@aeccentric.com' : 'admin@aeccentric.com');
  const userInitials = userDisplayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <motion.div
      {...sidebarVariants}
      className="sidebar-shell flex flex-col"
      style={{ height: '100vh', width: compact ? 'var(--sidebar-w-collapsed)' : 'var(--sidebar-w)' }}
    >
      {/* ── TOP SECTION (height: 56px) ── */}
      <div 
        className="flex items-center shrink-0" 
        style={{ height: '64px', padding: '0 16px', borderBottom: '1px solid var(--border-default)', justifyContent: compact ? 'center' : 'space-between' }}
      >
        {!compact ? (
          <>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white dark:bg-white/[0.06] border border-gray-200 dark:border-white/[0.08] flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                <img src="/logo.png" alt="AE" className="h-6 w-6 object-contain" />
              </div>
              <div>
                <div className="text-[12.5px] font-bold tracking-tight text-gray-900 dark:text-white leading-none">AECCENTRIC</div>
                <div className="text-[8px] font-black uppercase tracking-[0.15em] text-blue-600 dark:text-blue-400 mt-0.5">Enterprise EMS</div>
              </div>
            </div>
            <motion.button
              {...tapFeedback}
              onClick={onToggleCollapse}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-150 dark:hover:bg-white/[0.06] hover:text-gray-600 dark:hover:text-slate-350 transition-all shrink-0 cursor-pointer"
            >
              <ChevronLeft size={14} />
            </motion.button>
          </>
        ) : (
          <div className="w-8 h-8 rounded-lg bg-white dark:bg-white/[0.06] border border-gray-200 dark:border-white/[0.08] flex items-center justify-center overflow-hidden shadow-sm">
            <img src="/logo.png" alt="AE" className="h-6 w-6 object-contain" />
          </div>
        )}
      </div>

      {/* ── SEARCH ROW (height: 52px, padding: 8px 12px) ── */}
      <div className="shrink-0" style={{ height: '52px', padding: '8px 12px' }}>
        {!compact ? (
          <button
            onClick={onOpenPalette}
            className="w-full flex items-center gap-2 h-[36px] px-3 rounded-lg bg-[var(--surface-L2)] border border-[var(--border-default)] text-gray-400 dark:text-slate-500 text-[12px] hover:border-[var(--border-hover)] transition-all cursor-pointer"
          >
            <Search size={13} />
            <span className="flex-1 text-left font-medium">Search console...</span>
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/[0.06] text-[9.5px] font-bold border border-gray-250 dark:border-white/[0.08] text-gray-450">
              Ctrl K
            </kbd>
          </button>
        ) : (
          <button
            onClick={onOpenPalette}
            className="w-full flex items-center justify-center h-[36px] rounded-lg bg-[var(--surface-L2)] border border-[var(--border-default)] text-gray-400 dark:text-slate-500 hover:border-[var(--border-hover)] transition-all cursor-pointer"
          >
            <Search size={14} />
          </button>
        )}
      </div>

      {/* ── NAVIGATION ── */}
      <nav className="flex-1 px-3 py-1 overflow-y-auto custom-scrollbar space-y-4">
        {isEmployee ? (
          employeeGroups.map(group => (
            <SectionGroup key={group.label} label={group.label} links={group.links} compact={compact} onClose={onClose} />
          ))
        ) : (
          <>
            <SectionGroup label="Main"     links={visibleMainLinks}     compact={compact} onClose={onClose} />
            {visiblePlatformLinks.length > 0 && (
              <SectionGroup label="Platform" links={visiblePlatformLinks} compact={compact} onClose={onClose} />
            )}
            <SectionGroup label="System"   links={visibleSystemLinks}   compact={compact} onClose={onClose} />
          </>
        )}
      </nav>

      {/* ── BOTTOM PROFILE SECTION (fixed bottom, height: 72px) ── */}
      <div 
        className="shrink-0 animate-fade-in"
        style={{ height: '72px', borderTop: '1px solid var(--border-default)', padding: '14px 16px' }}
      >
        {!compact ? (
          <div className="flex items-center justify-between gap-2 h-full">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-[11px] font-bold text-white shrink-0 shadow-sm">
                {userInitials}
              </div>
              <div className="flex-1 min-w-0 leading-tight">
                <div className="text-[12.5px] font-bold text-gray-900 dark:text-slate-200 truncate">{userDisplayName}</div>
                <div className="mt-0.5 flex items-center gap-1.5 min-w-0">
                  <span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-[8.5px] font-black uppercase text-blue-600 dark:bg-blue-500/10 dark:text-blue-300 shrink-0">
                    {isEmployee ? 'Employee' : 'Admin'}
                  </span>
                  <span className="truncate text-[10px] text-gray-450 dark:text-slate-500">{userEmail}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-gray-400 hover:bg-rose-50 dark:hover:bg-rose-500/[0.06] hover:text-rose-600 dark:hover:text-rose-450 transition-colors shrink-0 cursor-pointer"
              title="Sign out"
            >
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5 justify-center h-full">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm shrink-0">
              {userInitials}
            </div>
            <button
              onClick={handleLogout}
              className="p-1 rounded-lg text-gray-455 hover:bg-rose-50 dark:hover:bg-rose-500/[0.06] hover:text-rose-600 dark:hover:text-rose-400 transition-colors shrink-0 cursor-pointer"
              title="Sign out"
            >
              <LogOut size={13} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
/* ── SIDEBAR EXPORT ────────────────────────────────────────── */
const Sidebar = ({ isOpen, onClose, role, collapsed, onToggleCollapse, onOpenPalette }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('ems_token');
    localStorage.removeItem('ems_user');
    navigate('/ems-login');
  };

  const props = { role, onClose, onToggleCollapse, onOpenPalette, handleLogout };

  return (
    <>
      {/* Desktop - rendered inside a fixed wrapper in DashboardLayout */}
      <div className="hidden lg:block h-full">
        <SidebarContent compact={collapsed} {...props} />
      </div>

      {/* Mobile - full overlay slide-in */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 35 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 shadow-2xl"
            >
              <SidebarContent compact={false} {...props} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
