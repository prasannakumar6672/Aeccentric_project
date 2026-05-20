import React from 'react';

const StatCard = ({ title, value, change, icon, accent }) => {
  return (
    <div className="bg-white border border-gray-100/60 rounded-3xl p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden">
      {/* Decorative background element on hover */}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500" 
        style={{ backgroundColor: accent }} />
        
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div 
          className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rotate-[10deg] group-hover:scale-110 shadow-sm"
          style={{ backgroundColor: `${accent}15`, color: accent }}
        >
          {React.cloneElement(icon, { size: 28 })}
        </div>
        {change && (
          <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-bold ${
            change.startsWith('+') ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
          }`}>
            <span className="text-[10px]">{change.startsWith('+') ? '▲' : '▼'}</span>
            {change.replace(/[+-]/, '')}%
          </div>
        )}
      </div>
      <div className="relative z-10">
        <p className="text-[#64748b] text-[12px] font-bold uppercase tracking-[0.15em] mb-2">{title}</p>
        <h3 className="text-[#0F172A] text-4xl font-black tracking-tight">{value}</h3>
      </div>
    </div>
  );
};

export default StatCard;
