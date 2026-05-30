import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail, Link as LinkIcon, Home, ShieldAlert, Check, AlertCircle, Save, Bell, Palette } from 'lucide-react';
import api from '../../../services/api';
import { demoDashboardData } from './employeeWorkspaceData';

export default function EmployeeSettings() {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Profile Form state
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    bio: '',
    skillsInput: '',
    techStackInput: '',
    linkedinUrl: '',
    githubUrl: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    emergencyName: '',
    emergencyRelation: '',
    emergencyPhone: ''
  });

  // Theme & Notification local settings
  const [theme, setTheme] = useState(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    taskAssignments: true,
    weeklyReport: false,
    systemUpdates: true
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/employees');
      if (res.data.success) {
        const emp = res.data.employees?.[0] || { _id: 'demo-profile', ...demoDashboardData.profile, phone: '+91 98765 43210', bio: 'Frontend engineer focused on employee experience, dashboards, and workflow systems.', skills: ['React', 'UX Systems', 'Data Visualization'], techStack: ['React', 'Node.js', 'MongoDB'] };
        setEmployee(emp);
        setFormData({
          fullName: emp.fullName || '',
          phone: emp.phone || '',
          bio: emp.bio || '',
          skillsInput: emp.skills ? emp.skills.join(', ') : '',
          techStackInput: emp.techStack ? emp.techStack.join(', ') : '',
          linkedinUrl: emp.linkedinUrl || '',
          githubUrl: emp.githubUrl || '',
          street: emp.address?.street || '',
          city: emp.address?.city || '',
          state: emp.address?.state || '',
          zip: emp.address?.zip || '',
          emergencyName: emp.emergencyContact?.name || '',
          emergencyRelation: emp.emergencyContact?.relationship || '',
          emergencyPhone: emp.emergencyContact?.phone || ''
        });
      }
    } catch (err) {
      console.error(err);
      const emp = { _id: 'demo-profile', ...demoDashboardData.profile, phone: '+91 98765 43210', bio: 'Frontend engineer focused on employee experience, dashboards, and workflow systems.', skills: ['React', 'UX Systems', 'Data Visualization'], techStack: ['React', 'Node.js', 'MongoDB'] };
      setEmployee(emp);
      setFormData(prev => ({
        ...prev,
        fullName: emp.fullName,
        phone: emp.phone,
        bio: emp.bio,
        skillsInput: emp.skills.join(', '),
        techStackInput: emp.techStack.join(', '),
      }));
      setError('Failed to fetch your organizational profile. Showing local workspace profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    const skills = formData.skillsInput
      ? formData.skillsInput.split(',').map(s => s.trim()).filter(Boolean)
      : [];
    const techStack = formData.techStackInput
      ? formData.techStackInput.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    const payload = {
      fullName: formData.fullName,
      phone: formData.phone,
      bio: formData.bio,
      skills,
      techStack,
      linkedinUrl: formData.linkedinUrl,
      githubUrl: formData.githubUrl,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zip: formData.zip
      },
      emergencyContact: {
        name: formData.emergencyName,
        relationship: formData.emergencyRelation,
        phone: formData.emergencyPhone
      }
    };

    try {
      if (employee._id === 'demo-profile') {
        setSuccessMsg('Your local profile preferences have been updated.');
        setEmployee(prev => ({ ...prev, ...payload }));
        return;
      }
      const res = await api.put(`/employees/${employee._id}`, payload);
      if (res.data.success) {
        setSuccessMsg('Your profile has been updated successfully!');
        setEmployee(res.data.employee);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleNotifChange = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 text-gray-900 dark:text-[#EDF0FA]">
      
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight font-syne dark:text-white flex items-center gap-2">
          My <span className="text-blue-600 dark:text-blue-400">Settings</span>
        </h1>
        <p className="text-sm text-gray-500 dark:text-[#8892B8] mt-1">
          Configure notifications, toggle display preferences, and update your public directory card.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-2xl flex items-center gap-3 text-sm">
          <Check size={18} className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl flex items-center gap-3 text-sm">
          <AlertCircle className="shrink-0 w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: SYSTEM PREFERENCES & NOTIFICATION */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          {/* Theme switcher */}
          <div className="glass-card p-6 flex flex-col gap-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-blue-500 flex items-center gap-2 border-b border-gray-100 dark:border-white/[0.04] pb-2 mb-2">
              <Palette size={16} />
              Display Mode
            </h3>
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-xs font-bold">Dark Theme</h4>
                <p className="text-[10px] text-gray-400">Adjust the interface to match your workspace ambient light.</p>
              </div>
              <button
                onClick={toggleTheme}
                className="w-12 h-6 rounded-full bg-gray-200 dark:bg-blue-600 relative transition-colors duration-300 cursor-pointer"
              >
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 dark:left-6 transition-all duration-300 shadow" />
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="glass-card p-6 flex flex-col gap-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-blue-500 flex items-center gap-2 border-b border-gray-100 dark:border-white/[0.04] pb-2 mb-2">
              <Bell size={16} />
              Notifications
            </h3>
            <div className="flex flex-col gap-3.5">
              {Object.entries(notifications).map(([key, val]) => (
                <label key={key} className="flex justify-between items-center cursor-pointer select-none">
                  <div>
                    <h4 className="text-xs font-bold capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </h4>
                    <p className="text-[10px] text-gray-400">Get updates about this category.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={val}
                    onChange={() => handleNotifChange(key)}
                    className="rounded border-gray-300 dark:border-white/10 dark:bg-white/5"
                  />
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PROFILE CARD & DIRECTORY EDIT */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <form onSubmit={handleSaveProfile} className="glass-card p-6 flex flex-col gap-6">
            
            {/* Sec 1: Profile Details */}
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-blue-500 flex items-center gap-2 border-b border-gray-100 dark:border-white/[0.04] pb-2 mb-4">
                <User size={16} />
                1. Directory Profile Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-500 dark:text-[#8892B8] uppercase block mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full text-xs p-2.5 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-500 dark:text-[#8892B8] uppercase block mb-1.5">Contact Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full text-xs p-2.5 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-500 dark:text-[#8892B8] uppercase block mb-1.5">Skills (Comma-separated)</label>
                  <input
                    type="text"
                    name="skillsInput"
                    value={formData.skillsInput}
                    onChange={handleInputChange}
                    className="w-full text-xs p-2.5 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-500 dark:text-[#8892B8] uppercase block mb-1.5">Tech Stack (Comma-separated)</label>
                  <input
                    type="text"
                    name="techStackInput"
                    value={formData.techStackInput}
                    onChange={handleInputChange}
                    className="w-full text-xs p-2.5 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[11px] font-bold text-gray-500 dark:text-[#8892B8] uppercase block mb-1.5">Biography</label>
                  <textarea
                    name="bio"
                    rows="3"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full text-xs p-2.5 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Sec 2: Social Links */}
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-blue-500 flex items-center gap-2 border-b border-gray-100 dark:border-white/[0.04] pb-2 mb-4">
                <LinkIcon size={16} />
                2. Social Presence
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-500 dark:text-[#8892B8] uppercase block mb-1.5">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    name="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={handleInputChange}
                    className="w-full text-xs p-2.5 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-500 dark:text-[#8892B8] uppercase block mb-1.5">GitHub Profile URL</label>
                  <input
                    type="url"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleInputChange}
                    className="w-full text-xs p-2.5 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Sec 3: Address */}
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-blue-500 flex items-center gap-2 border-b border-gray-100 dark:border-white/[0.04] pb-2 mb-4">
                <Home size={16} />
                3. Address
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-500 dark:text-[#8892B8] uppercase block mb-1.5">Street Address</label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    className="w-full text-xs p-2.5 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-500 dark:text-[#8892B8] uppercase block mb-1.5">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full text-xs p-2.5 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-500 dark:text-[#8892B8] uppercase block mb-1.5">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full text-xs p-2.5 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-500 dark:text-[#8892B8] uppercase block mb-1.5">Zip Code</label>
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      className="w-full text-xs p-2.5 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sec 4: Emergency Contact */}
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-blue-500 flex items-center gap-2 border-b border-gray-100 dark:border-white/[0.04] pb-2 mb-4">
                <ShieldAlert size={16} />
                4. Emergency Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-500 dark:text-[#8892B8] uppercase block mb-1.5">Name</label>
                  <input
                    type="text"
                    name="emergencyName"
                    value={formData.emergencyName}
                    onChange={handleInputChange}
                    className="w-full text-xs p-2.5 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-500 dark:text-[#8892B8] uppercase block mb-1.5">Relationship</label>
                  <input
                    type="text"
                    name="emergencyRelation"
                    value={formData.emergencyRelation}
                    onChange={handleInputChange}
                    className="w-full text-xs p-2.5 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-500 dark:text-[#8892B8] uppercase block mb-1.5">Phone</label>
                  <input
                    type="text"
                    name="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={handleInputChange}
                    className="w-full text-xs p-2.5 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/[0.04]">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/10 cursor-pointer disabled:opacity-50"
              >
                <Save size={14} />
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>

          </form>
        </div>

      </div>

    </div>
  );
}
