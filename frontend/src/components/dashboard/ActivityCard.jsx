import React from 'react';

const ActivityCard = ({ title, activities }) => {
  return (
    <div className="bg-white border border-gray-100/60 rounded-[32px] p-8 shadow-sm h-full relative overflow-hidden">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-[#0F172A] text-[18px] font-black tracking-tight">{title}</h3>
          <p className="text-[#64748b] text-[12px] font-medium mt-1">Updates from your projects</p>
        </div>
        <button className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#2563EB] hover:text-white transition-all duration-300">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" />
          </svg>
        </button>
      </div>
      <div className="space-y-8 relative">
        {/* Timeline vertical line */}
        <div className="absolute top-2 left-[11px] w-[2px] h-[calc(100%-20px)] bg-slate-100 rounded-full" />
        
        {activities.map((activity, idx) => (
          <div key={idx} className="flex gap-5 group cursor-pointer relative z-10">
            <div className="relative shrink-0">
              <div className="w-6 h-6 rounded-full bg-white border-4 border-white ring-2 ring-slate-100 group-hover:ring-[#2563EB]/30 transition-all duration-300 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#2563EB] shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
              </div>
            </div>
            <div className="flex-1 pb-1">
              <p className="text-[#1E293B] text-[14px] font-bold group-hover:text-[#2563EB] transition-colors duration-300">{activity.action}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[12px] font-bold text-[#64748b] bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100/50">{activity.target}</span>
                <span className="text-[12px] text-slate-400 font-medium">Â· {activity.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-10 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-[#0F172A] text-[13px] font-black tracking-widest hover:bg-[#0B1A2B] hover:text-white transition-all duration-300 uppercase">
        View Full Timeline
      </button>
    </div>
  );
};

export default ActivityCard;
