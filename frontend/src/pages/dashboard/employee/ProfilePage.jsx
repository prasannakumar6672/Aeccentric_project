import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import ProfileHeader from '../../../components/profile/ProfileHeader';
import { Mail, Phone, MapPin, Briefcase, Shield, Calendar, Edit2, Save, X } from 'lucide-react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

const ProfilePage = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/employees');
        if (res.data.employees?.length > 0) {
          const emp = res.data.employees[0];
          setEmployee(emp);
          setFormData({
            phone: emp.phone || '',
            bio: emp.bio || '',
            linkedinUrl: emp.linkedinUrl || '',
            githubUrl: emp.githubUrl || '',
            address: emp.address || { street: '', city: '', state: '', zipCode: '', country: '' },
            skills: emp.skills?.join(', ') || '',
            techStack: emp.techStack?.join(', ') || ''
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

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

  const handleSave = async () => {
    setSaving(true);
    try {
      const processedData = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        techStack: formData.techStack.split(',').map(s => s.trim()).filter(Boolean),
      };
      const res = await api.put(`/employees/${employee._id}`, processedData);
      setEmployee(res.data.employee);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-[#2563EB] rounded-full animate-spin" />
        <p className="text-[14px] font-bold text-slate-400 tracking-widest uppercase">Loading Your Profile...</p>
      </div>
    );
  }

  if (!employee) return <div>No profile data found.</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-black text-[#0F172A] tracking-tight">My Profile</h1>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B1A2B] text-white text-[13px] font-black tracking-widest hover:shadow-lg transition-all uppercase"
          >
            <Edit2 size={16} />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">
            <button 
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 rounded-xl text-[13px] font-black tracking-widest text-slate-400 hover:text-slate-600 uppercase"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white text-[13px] font-black tracking-widest hover:shadow-lg transition-all uppercase"
            >
              <Save size={16} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      <ProfileHeader employee={employee} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* About / Bio */}
          <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
            <h3 className="text-[18px] font-black text-[#0F172A] mb-4">Bio</h3>
            {isEditing ? (
              <textarea 
                name="bio" value={formData.bio} onChange={handleChange}
                rows={4}
                className="w-full p-4 rounded-xl bg-slate-50 border-none text-[14px] focus:ring-2 focus:ring-[#2563EB]/10 outline-none transition-all"
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="text-[#64748b] text-[15px] leading-[1.8] font-medium">
                {employee.bio || 'No biography added yet.'}
              </p>
            )}
          </div>

          {/* Skills & Tech */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
              <h3 className="text-[18px] font-black text-[#0F172A] mb-6 flex items-center gap-2">
                <Briefcase size={20} className="text-[#2563EB]" />
                Tech Stack
              </h3>
              {isEditing ? (
                <input 
                  name="techStack" value={formData.techStack} onChange={handleChange}
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 border-none text-[14px] focus:ring-2 focus:ring-[#2563EB]/10 outline-none"
                  placeholder="React, Node.js, etc."
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {employee.techStack?.map((t, i) => (
                    <span key={i} className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-[13px] font-bold text-slate-600">{t}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
              <h3 className="text-[18px] font-black text-[#0F172A] mb-6 flex items-center gap-2">
                <Shield size={20} className="text-[#2563EB]" />
                Skills
              </h3>
              {isEditing ? (
                <input 
                  name="skills" value={formData.skills} onChange={handleChange}
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 border-none text-[14px] focus:ring-2 focus:ring-[#2563EB]/10 outline-none"
                  placeholder="UI/UX, SEO, etc."
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {employee.skills?.map((s, i) => (
                    <span key={i} className="px-4 py-2 rounded-xl bg-[#2563EB]/5 border border-[#2563EB]/10 text-[13px] font-bold text-[#2563EB]">{s}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
            <h3 className="text-[16px] font-black text-[#0F172A] mb-6 uppercase tracking-widest">Contact & Social</h3>
            <div className="space-y-6">
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-1">Phone</label>
                {isEditing ? (
                  <input name="phone" value={formData.phone} onChange={handleChange} className="w-full h-10 px-3 rounded-lg bg-slate-50 text-[14px] outline-none" />
                ) : (
                  <p className="text-[14px] font-bold text-[#0F172A]">{employee.phone || 'N/A'}</p>
                )}
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-1">LinkedIn</label>
                {isEditing ? (
                  <input name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} className="w-full h-10 px-3 rounded-lg bg-slate-50 text-[14px] outline-none" />
                ) : (
                  <a href={employee.linkedinUrl} target="_blank" rel="noreferrer" className="text-[14px] font-bold text-[#2563EB] hover:underline flex items-center gap-1">
                    Profile <FaLinkedin size={12} />
                  </a>
                )}
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-1">GitHub</label>
                {isEditing ? (
                  <input name="githubUrl" value={formData.githubUrl} onChange={handleChange} className="w-full h-10 px-3 rounded-lg bg-slate-50 text-[14px] outline-none" />
                ) : (
                  <a href={employee.githubUrl} target="_blank" rel="noreferrer" className="text-[14px] font-bold text-[#0F172A] hover:underline flex items-center gap-1">
                    Repository <FaGithub size={12} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
