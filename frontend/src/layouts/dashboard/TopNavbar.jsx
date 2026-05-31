import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, Search, Menu, Sun, Moon, Plus, ChevronRight,
  Check, AlertTriangle, Info, MessageSquare, X, Calendar, LogOut, Settings, User
} from 'lucide-react';
import api from '../../services/api';
import { tapFeedback, topbarVariants } from '../../lib/motion';

const getRelativeTimeString = (date) => {
  if (!date) return 'now';
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
};

const notifIcon = (type) => {
  const map = {
    success: <Check size={12} />,
    warning: <AlertTriangle size={12} />,
    message: <MessageSquare size={12} />,
    task: <Check size={12} />,
    leave: <Calendar size={12} />,
    payroll: <Info size={12} />,
    meeting: <Calendar size={12} />,
    info:    <Calendar size={12} />,
  };
  return map[type] || <Info size={12} />;
};

const notifColor = (type) => {
  const map = {
    success: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
    warning: 'bg-amber-50 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
    message: 'bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
    task:    'bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
    leave:   'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
    payroll: 'bg-purple-50 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400',
    meeting: 'bg-amber-50 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
    info:    'bg-purple-50 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400',
  };
  return map[type] || 'bg-gray-100 text-gray-600 dark:bg-white/[0.07] dark:text-slate-400';
};

const TopNavbar = ({ onMenuClick, title, role = 'admin', onOpenPalette, isDark, onToggleTheme }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile]               = useState(false);
  const [currentTime, setCurrentTime]             = useState(new Date());
  const [notifs, setNotifs]                       = useState([]);
  const [attendance, setAttendance]               = useState({ clockedIn: false, loginTime: null });
  const notifRef                                  = useRef(null);
  const profileRef                                = useRef(null);
  const isEmployee                                = role === 'employee';

  const fetchRealtimeNotifs = async () => {
    try {
      if (isEmployee) {
        const res = await api.get('/notifications');
        const notifications = res.data.notifications || [];
        setNotifs(notifications.map(n => ({
          id: n._id,
          type: n.type || 'general',
          title: n.title,
          desc: n.message,
          time: n.createdAt,
          read: Boolean(n.read),
        })).slice(0, 8));
        return;
      }

      const [msgRes, calRes] = await Promise.all([
        api.get('/dashboard/messages').catch(() => ({ data: { messages: [] } })),
        api.get('/dashboard/calendar').catch(() => ({ data: { events: [] } })),
      ]);

      const messages = msgRes.data.messages || [];
      const events = calRes.data.events || [];

      // Retrieve read IDs from localStorage
      const readIds = (() => {
        try {
          return JSON.parse(localStorage.getItem('ems_read_notifications') || '[]');
        } catch {
          return [];
        }
      })();

      // Convert messages to notifications
      const messageNotifs = messages.slice(0, 5).map(msg => ({
        id: `msg-${msg._id}`,
        type: 'message',
        title: `Message from ${msg.sender}`,
        desc: msg.subject || msg.content,
        time: msg.createdAt,
        read: readIds.includes(`msg-${msg._id}`)
      }));

      // Convert events to notifications
      const eventNotifs = events.slice(0, 5).map(evt => ({
        id: `evt-${evt._id}`,
        type: 'info',
        title: `Upcoming: ${evt.title}`,
        desc: evt.description || 'Meeting scheduled',
        time: evt.start,
        read: readIds.includes(`evt-${evt._id}`)
      }));

      // Merge and sort by time (latest first)
      const merged = [...messageNotifs, ...eventNotifs].sort((a, b) => new Date(b.time) - new Date(a.time));
      
      setNotifs(merged.slice(0, 8)); // keep top 8
    } catch {
      setNotifs([]);
    }
  };

  useEffect(() => {
    queueMicrotask(fetchRealtimeNotifs);
    const interval = setInterval(fetchRealtimeNotifs, 12000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isEmployee) return;
    const fetchStatus = async () => {
      const res = await api.get('/attendance/today/status').catch(() => null);
      if (res?.data?.success) {
        setAttendance({
          clockedIn: Boolean(res.data.clockedIn),
          loginTime: res.data.loginTime,
        });
      }
    };
    queueMicrotask(fetchStatus);
    const interval = setInterval(fetchStatus, 60000);
    window.addEventListener('ems:attendance-updated', fetchStatus);
    return () => {
      clearInterval(interval);
      window.removeEventListener('ems:attendance-updated', fetchStatus);
    };
  }, [isEmployee]);

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const close = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const unreadCount = notifs.filter(n => !n.read).length;
  const timeStr = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  const dateStr = currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('ems_user') || '{}');
    } catch {
      return {};
    }
  })();
  const userName = storedUser.fullName || storedUser.email?.split('@')[0] || 'Admin';
  const userInitial = userName.charAt(0).toUpperCase();
  const firstName = userName.split(' ')[0] || (isEmployee ? 'Employee' : 'Admin');
  const clockLabel = attendance.clockedIn && attendance.loginTime
    ? `Clocked In · ${new Date(attendance.loginTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}`
    : 'Not Clocked In';
  const breadcrumbRoot = isEmployee ? firstName : 'Admin';

  const markAsRead = (id) => {
    setNotifs(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      try {
        const readIds = JSON.parse(localStorage.getItem('ems_read_notifications') || '[]');
        if (!readIds.includes(id)) {
          readIds.push(id);
          localStorage.setItem('ems_read_notifications', JSON.stringify(readIds));
        }
      } catch {
        return updated;
      }
      return updated;
    });
  };

  const markAllRead = () => {
    setNotifs(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      try {
        const readIds = JSON.parse(localStorage.getItem('ems_read_notifications') || '[]');
        updated.forEach(n => {
          if (!readIds.includes(n.id)) {
            readIds.push(n.id);
          }
        });
        localStorage.setItem('ems_read_notifications', JSON.stringify(readIds));
      } catch {
        return updated;
      }
      return updated;
    });
  };

  return (
    <motion.header
      {...topbarVariants}
      className="topbar-shell px-4 sm:px-6 justify-between flex items-center"
    >
      {/* ── LEFT ZONE ── */}
      <div className="flex items-center gap-3 min-w-0 pl-1">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/[0.05] dark:text-slate-400 transition-colors"
        >
          <Menu size={18} />
        </button>

        <div className="min-w-0">
          <h1 className="truncate text-[16px] sm:text-[18px] font-bold leading-tight text-gray-900 dark:text-white">
            {title || 'Overview'}
          </h1>
          <div className="hidden items-center gap-1.5 sm:flex">
            <span className="text-[12.5px] text-gray-400 dark:text-slate-500 font-medium">{breadcrumbRoot}</span>
            <ChevronRight size={11} className="text-gray-300 dark:text-slate-700" />
            <span className="text-[12.5px] font-semibold text-gray-800 dark:text-slate-200 truncate">
              {title || 'Overview'}
            </span>
          </div>
        </div>

        <div className={`hidden md:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border ${
          isEmployee && !attendance.clockedIn
            ? 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-white/[0.05] dark:text-slate-400 dark:border-white/[0.08]'
            : 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/[0.08] dark:text-emerald-400 dark:border-emerald-500/20'
        }`}>
          <span className={attendance.clockedIn || !isEmployee ? 'live-dot' : 'w-1.5 h-1.5 rounded-full bg-gray-400'} />
          <span className="text-[11px] font-semibold ml-0.5">{isEmployee ? clockLabel : 'All Systems Online'}</span>
        </div>
      </div>

      {/* ── CENTER ZONE ── */}
      <div className="flex-1 max-w-[380px] mx-4 hidden md:block">
        <button
          onClick={onOpenPalette}
          className="w-full flex items-center gap-2 h-[36px] px-3 rounded-lg bg-[var(--surface-L2)] border border-[var(--border-default)] text-gray-400 dark:text-slate-500 text-[12.5px] hover:border-[var(--border-hover)] transition-all duration-150 cursor-pointer"
        >
          <Search size={13} />
          <span className="flex-1 text-left">{isEmployee ? 'Search tasks, projects, meetings...' : 'Search employees, projects, tasks...'}</span>
          <kbd className="inline-flex items-center px-1.5 py-0.5 rounded bg-gray-150 dark:bg-white/[0.06] text-[10px] font-bold border border-gray-250 dark:border-white/[0.08] text-gray-450 dark:text-slate-500">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* ── RIGHT ZONE ── */}
      <div className="flex items-center gap-2.5 min-w-0">
        {/* Monospace time display */}
        <div className="hidden xl:flex items-center gap-1.5 h-[36px] px-3 rounded-lg bg-[var(--surface-L2)] border border-[var(--border-default)] font-mono text-[11px] text-gray-500 dark:text-slate-450">
          <span>{timeStr}</span>
          <span className="text-gray-300 dark:text-slate-700">/</span>
          <span>{dateStr}</span>
        </div>

        {/* Create Dropdown */}
        {!isEmployee && (
          <motion.button
            {...tapFeedback}
            onClick={onOpenPalette}
            className="hidden sm:flex items-center gap-1 h-[36px] px-3 rounded-lg bg-blue-600 text-white text-[12px] font-semibold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/10 shrink-0 cursor-pointer"
          >
            <Plus size={13} />
            <span>Create</span>
          </motion.button>
        )}

        {/* Theme toggle */}
        <motion.button
          {...tapFeedback}
          onClick={onToggleTheme}
          className="w-[36px] h-[36px] flex items-center justify-center rounded-lg text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-colors"
        >
          {isDark ? <Sun size={15} /> : <Moon size={15} />}
        </motion.button>

        {/* Notifications Bell */}
        <div className="relative" ref={notifRef}>
          <motion.button
            whileHover={{ rotate: [-18, 18, -12, 0] }}
            transition={{ type: 'spring', stiffness: 360, damping: 18 }}
            onClick={() => setShowNotifications(v => !v)}
            className="relative w-[36px] h-[36px] flex items-center justify-center rounded-lg text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-colors"
          >
            <Bell size={15} />
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-[14px] h-[14px] flex items-center justify-center rounded-full bg-rose-500 text-white text-[8px] font-bold border-2 border-white dark:border-[#070d1a]">
                {unreadCount}
              </span>
            )}
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="absolute right-[-12px] sm:right-0 top-full mt-2 w-[92vw] sm:w-[360px] bg-white dark:bg-[#0d1526] border border-gray-150 dark:border-white/[0.07] rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/50 overflow-hidden z-50"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-white/[0.05]">
                  <div>
                    <h4 className="text-[13px] font-bold text-gray-900 dark:text-white">Notifications</h4>
                    {unreadCount > 0 && (
                      <p className="text-[11px] text-gray-400 mt-0.5">{unreadCount} unread</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                        Mark all read
                      </button>
                    )}
                    <button onClick={() => setShowNotifications(false)} className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.05]">
                      <X size={13} />
                    </button>
                  </div>
                </div>

                {/* Notification list */}
                <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
                  {notifs.map(n => (
                    <div
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={`flex items-start gap-3 px-5 py-3 border-b border-gray-50 dark:border-white/[0.03] hover:bg-gray-50/80 dark:hover:bg-white/[0.02] cursor-pointer transition-colors ${!n.read ? 'bg-blue-50/40 dark:bg-blue-500/[0.04]' : ''}`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${notifColor(n.type)}`}>
                        {notifIcon(n.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[12.5px] font-semibold text-gray-900 dark:text-slate-200 truncate">{n.title}</span>
                          {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />}
                        </div>
                        <p className="text-[11.5px] text-gray-500 dark:text-slate-500 mt-0.5 truncate">{n.desc}</p>
                      </div>
                      <span className="text-[10.5px] text-gray-400 dark:text-slate-600 shrink-0 mt-0.5">{getRelativeTimeString(n.time)}</span>
                    </div>
                  ))}
                  {notifs.length === 0 && (
                    <div className="py-12 text-center text-xs font-bold text-gray-400 dark:text-slate-500 flex flex-col items-center gap-2">
                      <Bell size={24} className="text-gray-300 dark:text-slate-700 animate-pulse" />
                      <span>No active alerts logged</span>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-gray-100 dark:border-white/[0.05] text-center">
                  <button className="text-[11.5px] font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Avatar */}
        <div className="relative" ref={profileRef}>
          <motion.button
            {...tapFeedback}
            onClick={() => setShowProfile(v => !v)}
            className="w-[36px] h-[36px] rounded-full bg-blue-600 flex items-center justify-center text-[12px] font-bold text-white shrink-0 ring-2 ring-white dark:ring-[#070d1a]"
          >
            {userInitial}
          </motion.button>
          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                className="absolute right-0 top-full mt-2 w-48 rounded-2xl border border-gray-150 bg-white p-2 shadow-2xl shadow-black/10 dark:border-white/[0.07] dark:bg-[#0d1526]"
              >
                <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[12px] font-semibold text-gray-700 hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-white/[0.04]">
                  <User size={13} /> Profile
                </button>
                <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[12px] font-semibold text-gray-700 hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-white/[0.04]">
                  <Settings size={13} /> Settings
                </button>
                <div className="my-1 h-px bg-gray-100 dark:bg-white/[0.06]" />
                <button
                  onClick={() => {
                    localStorage.removeItem('ems_token');
                    localStorage.removeItem('ems_user');
                    window.location.href = '/ems-login';
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[12px] font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/[0.08]"
                >
                  <LogOut size={13} /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
};

export default TopNavbar;
