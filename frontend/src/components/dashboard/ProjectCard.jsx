import React from 'react';

const ProjectCard = ({ name, status, progress, members }) => {
  const getStatusColor = () => {
    switch(status.toLowerCase()) {
      case 'active': return 'text-emerald-600 bg-emerald-50';
      case 'on hold': return 'text-amber-600 bg-amber-50';
      case 'completed': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white border border-gray-100/60 rounded-[28px] p-6 shadow-sm hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] transition-all duration-500 group cursor-pointer relative overflow-hidden">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h4 className="text-[#0F172A] font-black text-[17px] group-hover:text-[#2563EB] transition-colors leading-tight">{name}</h4>
          <p className="text-[#64748b] text-[12px] font-medium mt-1">Due in 5 days</p>
        </div>
        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${getStatusColor()}`}>
          {status}
        </span>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between text-[13px] font-bold text-[#475569] mb-2.5">
          <span>Progress</span>
          <span className="text-[#2563EB]">{progress}%</span>
        </div>
        <div className="w-full bg-gray-100/80 rounded-full h-2.5 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(37,99,235,0.3)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
  
      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2.5">
            {[...Array(Math.min(members, 3))].map((_, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[11px] font-black text-slate-600 shadow-sm">
                {String.fromCharCode(65 + i)}
              </div>
            ))}
            {members > 3 && (
              <div className="w-8 h-8 rounded-full bg-slate-50 border-2 border-white flex items-center justify-center text-[11px] font-black text-slate-400 shadow-sm">
                +{members - 3}
              </div>
            )}
          </div>
          <span className="text-[12px] text-[#64748b] font-semibold">{members} contributors</span>
        </div>
        
        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-300">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
