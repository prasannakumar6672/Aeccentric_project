import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit2, Mail, Phone, Globe, Briefcase, Calendar, Shield, MapPin, ExternalLink } from 'lucide-react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import api from '../../../services/api';
import StatusBadge from '../../../components/employees/StatusBadge';
import RoleBadge from '../../../components/employees/RoleBadge';
import ProfileHeader from '../../../components/profile/ProfileHeader';

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await api.get(`/employees/${id}`);
        setEmployee(res.data.employee);
      } catch (err) {
        console.error('Error fetching employee:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id]);

  if (loading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-[#2563EB] rounded-full animate-spin" />
        <p className="text-[14px] font-bold text-slate-400 tracking-widest uppercase">Analyzing Profile...</p>
      </div>
    );
  }

  if (!employee) return <div>Employee not found</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/dashboard/admin/employees')}
          className="flex items-center gap-2 text-[14px] font-black text-slate-400 hover:text-[#2563EB] transition-all uppercase tracking-widest"
        >
          <ArrowLeft size={20} />
          Back to Directory
        </button>
        <Link 
          to={`/dashboard/admin/employees/edit/${employee._id}`}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2563EB] text-white text-[13px] font-black tracking-widest hover:shadow-lg transition-all uppercase"
        >
          <Edit2 size={16} />
          Edit Profile
        </Link>
      </div>

      <ProfileHeader employee={employee} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Section */}
          <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
            <h3 className="text-[18px] font-black text-[#0F172A] mb-4">Professional Bio</h3>
            <p className="text-[#64748b] text-[15px] leading-[1.8] font-medium">
              {employee.bio || 'No professional biography provided yet.'}
            </p>
          </div>

          {/* Experience & Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
              <h3 className="text-[18px] font-black text-[#0F172A] mb-6 flex items-center gap-2">
                <Briefcase size={20} className="text-[#2563EB]" />
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {employee.techStack?.length > 0 ? (
                  employee.techStack.map((tech, i) => (
                    <span key={i} className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-[13px] font-bold text-slate-600">
                      {tech}
                    </span>
                  ))
                ) : (
                  <p className="text-slate-400 text-[14px]">No tech stack listed.</p>
                )}
              </div>
            </div>
            
            <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
              <h3 className="text-[18px] font-black text-[#0F172A] mb-6 flex items-center gap-2">
                <Shield size={20} className="text-[#2563EB]" />
                Key Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {employee.skills?.length > 0 ? (
                  employee.skills.map((skill, i) => (
                    <span key={i} className="px-4 py-2 rounded-xl bg-[#2563EB]/5 border border-[#2563EB]/10 text-[13px] font-bold text-[#2563EB]">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-slate-400 text-[14px]">No skills listed.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar info */}
        <div className="space-y-8">
          <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
            <h3 className="text-[16px] font-black text-[#0F172A] mb-6 uppercase tracking-widest">Contact Information</h3>
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#2563EB]">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Email</p>
                  <p className="text-[14px] font-bold text-[#0F172A]">{employee.userId?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#2563EB]">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Phone</p>
                  <p className="text-[14px] font-bold text-[#0F172A]">{employee.phone || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#2563EB]">
                  <FaLinkedin size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">LinkedIn</p>
                  <a href={employee.linkedinUrl} target="_blank" rel="noreferrer" className="text-[14px] font-bold text-[#2563EB] hover:underline flex items-center gap-1">
                    Profile <ExternalLink size={12} />
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#2563EB]">
                  <FaGithub size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">GitHub</p>
                  <a href={employee.githubUrl} target="_blank" rel="noreferrer" className="text-[14px] font-bold text-[#0F172A] hover:underline flex items-center gap-1">
                    Repository <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0B1A2B] rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl">
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#2563EB] opacity-20 blur-[60px] -mr-16 -mt-16" />
             <h3 className="text-[15px] font-black uppercase tracking-[0.2em] mb-6 opacity-60">Internal Data</h3>
             <div className="space-y-6 relative z-10">
                <div>
                  <p className="text-[11px] font-black text-white/40 uppercase tracking-widest mb-1">Employee ID</p>
                  <p className="text-[16px] font-black text-white">{employee.employeeId}</p>
                </div>
                <div>
                  <p className="text-[11px] font-black text-white/40 uppercase tracking-widest mb-1">Experience Level</p>
                  <p className="text-[14px] font-bold text-white capitalize">{employee.experienceLevel} Level</p>
                </div>
                <div>
                  <p className="text-[11px] font-black text-white/40 uppercase tracking-widest mb-1">Years of Service</p>
                  <p className="text-[14px] font-bold text-white">{employee.experience} Years</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
