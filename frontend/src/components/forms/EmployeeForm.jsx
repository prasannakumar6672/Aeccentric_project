import React, { useState, useEffect } from 'react';
import { X, Save, User, Mail, Lock, Phone, Briefcase, MapPin } from 'lucide-react';

const EmployeeForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'employee',
    department: '',
    designation: '',
    phone: '',
    joiningDate: new Date().toISOString().split('T')[0],
    techStack: '',
    skills: '',
    experienceLevel: 'junior',
    experience: 0,
    linkedinUrl: '',
    githubUrl: '',
    status: 'active',
    address: { street: '', city: '', state: '', zipCode: '', country: '' },
    emergencyContact: { name: '', relationship: '', phone: '' },
    bio: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        email: initialData.userId?.email || '',
        role: initialData.userId?.role || 'employee',
        techStack: initialData.techStack?.join(', ') || '',
        skills: initialData.skills?.join(', ') || '',
        joiningDate: initialData.joiningDate ? new Date(initialData.joiningDate).toISOString().split('T')[0] : '',
        address: initialData.address || { street: '', city: '', state: '', zipCode: '', country: '' },
        emergencyContact: initialData.emergencyContact || { name: '', relationship: '', phone: '' },
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const processedData = {
      ...formData,
      techStack: formData.techStack.split(',').map(s => s.trim()).filter(Boolean),
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
    };
    onSubmit(processedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto p-1">
      {/* Section: Basic Info */}
      <div className="bg-white rounded-[24px] border border-gray-100 p-8 shadow-sm">
        <h3 className="text-[18px] font-black text-[#0F172A] mb-6 flex items-center gap-2">
          <User size={20} className="text-[#2563EB]" />
          Identity & Access
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[13px] font-bold text-slate-500 mb-2">Full Name</label>
            <input 
              required name="fullName" value={formData.fullName} onChange={handleChange}
              className="w-full h-12 px-4 rounded-xl bg-slate-50 border-none text-[14px] focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-slate-500 mb-2">Work Email</label>
            <input 
              required type="email" name="email" value={formData.email} onChange={handleChange}
              disabled={!!initialData}
              className="w-full h-12 px-4 rounded-xl bg-slate-50 border-none text-[14px] focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none disabled:opacity-50"
              placeholder="john@aeccentric.com"
            />
          </div>
          {!initialData && (
            <div>
              <label className="block text-[13px] font-bold text-slate-500 mb-2">Temporary Password</label>
              <input 
                required type="password" name="password" value={formData.password} onChange={handleChange}
                className="w-full h-12 px-4 rounded-xl bg-slate-50 border-none text-[14px] focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none"
                placeholder="Temporary password"
              />
            </div>
          )}
          <div>
            <label className="block text-[13px] font-bold text-slate-500 mb-2">System Role</label>
            <select 
              name="role" value={formData.role} onChange={handleChange}
              className="w-full h-12 px-4 rounded-xl bg-slate-50 border-none text-[14px] focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none"
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="hr">HR</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section: Professional Details */}
      <div className="bg-white rounded-[24px] border border-gray-100 p-8 shadow-sm">
        <h3 className="text-[18px] font-black text-[#0F172A] mb-6 flex items-center gap-2">
          <Briefcase size={20} className="text-[#2563EB]" />
          Professional Profile
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[13px] font-bold text-slate-500 mb-2">Department</label>
            <input 
              name="department" value={formData.department} onChange={handleChange}
              className="w-full h-12 px-4 rounded-xl bg-slate-50 border-none text-[14px] focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none"
              placeholder="Engineering, Design, etc."
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-slate-500 mb-2">Designation</label>
            <input 
              name="designation" value={formData.designation} onChange={handleChange}
              className="w-full h-12 px-4 rounded-xl bg-slate-50 border-none text-[14px] focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none"
              placeholder="Senior Developer"
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-slate-500 mb-2">Tech Stack (comma separated)</label>
            <input 
              name="techStack" value={formData.techStack} onChange={handleChange}
              className="w-full h-12 px-4 rounded-xl bg-slate-50 border-none text-[14px] focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none"
              placeholder="React, Node.js, AWS"
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-slate-500 mb-2">Skills (comma separated)</label>
            <input 
              name="skills" value={formData.skills} onChange={handleChange}
              className="w-full h-12 px-4 rounded-xl bg-slate-50 border-none text-[14px] focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none"
              placeholder="UI/UX, System Design"
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-slate-500 mb-2">Experience Level</label>
            <select 
              name="experienceLevel" value={formData.experienceLevel} onChange={handleChange}
              className="w-full h-12 px-4 rounded-xl bg-slate-50 border-none text-[14px] focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none"
            >
              <option value="junior">Junior</option>
              <option value="mid">Mid-Level</option>
              <option value="senior">Senior</option>
              <option value="lead">Lead</option>
              <option value="principal">Principal</option>
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-bold text-slate-500 mb-2">Status</label>
            <select 
              name="status" value={formData.status} onChange={handleChange}
              className="w-full h-12 px-4 rounded-xl bg-slate-50 border-none text-[14px] focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none"
            >
              <option value="active">Active</option>
              <option value="on_leave">On Leave</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section: Contact & Social */}
      <div className="bg-white rounded-[24px] border border-gray-100 p-8 shadow-sm">
        <h3 className="text-[18px] font-black text-[#0F172A] mb-6 flex items-center gap-2">
          <Phone size={20} className="text-[#2563EB]" />
          Contact & Social
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[13px] font-bold text-slate-500 mb-2">Phone Number</label>
            <input 
              name="phone" value={formData.phone} onChange={handleChange}
              className="w-full h-12 px-4 rounded-xl bg-slate-50 border-none text-[14px] focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none"
              placeholder="+1 234 567 890"
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-slate-500 mb-2">LinkedIn URL</label>
            <input 
              name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange}
              className="w-full h-12 px-4 rounded-xl bg-slate-50 border-none text-[14px] focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none"
              placeholder="linkedin.com/in/username"
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-slate-500 mb-2">GitHub URL</label>
            <input 
              name="githubUrl" value={formData.githubUrl} onChange={handleChange}
              className="w-full h-12 px-4 rounded-xl bg-slate-50 border-none text-[14px] focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none"
              placeholder="github.com/username"
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-4 pt-6">
        <button 
          type="button" onClick={onCancel}
          className="px-6 py-3 rounded-xl text-[14px] font-bold text-slate-500 hover:bg-slate-100 transition-all"
        >
          Cancel
        </button>
        <button 
          type="submit" disabled={isLoading}
          className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#0B1A2B] text-white text-[14px] font-black tracking-widest hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50"
        >
          {isLoading ? 'SAVING...' : (
            <>
              <Save size={18} />
              {initialData ? 'UPDATE EMPLOYEE' : 'CREATE EMPLOYEE'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;
