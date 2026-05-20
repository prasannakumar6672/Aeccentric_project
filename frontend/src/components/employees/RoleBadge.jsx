import React from 'react';

const RoleBadge = ({ role }) => {
  const styles = {
    super_admin: 'bg-rose-50 text-rose-600 border-rose-100',
    admin: 'bg-blue-50 text-blue-600 border-blue-100',
    manager: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    employee: 'bg-slate-50 text-slate-600 border-slate-100',
    hr: 'bg-cyan-50 text-cyan-600 border-cyan-100',
  };

  const labels = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    manager: 'Manager',
    employee: 'Employee',
    hr: 'HR',
  };

  const currentStyle = styles[role?.toLowerCase()] || styles.employee;
  const currentLabel = labels[role?.toLowerCase()] || role;

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${currentStyle}`}>
      {currentLabel}
    </span>
  );
};

export default RoleBadge;
