import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import { motion } from 'framer-motion';

const DashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Determine role based on URL structure or localStorage. 
  // In a real app, this should securely come from context/auth state.
  const isAdmin = location.pathname.startsWith('/dashboard/admin');
  const role = isAdmin ? 'admin' : 'employee';

  // Generate a page title based on the route
  const getPageTitle = () => {
    const segments = location.pathname.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    if (lastSegment === 'admin' || lastSegment === 'employee') return 'Overview';
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-50/50 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-blue-50/50 blur-[100px] rounded-full pointer-events-none" />

      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        role={role}
      />
      
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <TopNavbar 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
          title={getPageTitle()}
        />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden p-6 sm:p-8 lg:p-12">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-7xl mx-auto"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
