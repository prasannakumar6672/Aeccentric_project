import React from 'react';
import { Mail, Phone, MapPin, MoreVertical } from 'lucide-react';
import StatusBadge from './StatusBadge';
import RoleBadge from './RoleBadge';
import { Link } from 'react-router-dom';

const EmployeeCard = ({ employee }) => {
  return (
    <div className="bg-white rounded-[32px] border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-6">
        <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-gray-50 overflow-hidden flex items-center justify-center text-[20px] font-black text-slate-400 group-hover:border-[#2563EB]/30 transition-all">
          {employee.profilePhoto ? (
            <img src={employee.profilePhoto} alt={employee.fullName} className="w-full h-full object-cover" />
          ) : (
            employee.fullName.split(' ').map(n => n[0]).join('')
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusBadge status={employee.status} />
          <RoleBadge role={employee.userId?.role} />
        </div>
      </div>

      <div className="mb-6">
        <Link to={`/dashboard/admin/employees/${employee._id}`}>
          <h3 className="text-[18px] font-black text-[#0F172A] hover:text-[#2563EB] transition-all truncate">
            {employee.fullName}
          </h3>
        </Link>
        <p className="text-[13px] font-bold text-[#2563EB] uppercase tracking-wider mt-1">
          {employee.designation}
        </p>
        <p className="text-[12px] font-medium text-slate-400 mt-0.5">
          {employee.department}
        </p>
      </div>

      <div className="space-y-3 pt-6 border-t border-gray-50">
        <div className="flex items-center gap-3 text-[13px] text-slate-500 font-medium">
          <Mail size={16} className="text-slate-400" />
          <span className="truncate">{employee.userId?.email}</span>
        </div>
        <div className="flex items-center gap-3 text-[13px] text-slate-500 font-medium">
          <Phone size={16} className="text-slate-400" />
          <span>{employee.phone || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-3 text-[13px] text-slate-500 font-medium">
          <MapPin size={16} className="text-slate-400" />
          <span>{employee.address?.city || 'Location N/A'}</span>
        </div>
      </div>

      <div className="mt-8 flex gap-2">
        <Link 
          to={`/dashboard/admin/employees/${employee._id}`}
          className="flex-1 py-3 rounded-xl bg-slate-50 text-[#0F172A] text-[12px] font-black tracking-widest text-center hover:bg-[#0B1A2B] hover:text-white transition-all uppercase"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default EmployeeCard;
