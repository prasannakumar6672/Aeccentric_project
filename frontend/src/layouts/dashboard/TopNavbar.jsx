import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';

const TopNavbar = ({ onMenuClick, title }) => {
  return (
    <header className="h-20 bg-white/60 backdrop-blur-xl border-b border-gray-100/50 flex items-center justify-between px-6 sm:px-10 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors"
        >
          <Menu size={20} />
        </button>
        <h2 className="text-[18px] font-black tracking-tight text-[#0F172A] hidden sm:block">
          {title || 'Dashboard'}
        </h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-64 h-10 bg-gray-50 border-none rounded-full pl-10 pr-4 text-[13px] font-medium outline-none focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
          />
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-400 hover:text-[#0F172A] transition-colors">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
          </button>
          
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#2563EB] to-[#1D4ED8] p-[2px]">
              <div className="w-full h-full rounded-full border-2 border-white bg-white overflow-hidden">
                <img src="https://ui-avatars.com/api/?name=User&background=f8fafc&color=2F5BFF" alt="User" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
