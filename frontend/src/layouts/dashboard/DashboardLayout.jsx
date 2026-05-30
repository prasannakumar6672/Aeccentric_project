import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import CommandPalette from '../../components/dashboard/CommandPalette';
import { AnimatePresence, motion } from 'framer-motion';
import { pageVariants } from '../../lib/motion';
import { useTheme } from '../../context/ThemeContext';
import './Dashboard.css';

const DashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);
  
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  
  const location = useLocation();

  // Determine role
  const isAdmin = location.pathname.startsWith('/dashboard/admin');
  const role = isAdmin ? 'admin' : 'employee';

  // Page title from route
  const getPageTitle = () => {
    const segments = location.pathname.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    if (lastSegment === 'admin' || lastSegment === 'employee') return 'Overview';
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace(/-/g, ' ');
  };

  // Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleApiError = (event) => {
      setToast(event.detail?.message || 'Something went wrong');
      window.clearTimeout(handleApiError.timeout);
      handleApiError.timeout = window.setTimeout(() => setToast(null), 4200);
    };

    window.addEventListener('ems:api-error', handleApiError);
    return () => {
      window.removeEventListener('ems:api-error', handleApiError);
      window.clearTimeout(handleApiError.timeout);
    };
  }, []);

  return (
    <div className="min-h-screen flex font-sans relative overflow-x-hidden transition-colors duration-300" style={{ background: 'var(--surface-L0)', color: 'var(--text-primary)' }}>
      {/* Grid background */}
      <div className="grid-bg-overlay" />

      {/* Fixed Sidebar */}
      <div
        className="hidden lg:block fixed top-0 left-0 h-screen z-20 shrink-0"
        style={{ width: isSidebarCollapsed ? 'var(--sidebar-w-collapsed)' : 'var(--sidebar-w)' }}
      >
        <Sidebar
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          role={role}
          collapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
          onOpenPalette={() => setIsPaletteOpen(true)}
        />
      </div>

      {/* Mobile Sidebar (unchanged overlay behavior) */}
      <div className="lg:hidden">
        <Sidebar
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          role={role}
          collapsed={false}
          onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
          onOpenPalette={() => setIsPaletteOpen(true)}
        />
      </div>

      {/* Main content - offset by sidebar width */}
      <div
        className="flex-1 flex flex-col min-w-0 relative z-10 transition-all duration-[280ms]"
        style={{ marginLeft: isDesktop ? (isSidebarCollapsed ? 'var(--sidebar-w-collapsed)' : 'var(--sidebar-w)') : 0 }}
      >
        <TopNavbar
          onMenuClick={() => setIsMobileMenuOpen(true)}
          title={getPageTitle()}
          role={role}
          onOpenPalette={() => setIsPaletteOpen(true)}
          isDark={isDark}
          onToggleTheme={toggleTheme}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto"
              style={{ padding: 'var(--dashboard-padding-y) var(--dashboard-padding-x)' }}>
          <motion.div
            key={location.pathname}
            initial={pageVariants.initial}
            animate={pageVariants.animate}
            exit={pageVariants.exit}
            transition={pageVariants.transition}
            className="max-w-[var(--content-max-width)] mx-auto"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Command Palette */}
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
      />

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            className="fixed bottom-5 right-5 z-[80] max-w-[360px] rounded-xl border border-rose-200 bg-white px-4 py-3 text-sm font-semibold text-rose-700 shadow-lg dark:border-rose-500/20 dark:bg-[#111827] dark:text-rose-300"
            role="status"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;
