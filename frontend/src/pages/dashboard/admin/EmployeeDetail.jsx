import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Mail, Phone, Calendar, Briefcase, MapPin, Shield,
  Award, UserCircle, Compass, Heart, RefreshCw, AlertCircle, Sparkles
} from 'lucide-react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import api from '../../../services/api';

/* ─── ANIMATION VARIANTS ─── */
const containerVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const sectionVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }
};

export default function EmployeeDetail() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadEmployee() {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/employees/${id}`);
        if (res.data && res.data.success) {
          setEmployee(res.data.employee);
        } else {
          setError('Could not retrieve employee details.');
        }
      } catch (err) {
        setError(err?.response?.data?.message || 'Employee not found in directory.');
      } finally {
        setLoading(false);
      }
    }
    loadEmployee();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-center gap-4 text-gray-500">
        <RefreshCw size={32} className="text-blue-500 animate-spin" />
        <p className="text-sm font-bold dark:text-[#EDF0FA]">Hydrating Employee Profile details...</p>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-3 text-rose-500">
        <AlertCircle size={28} />
        <p className="text-sm font-bold">{error || 'Employee not found.'}</p>
        <Link to="/dashboard/admin/employees" className="mt-2 text-xs font-bold text-blue-500 underline">
          Back to Directory
        </Link>
      </div>
    );
  }

  const initials = employee.fullName
    ? employee.fullName.split(' ').map(n => n[0]).join('').substring(0, 2)
    : 'E';

  // Robust parsing: extract separate skills and tech stacks (comma or space separated)
  const techStackList = Array.isArray(employee.techStack)
    ? employee.techStack.flatMap(t => typeof t === 'string' ? t.split(/,\s*|\s+/) : [t]).filter(Boolean)
    : typeof employee.techStack === 'string'
      ? employee.techStack.split(/,\s*|\s+/).filter(Boolean)
      : [];

  const skillsList = Array.isArray(employee.skills)
    ? employee.skills.flatMap(s => typeof s === 'string' ? s.split(/,\s*|\s+/) : [s]).filter(Boolean)
    : typeof employee.skills === 'string'
      ? employee.skills.split(/,\s*|\s+/).filter(Boolean)
      : [];

  return (
    <div className="flex flex-col gap-8 text-gray-900 dark:text-[#EDF0FA]">
      
      {/* ─── HEADER & BACK NAVIGATION ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard/admin/employees"
            className="p-2.5 border border-gray-200 dark:border-white/[0.06] hover:bg-gray-150 dark:hover:bg-white/[0.04] text-gray-655 dark:text-[#EDF0FA] rounded-xl transition-all cursor-pointer hover:-translate-x-0.5 shadow-sm"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight font-syne dark:text-white flex items-center gap-2">
              Employee <span className="text-blue-600 dark:text-blue-400">Profile File</span>
              <Sparkles className="w-5 h-5 text-blue-500" />
            </h1>
            <p className="text-sm text-gray-500 dark:text-[#8892B8] mt-1">
              Active corporate credential directory and operational records for {employee.fullName}.
            </p>
          </div>
        </div>
      </div>

      {/* ─── PROFILE Bento GRID LAYOUT ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: AVATAR & QUICK DETAILS */}
        <motion.div 
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="glass-card p-8 lg:col-span-4 flex flex-col items-center text-center relative overflow-hidden group"
        >
          {/* Top aesthetic accent band */}
          <div className={`absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r ${
            employee.status === 'active' ? 'from-emerald-500 to-teal-500' :
            employee.status === 'on_leave' ? 'from-amber-500 to-orange-500' :
            'from-gray-400 to-slate-500'
          }`} />
          
          {/* Glowing Ring Avatar Wrapper */}
          <div className="relative mt-6 mb-4 group/avatar">
            {/* Inner breathing pulse rings */}
            <div className={`absolute -inset-1.5 rounded-full bg-gradient-to-tr ${
              employee.status === 'active' ? 'from-emerald-500 via-teal-500 to-emerald-600' :
              employee.status === 'on_leave' ? 'from-amber-500 via-orange-500 to-amber-600' :
              'from-gray-400 via-slate-500 to-gray-500'
            } opacity-40 blur-md group-hover/avatar:opacity-75 transition-all duration-300 animate-pulse`} />
            
            {/* Real double ring avatar container */}
            <div className="relative w-24 h-24 rounded-full p-[3px] bg-gradient-to-tr from-[#1E293B]/20 via-[#2E3C51]/30 to-[#1E293B]/20 dark:from-white/[0.08] dark:to-white/[0.02] shadow-xl">
              <div className="w-full h-full rounded-full bg-slate-900/90 dark:bg-slate-950/90 flex items-center justify-center font-bold text-3xl tracking-tight text-blue-400 dark:text-blue-300 font-syne select-none uppercase border border-white/[0.06]">
                {initials}
              </div>
            </div>

            {/* Pulser Status Dot */}
            <span className="absolute bottom-1 right-1 flex h-4 w-4">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                employee.status === 'active' ? 'bg-emerald-400' :
                employee.status === 'on_leave' ? 'bg-amber-400' :
                'bg-gray-400'
              } opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-4 w-4 border-2 border-slate-900 ${
                employee.status === 'active' ? 'bg-emerald-500' :
                employee.status === 'on_leave' ? 'bg-amber-500' :
                'bg-gray-500'
              }`}></span>
            </span>
          </div>

          <h2 className="text-2xl font-bold font-syne tracking-tight text-gray-900 dark:text-white mt-3">{employee.fullName}</h2>
          
          <p className="text-xs text-blue-600 dark:text-blue-400 font-bold mt-1.5 flex items-center gap-1.5 justify-center bg-blue-500/10 dark:bg-blue-500/5 px-3 py-1 rounded-full border border-blue-500/20 shadow-sm">
            <Briefcase size={13} />
            {employee.designation || 'Specialist'}
          </p>

          {/* Quick Stats list */}
          <div className="w-full mt-6 pt-6 border-t border-gray-100 dark:border-white/[0.04] flex flex-col gap-3 text-xs text-left">
            
            {/* Department */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 dark:bg-white/[0.01] border border-gray-100 dark:border-white/[0.02] hover:bg-gray-100/50 dark:hover:bg-white/[0.03] transition-all">
              <div className="flex items-center gap-2 text-gray-450 dark:text-[#8892B8] font-semibold">
                <Briefcase size={14} className="text-blue-500/80" />
                <span>Department</span>
              </div>
              <span className="font-bold text-gray-900 dark:text-white">{employee.department || 'N/A'}</span>
            </div>

            {/* Joining Date */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 dark:bg-white/[0.01] border border-gray-100 dark:border-white/[0.02] hover:bg-gray-100/50 dark:hover:bg-white/[0.03] transition-all">
              <div className="flex items-center gap-2 text-gray-455 dark:text-[#8892B8] font-semibold">
                <Calendar size={14} className="text-blue-500/80" />
                <span>Joined Organization</span>
              </div>
              <span className="font-bold text-gray-900 dark:text-white">
                {employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
              </span>
            </div>

            {/* Role Group */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 dark:bg-white/[0.01] border border-gray-100 dark:border-white/[0.02] hover:bg-gray-100/50 dark:hover:bg-white/[0.03] transition-all">
              <div className="flex items-center gap-2 text-gray-455 dark:text-[#8892B8] font-semibold">
                <Shield size={14} className="text-indigo-500/80" />
                <span>System Role</span>
              </div>
              <span className="font-extrabold uppercase text-[10px] bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">{employee.userId?.role || 'Employee'}</span>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 dark:bg-white/[0.01] border border-gray-100 dark:border-white/[0.02] hover:bg-gray-100/50 dark:hover:bg-white/[0.03] transition-all">
              <div className="flex items-center gap-2 text-gray-455 dark:text-[#8892B8] font-semibold">
                <Mail size={14} className="text-blue-500/80" />
                <span>Corporate Email</span>
              </div>
              <a href={`mailto:${employee.userId?.email}`} className="font-bold text-blue-600 dark:text-blue-400 hover:underline truncate max-w-[150px]" title={employee.userId?.email}>{employee.userId?.email || 'N/A'}</a>
            </div>

            {/* Contact Number */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 dark:bg-white/[0.01] border border-gray-100 dark:border-white/[0.02] hover:bg-gray-100/50 dark:hover:bg-white/[0.03] transition-all">
              <div className="flex items-center gap-2 text-gray-455 dark:text-[#8892B8] font-semibold">
                <Phone size={14} className="text-blue-500/80" />
                <span>Phone Contact</span>
              </div>
              <a href={`tel:${employee.phone}`} className="font-bold text-gray-900 dark:text-[#EDF0FA] hover:text-blue-500 dark:hover:text-blue-400 transition-colors">{employee.phone || 'N/A'}</a>
            </div>

          </div>

          {/* Social Profiles */}
          <div className="flex items-center gap-3 mt-6">
            {employee.linkedinUrl && (
              <a
                href={employee.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 hover:border-sky-500/20 hover:bg-sky-500/10 text-gray-400 hover:text-sky-500 dark:bg-white/[0.02] dark:border-white/[0.06] dark:hover:bg-sky-500/10 dark:hover:text-sky-400 flex items-center justify-center transition-all shadow-sm"
                title="LinkedIn Profile"
              >
                <FaLinkedin size={16} />
              </a>
            )}
            {employee.githubUrl && (
              <a
                href={employee.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 hover:border-white/[0.2] hover:bg-gray-900/10 text-gray-400 hover:text-gray-900 dark:bg-white/[0.02] dark:border-white/[0.06] dark:hover:bg-white/[0.05] dark:hover:text-white flex items-center justify-center transition-all shadow-sm"
                title="GitHub Profile"
              >
                <FaGithub size={16} />
              </a>
            )}
          </div>
        </motion.div>

        {/* RIGHT COLUMN: DETAILED TABS */}
        <motion.div 
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="lg:col-span-8 flex flex-col gap-8"
        >
          
          {/* Biography & Professional Stats */}
          <motion.div variants={sectionVariants} className="glass-card p-8 flex flex-col gap-6 relative overflow-hidden">
            {/* Quote watermark */}
            <span className="absolute -top-6 right-6 text-[130px] font-serif font-black text-gray-100 dark:text-white/[0.01] select-none pointer-events-none">"</span>
            
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-blue-500 border-b border-gray-100 dark:border-white/[0.04] pb-3 mb-4 flex items-center gap-2">
                <UserCircle className="w-4 h-4 text-blue-500" /> Biography & Professional Bio
              </h3>
              <p className="text-sm text-gray-650 dark:text-[#8892B8] leading-relaxed whitespace-pre-line italic relative z-10 pl-3.5 border-l-2 border-blue-500/40">
                {employee.bio ? `"${employee.bio}"` : 'No biography text has been written for this employee profile yet.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-white/[0.04]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
                  <Award size={20} />
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-extrabold tracking-wider">Experience Rating</div>
                  <div className="text-sm font-bold text-gray-800 dark:text-[#EDF0FA] capitalize mt-0.5">{employee.experienceLevel || 'Mid-Level'} ({employee.experience || 0} Years)</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
                  <Compass size={20} />
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-extrabold tracking-wider">Reports To</div>
                  <div className="text-sm font-bold text-gray-800 dark:text-[#EDF0FA] mt-0.5">{employee.reportsTo?.fullName || 'Organization Board'}</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Skills & Tech Stack tags */}
          <motion.div variants={sectionVariants} className="glass-card p-8 flex flex-col gap-6">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-blue-500 border-b border-gray-100 dark:border-white/[0.04] pb-3 mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-500" /> Tech Stack & Skills
            </h3>
            <div className="flex flex-col gap-5">
              <div>
                <span className="text-[10px] font-extrabold text-gray-400 dark:text-[#5A6282] uppercase block mb-3 tracking-wider">Core Tech Stack</span>
                <div className="flex flex-wrap gap-2.5">
                  {techStackList.length > 0 ? (
                    techStackList.map((tech, i) => (
                      <span key={i} className="px-3.5 py-1.5 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold border border-blue-500/10 hover:border-blue-500/30 transition-all hover:scale-[1.03] cursor-default shadow-sm shadow-blue-500/5">
                        {tech}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400 italic">No technology tags specified</span>
                  )}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-gray-400 dark:text-[#5A6282] uppercase block mb-3 tracking-wider">Skillsets & Competencies</span>
                <div className="flex flex-wrap gap-2.5">
                  {skillsList.length > 0 ? (
                    skillsList.map((skill, i) => (
                      <span key={i} className="px-3.5 py-1.5 bg-gray-150/80 dark:bg-white/[0.02] hover:bg-gray-250/80 dark:hover:bg-white/[0.05] text-gray-650 dark:text-[#8892B8] rounded-xl text-xs font-semibold border border-gray-200 dark:border-white/[0.06] hover:border-gray-300 dark:hover:border-white/[0.12] transition-all hover:scale-[1.03] cursor-default">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400 italic">No skill tags specified</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact, Address & Emergency */}
          <motion.div variants={sectionVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Address Details */}
            <div className="glass-card p-8 flex flex-col gap-6">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-blue-500 border-b border-gray-100 dark:border-white/[0.04] pb-3 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500" /> Personal Address
              </h3>
              {employee.address && (employee.address.street || employee.address.city) ? (
                <div className="flex flex-col gap-3 text-xs">
                  
                  {/* Street */}
                  <div className="flex items-center justify-between py-2.5 border-b border-gray-100 dark:border-white/[0.03]">
                    <span className="text-gray-400 dark:text-[#5A6282] font-semibold">Street</span>
                    <span className="font-bold text-gray-900 dark:text-white text-right">{employee.address.street || 'N/A'}</span>
                  </div>

                  {/* City */}
                  <div className="flex items-center justify-between py-2.5 border-b border-gray-100 dark:border-white/[0.03]">
                    <span className="text-gray-400 dark:text-[#5A6282] font-semibold">City</span>
                    <span className="font-bold text-gray-900 dark:text-white">{employee.address.city || 'N/A'}</span>
                  </div>

                  {/* State */}
                  <div className="flex items-center justify-between py-2.5 border-b border-gray-100 dark:border-white/[0.03]">
                    <span className="text-gray-400 dark:text-[#5A6282] font-semibold">State</span>
                    <span className="font-bold text-gray-900 dark:text-white">{employee.address.state || 'N/A'}</span>
                  </div>

                  {/* Zip */}
                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-gray-400 dark:text-[#5A6282] font-semibold">Zip Code</span>
                    <span className="font-bold text-gray-900 dark:text-white">{employee.address.zip || 'N/A'}</span>
                  </div>

                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">No home address registered.</p>
              )}
            </div>

            {/* Emergency Contact */}
            <div className="glass-card p-8 flex flex-col gap-6">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-blue-500 border-b border-gray-100 dark:border-white/[0.04] pb-3 mb-2 flex items-center gap-2">
                <Heart className="w-4 h-4 text-blue-500" /> Emergency Contact
              </h3>
              {employee.emergencyContact && employee.emergencyContact.name ? (
                <div className="flex flex-col gap-3 text-xs">
                  
                  {/* Name */}
                  <div className="flex items-center justify-between py-2.5 border-b border-gray-100 dark:border-white/[0.03]">
                    <span className="text-gray-400 dark:text-[#5A6282] font-semibold">Contact Name</span>
                    <span className="font-bold text-gray-900 dark:text-white">{employee.emergencyContact.name}</span>
                  </div>

                  {/* Relationship */}
                  <div className="flex items-center justify-between py-2.5 border-b border-gray-100 dark:border-white/[0.03]">
                    <span className="text-gray-400 dark:text-[#5A6282] font-semibold">Relationship</span>
                    <span className="font-bold text-gray-950 dark:text-white capitalize">{employee.emergencyContact.relation || 'N/A'}</span>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-gray-400 dark:text-[#5A6282] font-semibold">Phone Number</span>
                    <a
                      href={`tel:${employee.emergencyContact.phone}`}
                      className="font-extrabold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {employee.emergencyContact.phone}
                    </a>
                  </div>

                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">No emergency contact registered.</p>
              )}
            </div>

          </motion.div>

          {/* Quick actions for admin */}
          <motion.div variants={sectionVariants} className="flex justify-end gap-3 mt-2">
            <Link
              to={`/dashboard/admin/employees/edit/${employee._id}`}
              className="px-7 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-600/10 hover:shadow-blue-600/20 hover:-translate-y-0.5 cursor-pointer flex items-center gap-1.5"
            >
              <Shield size={15} />
              Modify Employee Record
            </Link>
          </motion.div>

        </motion.div>

      </div>

    </div>
  );
}

// ─── HIGH-FIDELITY MOCK PROFILE WATERFALL FOR DETAILS FALLBACK ───
