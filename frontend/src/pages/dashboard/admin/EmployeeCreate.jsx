import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserPlus, ArrowLeft, Save, Sparkles, AlertCircle, User, Mail, Lock,
  Phone, Briefcase, Calendar, Clock, MapPin, HeartPulse, Compass,
  ChevronDown, Check, Award
} from 'lucide-react';
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

/* ─── CUSTOM REUSABLE FORM ELEMENTS ─── */
const InputField = ({ label, icon: Icon, required, ...props }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[11px] font-extrabold text-gray-400 dark:text-[#5A6282] uppercase tracking-wider block pl-1 select-none">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    <div className="relative group">
      {Icon && (
        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-450 dark:text-[#8892B8] pointer-events-none group-focus-within:text-blue-500 transition-colors">
          <Icon size={16} />
        </span>
      )}
      <input
        required={required}
        {...props}
        className={`w-full text-sm py-3.5 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-250 dark:border-white/[0.06] hover:border-blue-500/30 text-gray-900 dark:text-[#EDF0FA] placeholder-gray-400/50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200 shadow-sm ${Icon ? 'pl-12' : 'pl-4'} pr-4`}
      />
    </div>
  </div>
);

const SelectField = ({ label, icon: Icon, required, children, ...props }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[11px] font-extrabold text-gray-400 dark:text-[#5A6282] uppercase tracking-wider block pl-1 select-none">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    <div className="relative group">
      {Icon && (
        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-450 dark:text-[#8892B8] pointer-events-none">
          <Icon size={16} />
        </span>
      )}
      <select
        required={required}
        {...props}
        className={`w-full text-sm py-3.5 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-250 dark:border-white/[0.06] hover:border-blue-500/30 text-gray-800 dark:text-[#EDF0FA] focus:outline-none cursor-pointer appearance-none shadow-sm ${Icon ? 'pl-12' : 'pl-4'} pr-10 font-medium`}
      >
        {children}
      </select>
      <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-[#5A6282] pointer-events-none">
        <ChevronDown size={16} />
      </span>
    </div>
  </div>
);

const TextareaField = ({ label, icon: Icon, ...props }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[11px] font-extrabold text-gray-400 dark:text-[#5A6282] uppercase tracking-wider block pl-1 select-none">
      {label}
    </label>
    <div className="relative group">
      {Icon && (
        <span className="absolute top-4 left-4 text-gray-450 dark:text-[#8892B8] pointer-events-none">
          <Icon size={16} />
        </span>
      )}
      <textarea
        {...props}
        className={`w-full text-sm py-3.5 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-250 dark:border-white/[0.06] hover:border-blue-500/30 text-gray-900 dark:text-[#EDF0FA] placeholder-gray-400/50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200 shadow-sm ${Icon ? 'pl-12' : 'pl-4'} pr-4`}
      />
    </div>
  </div>
);

export default function EmployeeCreate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form state structure matching model fields
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'employee',
    department: 'Engineering',
    designation: '',
    phone: '',
    joiningDate: new Date().toISOString().split('T')[0],
    experienceLevel: 'junior',
    experience: 0,
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
    emergencyPhone: '',
    bio: ''
  });

  useEffect(() => {
    const nameParam = searchParams.get('name') || '';
    const roleParam = searchParams.get('role') || '';
    if (nameParam || roleParam) {
      setFormData(prev => ({
        ...prev,
        fullName: nameParam,
        designation: roleParam
      }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'experience' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Parse comma-separated inputs
    const skills = formData.skillsInput
      ? formData.skillsInput.split(',').map(s => s.trim()).filter(Boolean)
      : [];
    const techStack = formData.techStackInput
      ? formData.techStackInput.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      department: formData.department,
      designation: formData.designation,
      phone: formData.phone,
      joiningDate: formData.joiningDate,
      experienceLevel: formData.experienceLevel,
      experience: formData.experience,
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
        relation: formData.emergencyRelation,
        phone: formData.emergencyPhone
      },
      bio: formData.bio
    };

    try {
      const res = await api.post('/employees', payload);
      if (res.data && res.data.success) {
        alert('Employee created successfully!');
        navigate('/dashboard/admin/employees');
      } else {
        setError(res.data.message || 'Failed to create employee profile.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to connect to server to onboard employee.');
    } finally {
      setLoading(false);
    }
  };

  // Real-time onboarding progress calculations
  const requiredFields = ['fullName', 'email', 'password'];
  const filledRequiredCount = requiredFields.filter(f => formData[f]?.trim().length > 0).length;
  const completionPercentage = Math.round((filledRequiredCount / requiredFields.length) * 100);

  // Status for left-column section indexes
  const isSection1Completed = formData.fullName?.trim() && formData.email?.trim() && formData.password?.trim();
  const isSection2Completed = formData.designation?.trim() && formData.skillsInput?.trim();
  const isSection3Completed = formData.street?.trim() && formData.city?.trim() && formData.zip?.trim();
  const isSection4Completed = formData.emergencyName?.trim() && formData.emergencyPhone?.trim();
  const isSection5Completed = formData.bio?.trim();

  return (
    <div className="flex flex-col gap-8 text-gray-900 dark:text-[#EDF0FA]">
      
      {/* ─── HEADER & NAV ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard/admin/employees"
            className="p-2.5 border border-gray-200 dark:border-white/[0.06] hover:bg-gray-150 dark:hover:bg-white/[0.04] text-gray-650 dark:text-[#EDF0FA] rounded-xl transition-all cursor-pointer hover:-translate-x-0.5 shadow-sm"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight font-syne dark:text-white flex items-center gap-2">
              Onboard <span className="text-blue-600 dark:text-blue-400">New Hire</span>
              <Sparkles className="w-5 h-5 text-blue-500" />
            </h1>
            <p className="text-sm text-gray-500 dark:text-[#8892B8] mt-1">
              Provision an active organization profile and system access credentials.
            </p>
          </div>
        </div>
      </div>

      {/* ─── ERROR INDICATOR ─── */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl flex items-center gap-3 text-sm"
        >
          <AlertCircle className="shrink-0 w-5 h-5" />
          <span>{error}</span>
        </motion.div>
      )}

      {/* ─── MAIN TWO-COLUMN BENTO GRID ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: TRACKER SIDEBAR */}
        <div className="lg:col-span-3 lg:sticky lg:top-20 flex flex-col gap-4">
          
          {/* Progress Bar Card */}
          <div className="glass-card p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Sparkles size={14} className="animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-[#EDF0FA]">Onboarding Status</h4>
                <p className="text-[10px] text-gray-400 dark:text-[#5A6282] mt-0.5">Required milestones</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mt-1.5">
              <div className="progress-bar flex-1 bg-gray-100 dark:bg-white/[0.04] h-2 rounded-full overflow-hidden">
                <div 
                  className="progress-bar-fill h-full bg-blue-500 transition-all duration-500 ease-out" 
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <span className="text-xs font-mono font-bold text-blue-500">{completionPercentage}%</span>
            </div>
          </div>

          {/* Checklist Sections Card */}
          <div className="glass-card p-6 flex flex-col gap-4">
            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 dark:text-[#5A6282] pb-1.5 border-b border-gray-100 dark:border-white/[0.04]">
              Milestones Check
            </h4>
            <div className="flex flex-col gap-3">
              
              {/* Step 1 */}
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${isSection1Completed ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-white/[0.03] text-gray-400'}`}>
                  {isSection1Completed ? <Check size={11} className="stroke-[3px]" /> : <span className="text-[10px] font-bold">1</span>}
                </div>
                <span className={`text-xs font-semibold ${isSection1Completed ? 'text-gray-900 dark:text-[#EDF0FA]' : 'text-gray-400'}`}>Credentials</span>
              </div>

              {/* Step 2 */}
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${isSection2Completed ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-white/[0.03] text-gray-400'}`}>
                  {isSection2Completed ? <Check size={11} className="stroke-[3px]" /> : <span className="text-[10px] font-bold">2</span>}
                </div>
                <span className={`text-xs font-semibold ${isSection2Completed ? 'text-gray-900 dark:text-[#EDF0FA]' : 'text-gray-400'}`}>Role & Skills</span>
              </div>

              {/* Step 3 */}
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${isSection3Completed ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-white/[0.03] text-gray-400'}`}>
                  {isSection3Completed ? <Check size={11} className="stroke-[3px]" /> : <span className="text-[10px] font-bold">3</span>}
                </div>
                <span className={`text-xs font-semibold ${isSection3Completed ? 'text-gray-900 dark:text-[#EDF0FA]' : 'text-gray-400'}`}>Address</span>
              </div>

              {/* Step 4 */}
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${isSection4Completed ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-white/[0.03] text-gray-400'}`}>
                  {isSection4Completed ? <Check size={11} className="stroke-[3px]" /> : <span className="text-[10px] font-bold">4</span>}
                </div>
                <span className={`text-xs font-semibold ${isSection4Completed ? 'text-gray-900 dark:text-[#EDF0FA]' : 'text-gray-400'}`}>Emergency</span>
              </div>

              {/* Step 5 */}
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${isSection5Completed ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-white/[0.03] text-gray-400'}`}>
                  {isSection5Completed ? <Check size={11} className="stroke-[3px]" /> : <span className="text-[10px] font-bold">5</span>}
                </div>
                <span className={`text-xs font-semibold ${isSection5Completed ? 'text-gray-900 dark:text-[#EDF0FA]' : 'text-gray-400'}`}>Bio & Socials</span>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: INTERACTIVE FORM */}
        <motion.form 
          onSubmit={handleSubmit}
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="lg:col-span-9 flex flex-col gap-8"
        >
          
          {/* SECTION 1: ACCOUNT & PERSONAL INFO */}
          <motion.div variants={sectionVariants} className="glass-card p-8 flex flex-col gap-6">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-blue-500 border-b border-gray-100 dark:border-white/[0.04] pb-3 mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              1. Account & Personal Info
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Full Name"
                name="fullName"
                required
                icon={User}
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Alexander Pierce"
              />
              <InputField
                label="Corporate Email"
                name="email"
                type="email"
                required
                icon={Mail}
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. alex.p@aeccentric.com"
              />
              <InputField
                label="Password"
                name="password"
                type="password"
                required
                icon={Lock}
                value={formData.password}
                onChange={handleChange}
                placeholder="Temporary password"
              />
              <InputField
                label="Contact Number"
                name="phone"
                icon={Phone}
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +1 (555) 019-2834"
              />
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField
                  label="Role Group"
                  name="role"
                  icon={UserPlus}
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="hr">HR Specialist</option>
                  <option value="admin">Administrator</option>
                </SelectField>
              </div>
            </div>
          </motion.div>

          {/* SECTION 2: PROFESSIONAL PROFILE */}
          <motion.div variants={sectionVariants} className="glass-card p-8 flex flex-col gap-6">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-blue-500 border-b border-gray-100 dark:border-white/[0.04] pb-3 mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              2. Professional Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField
                label="Department"
                name="department"
                icon={Briefcase}
                value={formData.department}
                onChange={handleChange}
              >
                <option value="Engineering">Engineering</option>
                <option value="Product">Product Management</option>
                <option value="Design">UI/UX Design</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="HR">Human Resources</option>
                <option value="Finance">Finance</option>
              </SelectField>
              
              <InputField
                label="Designation"
                name="designation"
                icon={Briefcase}
                value={formData.designation}
                onChange={handleChange}
                placeholder="e.g. Senior Frontend Architect"
              />

              <SelectField
                label="Experience Level"
                name="experienceLevel"
                icon={Award}
                value={formData.experienceLevel}
                onChange={handleChange}
              >
                <option value="junior">Junior</option>
                <option value="mid">Mid-level</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead / Principal</option>
              </SelectField>

              <InputField
                label="Years of Experience"
                name="experience"
                type="number"
                min="0"
                icon={Clock}
                value={formData.experience}
                onChange={handleChange}
              />

              <InputField
                label="Joining Date"
                name="joiningDate"
                type="date"
                icon={Calendar}
                value={formData.joiningDate}
                onChange={handleChange}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3">
              <InputField
                label="Skills (Comma-separated)"
                name="skillsInput"
                icon={Compass}
                value={formData.skillsInput}
                onChange={handleChange}
                placeholder="e.g. React, NodeJS, Redux Toolkit"
              />
              <InputField
                label="Tech Stack (Comma-separated)"
                name="techStackInput"
                icon={Compass}
                value={formData.techStackInput}
                onChange={handleChange}
                placeholder="e.g. MERN, AWS Cloudfront, TailwindCSS"
              />
            </div>
          </motion.div>

          {/* SECTION 3: ADDRESS & EMERGENCY */}
          <motion.div variants={sectionVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Address */}
            <div className="glass-card p-8 flex flex-col gap-6">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-blue-500 border-b border-gray-100 dark:border-white/[0.04] pb-3 mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                3. Permanent Address
              </h3>
              <div className="flex flex-col gap-6">
                <InputField
                  label="Street Address"
                  name="street"
                  icon={MapPin}
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="123 Science Center Dr, Suite 500"
                />
                <div className="grid grid-cols-2 gap-5">
                  <InputField
                    label="City"
                    name="city"
                    icon={MapPin}
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="San Francisco"
                  />
                  <InputField
                    label="State"
                    name="state"
                    icon={MapPin}
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="CA"
                  />
                </div>
                <InputField
                  label="Zip Code"
                  name="zip"
                  icon={MapPin}
                  value={formData.zip}
                  onChange={handleChange}
                  placeholder="94107"
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="glass-card p-8 flex flex-col gap-6">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-blue-500 border-b border-gray-100 dark:border-white/[0.04] pb-3 mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                4. Emergency Contact
              </h3>
              <div className="flex flex-col gap-6">
                <InputField
                  label="Contact Name"
                  name="emergencyName"
                  icon={HeartPulse}
                  value={formData.emergencyName}
                  onChange={handleChange}
                  placeholder="e.g. Martha Pierce"
                />
                <div className="grid grid-cols-2 gap-5">
                  <InputField
                    label="Relationship"
                    name="emergencyRelation"
                    icon={HeartPulse}
                    value={formData.emergencyRelation}
                    onChange={handleChange}
                    placeholder="Spouse / Parent / Sibling"
                  />
                  <InputField
                    label="Phone Number"
                    name="emergencyPhone"
                    icon={Phone}
                    value={formData.emergencyPhone}
                    onChange={handleChange}
                    placeholder="+1 (555) 012-3456"
                  />
                </div>
              </div>
            </div>

          </motion.div>

          {/* SECTION 4: SOCIALS & BIO */}
          <motion.div variants={sectionVariants} className="glass-card p-8 flex flex-col gap-6">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-blue-500 border-b border-gray-100 dark:border-white/[0.04] pb-3 mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              5. Professional Identity & Biography
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="LinkedIn Profile URL"
                name="linkedinUrl"
                type="url"
                icon={Compass}
                value={formData.linkedinUrl}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/alex-pierce"
              />
              <InputField
                label="GitHub Profile URL"
                name="githubUrl"
                type="url"
                icon={Compass}
                value={formData.githubUrl}
                onChange={handleChange}
                placeholder="https://github.com/alexpierce"
              />
            </div>
            <div className="pt-3">
              <TextareaField
                label="Biography"
                name="bio"
                rows="4"
                icon={Compass}
                value={formData.bio}
                onChange={handleChange}
                placeholder="Provide a brief summary of the employee's background, past experiences, and interests."
              />
            </div>
          </motion.div>

          {/* SUBMIT ACTIONS */}
          <motion.div variants={sectionVariants} className="flex justify-end gap-4 pt-6 border-t border-gray-100 dark:border-white/[0.04]">
            <Link
              to="/dashboard/admin/employees"
              className="px-6 py-3 bg-gray-100 hover:bg-gray-250 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-gray-700 dark:text-[#EDF0FA] rounded-xl text-sm font-bold transition-all cursor-pointer hover:shadow-sm"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2.5 px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-600/10 hover:shadow-blue-600/20 disabled:opacity-50 cursor-pointer"
            >
              <Save size={16} />
              {loading ? 'Onboarding...' : 'Save Profile'}
            </button>
          </motion.div>

        </motion.form>

      </div>

    </div>
  );
}
