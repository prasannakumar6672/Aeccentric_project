import React from 'react';
import { Camera, MapPin, Briefcase, Calendar } from 'lucide-react';
import StatusBadge from '../employees/StatusBadge';
import RoleBadge from '../employees/RoleBadge';

const ProfileHeader = ({ employee, onImageUpdate }) => {
  if (!employee) return null;

  return (
    <div className="relative">
      {/* Cover Gradient */}
      <div className="h-48 w-full bg-gradient-to-r from-[#0B1A2B] via-[#1E293B] to-[#0B1A2B] rounded-[32px] overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#2563EB] rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-indigo-500 rounded-full blur-[100px]" />
        </div>
      </div>

      {/* Profile Info Overlay */}
      <div className="px-10 -mt-16 pb-8">
        <div className="flex flex-col md:flex-row items-end gap-6">
          <div className="relative group">
            <div className="w-32 h-32 rounded-[28px] bg-white p-1.5 shadow-xl border border-gray-100">
              <div className="w-full h-full rounded-[22px] bg-slate-100 overflow-hidden flex items-center justify-center text-[32px] font-black text-slate-400">
                {employee.profilePhoto ? (
                  <img src={employee.profilePhoto} alt={employee.fullName} className="w-full h-full object-cover" />
                ) : (
                  employee.fullName.split(' ').map(n => n[0]).join('')
                )}
              </div>
            </div>
            <button 
              onClick={onImageUpdate}
              className="absolute bottom-2 right-2 p-2 rounded-xl bg-[#2563EB] text-white shadow-lg hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
            >
              <Camera size={16} />
            </button>
          </div>

          <div className="flex-1 mb-2">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-[32px] font-black text-[#0F172A] tracking-tight">{employee.fullName}</h1>
              <div className="flex items-center gap-2">
                <RoleBadge role={employee.userId?.role} />
                <StatusBadge status={employee.status} />
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 text-[#64748b]">
              <div className="flex items-center gap-2 text-[14px] font-bold">
                <Briefcase size={16} className="text-[#2563EB]" />
                {employee.designation} / {employee.department}
              </div>
              <div className="flex items-center gap-2 text-[14px] font-bold">
                <MapPin size={16} className="text-slate-400" />
                {employee.address?.city || 'Location N/A'}
              </div>
              <div className="flex items-center gap-2 text-[14px] font-bold">
                <Calendar size={16} className="text-slate-400" />
                Joined {new Date(employee.joiningDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mb-2">
            <button className="px-6 py-3 rounded-xl bg-white border border-gray-100 text-[14px] font-black tracking-widest text-[#0F172A] hover:bg-slate-50 transition-all shadow-sm uppercase">
              View Activity
            </button>
            <button className="px-6 py-3 rounded-xl bg-[#0B1A2B] text-white text-[14px] font-black tracking-widest hover:shadow-xl hover:-translate-y-0.5 transition-all uppercase">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
