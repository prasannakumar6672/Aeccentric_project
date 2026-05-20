import React from 'react';

const StatusBadge = ({ status }) => {
  const styles = {
    active: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    inactive: 'bg-slate-50 text-slate-500 border-slate-100',
    on_leave: 'bg-amber-50 text-amber-600 border-amber-100',
  };

  const labels = {
    active: 'Active',
    inactive: 'Inactive',
    on_leave: 'On Leave',
  };

  const currentStyle = styles[status?.toLowerCase()] || styles.inactive;
  const currentLabel = labels[status?.toLowerCase()] || status;

  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${currentStyle}`}>
      {currentLabel}
    </span>
  );
};

export default StatusBadge;
