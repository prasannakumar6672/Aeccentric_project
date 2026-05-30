import React from 'react';
import { MoreVertical, Edit2, Eye, Trash2 } from 'lucide-react';
import StatusBadge from '../employees/StatusBadge';
import RoleBadge from '../employees/RoleBadge';
import { Link } from 'react-router-dom';

const EmployeeTable = ({ employees, onEdit, onDelete }) => {
  return (
    <div className="dashboard-card w-full overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="data-table w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Employee</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">ID</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Role</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Department</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Status</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id} className="hover:bg-slate-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center text-[13px] font-black text-slate-500">
                      {emp.profilePhoto ? (
                        <img src={emp.profilePhoto} alt={emp.fullName} className="w-full h-full object-cover" />
                      ) : (
                        emp.fullName.split(' ').map(n => n[0]).join('')
                      )}
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-[#0F172A]">{emp.fullName}</p>
                      <p className="text-[12px] text-slate-400 font-medium">{emp.userId?.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[13px] font-bold text-[#475569] bg-slate-100 px-2 py-1 rounded-md">
                    {emp.employeeId}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <RoleBadge role={emp.userId?.role} />
                </td>
                <td className="px-6 py-4">
                  <span className="text-[13px] font-semibold text-[#64748b]">{emp.department || '-'}</span>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={emp.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link 
                      to={`/dashboard/admin/employees/${emp._id}`}
                      className="p-2 rounded-lg hover:bg-white hover:shadow-md text-slate-400 hover:text-[#2563EB] transition-all"
                    >
                      <Eye size={18} />
                    </Link>
                    <button 
                      onClick={() => onEdit(emp)}
                      className="p-2 rounded-lg hover:bg-white hover:shadow-md text-slate-400 hover:text-emerald-50 transition-all hover:text-emerald-600"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => onDelete(emp)}
                      className="p-2 rounded-lg hover:bg-white hover:shadow-md text-slate-400 hover:text-rose-50 transition-all hover:text-rose-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeTable;
