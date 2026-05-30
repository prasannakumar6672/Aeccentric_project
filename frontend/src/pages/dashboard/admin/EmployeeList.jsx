import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Plus, Edit, Trash2, Eye, Users, CheckCircle,
  Clock, UserX, ChevronDown, RefreshCw, Sparkles, Check,
  Briefcase, Award, SlidersHorizontal
} from 'lucide-react';
import api from '../../../services/api';

/* ─── ANIMATION VARIANTS ─── */
const containerVariants = {
  animate: { transition: { staggerChildren: 0.04 } }
};

const rowVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, x: -15, transition: { duration: 0.2 } }
};

// ─── DEPARTMENT TO AVATAR STYLING MAP ───
const getAvatarClass = (dept) => {
  const d = dept?.toLowerCase() || '';
  if (d.includes('eng')) return 'avatar-engineering';
  if (d.includes('hr') || d.includes('human')) return 'avatar-hr';
  if (d.includes('market')) return 'avatar-marketing';
  if (d.includes('oper')) return 'avatar-operations';
  if (d.includes('fin')) return 'avatar-finance';
  if (d.includes('prod')) return 'avatar-product';
  return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
};

// ─── CUSTOM ANNOTATED DROPDOWN FILTER COMPONENT ───
function CustomSelect({ label, value, onChange, options, icon: Icon }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getOptionLabel = (opt) => {
    if (typeof opt === 'string') {
      if (opt === 'All') return 'All';
      if (opt === 'active') return 'Active';
      if (opt === 'on_leave') return 'On Leave';
      if (opt === 'inactive') return 'Inactive';
      if (opt === 'junior') return 'Junior';
      if (opt === 'mid') return 'Mid-Level';
      if (opt === 'senior') return 'Senior';
      if (opt === 'lead') return 'Lead';
      if (opt === 'newest') return 'Newest Joiners';
      if (opt === 'joining-asc') return 'Oldest Joiners';
      if (opt === 'name-asc') return 'Name (A-Z)';
      if (opt === 'name-desc') return 'Name (Z-A)';
      return opt.charAt(0).toUpperCase() + opt.slice(1);
    }
    return opt.label;
  };

  const getOptionValue = (opt) => {
    if (typeof opt === 'string') return opt;
    return opt.value;
  };

  const selectedLabel = getOptionLabel(value);

  return (
    <div className="flex flex-col gap-1.5 relative select-none" ref={dropdownRef}>
      <label className="text-[9px] font-bold text-gray-400 dark:text-[#5A6282] uppercase tracking-wider pl-1 select-none">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between text-xs px-3.5 py-2.5 rounded-xl bg-[var(--surface-L2)] border border-[var(--border-default)] hover:border-blue-500/50 hover:bg-[var(--surface-L3)] text-gray-700 dark:text-[#EDF0FA] focus:outline-none transition-all duration-150 ease-in-out cursor-pointer min-w-[135px] font-semibold shadow-sm animate-fade-in"
      >
        <div className="flex items-center gap-2 truncate">
          {Icon && <Icon size={13} className="text-gray-400 dark:text-[#8892B8] shrink-0" />}
          <span className="truncate">{selectedLabel}</span>
        </div>
        <ChevronDown size={12} className={`text-gray-450 ml-2 transition-transform duration-250 shrink-0 ${isOpen ? 'rotate-180 text-blue-500' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-50 left-0 mt-1.5 w-44 overflow-y-auto rounded-xl bg-[var(--surface-L1)] border border-[var(--border-default)] shadow-lg dark:shadow-black/50 custom-scrollbar py-1"
          >
            {options.map((opt) => {
              const optVal = getOptionValue(opt);
              const optLbl = getOptionLabel(opt);
              const isSelected = optVal === value;

              return (
                <button
                  key={optVal}
                  type="button"
                  onClick={() => {
                    onChange(optVal);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left text-xs px-3.5 py-2.5 transition-colors duration-100 flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold border-l-2 border-blue-500 pl-2.5'
                      : 'text-gray-600 dark:text-[#EDF0FA] hover:bg-[var(--surface-L2)] pl-3'
                  }`}
                >
                  <span className="truncate">{optLbl}</span>
                  {isSelected && (
                    <Check size={12} className="text-blue-500 shrink-0 ml-1.5" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function EmployeeList() {
  // ─── STATE MANAGEMENT ───
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);
  
  // Search & Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedExp, setSelectedExp] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const searchInputRef = useRef(null);

  // Keyboard shortcut listener to focus search when '/' is pressed
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Load employees
  const fetchEmployees = async (showLoadingState = true) => {
    try {
      if (showLoadingState) setLoading(true);
      setError(null);
      const res = await api.get('/employees');
      if (res.data && res.data.success) {
        setEmployees(res.data.employees || []);
      } else {
        setEmployees([]);
        setError('Could not retrieve employees.');
      }
    } catch (err) {
      setEmployees([]);
      setError(err?.response?.data?.message || 'Employee directory is unavailable.');
    } finally {
      if (showLoadingState) setLoading(false);
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSync = () => {
    setSyncing(true);
    fetchEmployees(false);
  };

  // Delete employee (Soft-delete / Deactivate)
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this employee? This will set their status to Inactive and block login access.')) return;
    
    try {
      // Opt-in backend call first
      await api.delete(`/employees/${id}`);
      // Update local state
      setEmployees(prev => prev.map(emp => emp._id === id ? { ...emp, status: 'inactive' } : emp));
      alert('Employee deactivated successfully.');
    } catch (err) {
      setError(err?.response?.data?.message || 'Employee could not be deactivated.');
    }
  };

  // ─── FILTERING & SORTING LOGIC ───
  const filteredEmployees = useMemo(() => {
    return employees
      .filter(emp => {
        const matchesSearch = 
          emp.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (emp.skills && emp.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))) ||
          (emp.techStack && emp.techStack.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));

        const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
        const matchesStatus = selectedStatus === 'All' || emp.status === selectedStatus;
        const matchesExp = selectedExp === 'All' || emp.experienceLevel === selectedExp;

        return matchesSearch && matchesDept && matchesStatus && matchesExp;
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') return a.fullName.localeCompare(b.fullName);
        if (sortBy === 'name-desc') return b.fullName.localeCompare(a.fullName);
        if (sortBy === 'joining-asc') return new Date(a.joiningDate) - new Date(b.joiningDate);
        return new Date(b.joiningDate) - new Date(a.joiningDate); // newest
      });
  }, [employees, searchTerm, selectedDept, selectedStatus, selectedExp, sortBy]);

  // Compute directory stats
  const stats = useMemo(() => {
    const total = employees.length;
    const active = employees.filter(e => e.status === 'active').length;
    const onLeave = employees.filter(e => e.status === 'on_leave').length;
    const inactive = employees.filter(e => e.status === 'inactive').length;
    return { total, active, onLeave, inactive };
  }, [employees]);

  // Unique departments for filter list
  const departments = useMemo(() => {
    const list = new Set(employees.map(e => e.department).filter(Boolean));
    return ['All', ...Array.from(list)];
  }, [employees]);

  return (
    <div className="flex flex-col gap-6 text-gray-900 dark:text-[#EDF0FA]">
      
      {/* ─── HEADER ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight font-syne dark:text-white flex items-center gap-2">
            Employee <span className="text-blue-600 dark:text-blue-400">Directory</span>
            <Sparkles className="w-5 h-5 text-blue-500" />
          </h1>
          <p className="text-sm text-gray-500 dark:text-[#8892B8] mt-1">
            Search, filter, onboard, and manage profiles across your entire workforce.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center justify-center p-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-gray-500 dark:text-[#EDF0FA] border border-gray-200 dark:border-white/[0.06] rounded-xl transition-all cursor-pointer disabled:opacity-50"
            title="Reload Employee Data"
          >
            <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
          </button>
          <Link
            to="/dashboard/admin/employees/create"
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/10 hover:shadow-blue-600/20 hover:-translate-y-0.5 cursor-pointer"
          >
            <Plus size={15} />
            Onboard New Employee
          </Link>
        </div>
      </div>

      {/* ─── SUMMARY STATS BAR ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Employees */}
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
            <Users size={20} />
          </div>
          <div>
            <div className="text-[10px] text-gray-400 dark:text-[#5A6282] uppercase font-bold tracking-wider">Total Headcount</div>
            <div className="text-xl font-bold font-syne mt-0.5">{loading ? '...' : stats.total}</div>
          </div>
        </div>

        {/* Active Staff */}
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <CheckCircle size={20} />
          </div>
          <div>
            <div className="text-[10px] text-gray-400 dark:text-[#5A6282] uppercase font-bold tracking-wider">Active Status</div>
            <div className="text-xl font-bold font-syne mt-0.5">{loading ? '...' : stats.active}</div>
          </div>
        </div>

        {/* On Leave */}
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <Clock size={20} />
          </div>
          <div>
            <div className="text-[10px] text-gray-400 dark:text-[#5A6282] uppercase font-bold tracking-wider">On Leave</div>
            <div className="text-xl font-bold font-syne mt-0.5">{loading ? '...' : stats.onLeave}</div>
          </div>
        </div>

        {/* Inactive */}
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
            <UserX size={20} />
          </div>
          <div>
            <div className="text-[10px] text-gray-400 dark:text-[#5A6282] uppercase font-bold tracking-wider">Deactivated</div>
            <div className="text-xl font-bold font-syne mt-0.5">{loading ? '...' : stats.inactive}</div>
          </div>
        </div>
      </div>

      {/* ─── FILTERS AND CONTROL BAR ─── */}
      <div className="glass-card p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-5 relative z-30 shadow-sm border border-[var(--border-default)] !overflow-visible">
        {/* Search */}
        <div className="relative flex-1 min-w-[320px] max-w-xl">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 pointer-events-none">
            <Search size={16} />
          </span>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search by name, role, skills... (Press '/' to focus)"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full text-[13px] pl-11 pr-11 py-3.5 rounded-xl bg-[var(--surface-L2)] border border-[var(--border-default)] hover:border-blue-500/40 text-gray-900 dark:text-[#EDF0FA] placeholder-gray-450 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200 shadow-inner font-medium h-[46px]"
          />
          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none select-none">
            <kbd className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-200/50 dark:bg-white/[0.04] text-gray-400 dark:text-[#5A6282] border border-gray-300 dark:border-white/[0.06]">
              /
            </kbd>
          </span>
        </div>

        {/* Filter selects */}
        <div className="flex flex-wrap items-center gap-4">
          <CustomSelect
            label="Department"
            value={selectedDept}
            onChange={setSelectedDept}
            options={departments}
            icon={Briefcase}
          />

          <CustomSelect
            label="Status"
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={['All', 'active', 'on_leave', 'inactive']}
            icon={CheckCircle}
          />

          <CustomSelect
            label="Level"
            value={selectedExp}
            onChange={setSelectedExp}
            options={['All', 'junior', 'mid', 'senior', 'lead']}
            icon={Award}
          />

          <CustomSelect
            label="Sort By"
            value={sortBy}
            onChange={setSortBy}
            options={['newest', 'joining-asc', 'name-asc', 'name-desc']}
            icon={SlidersHorizontal}
          />
        </div>
      </div>

      {/* ─── DIRECTORY TABLE ─── */}
      <div className="glass-card overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <RefreshCw size={24} className="text-blue-500 animate-spin" />
            <p className="text-xs font-bold text-gray-500">Loading Directory...</p>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="text-gray-400 w-10 h-10 mb-2 opacity-50 animate-pulse" />
            <p className="text-sm font-bold text-gray-500">No employees match your search/filters</p>
            <p className="text-xs text-gray-400 mt-1">Try tweaking your keyword search or active filter toggles.</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="data-table w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/[0.04] text-gray-400 dark:text-[#5A6282] font-extrabold uppercase tracking-wider text-[10px] bg-gray-50/50 dark:bg-white/[0.01]">
                  <th className="py-4 px-5">Employee</th>
                  <th className="py-4 px-5">Department & Level</th>
                  <th className="py-4 px-5 hidden md:table-cell">Skills / Tech Stack</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 hidden sm:table-cell">Joining Date</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/50 dark:divide-white/[0.02]">
                <AnimatePresence initial={false}>
                  {filteredEmployees.map((emp) => {
                    const initials = emp.fullName ? emp.fullName.split(' ').map(n => n[0]).join('').substring(0, 2) : 'E';
                    const deptClass = getAvatarClass(emp.department);
                    
                    return (
                      <motion.tr
                        key={emp._id}
                        variants={rowVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="hover:bg-gray-50/30 dark:hover:bg-white/[0.01] transition-all duration-200 group border-b border-gray-100 dark:border-white/[0.02]"
                      >
                        {/* Profile Info */}
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3.5">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs uppercase shadow-sm shrink-0 border border-black/5 dark:border-white/5 transition-transform duration-250 group-hover:scale-105 ${deptClass}`}>
                              {initials}
                            </div>
                            <div>
                              <div className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-150">{emp.fullName}</div>
                              <div className="text-[10px] text-gray-400 dark:text-[#8892B8] mt-0.5 font-medium">{emp.userId?.email || 'no-email@aeccentric.com'}</div>
                            </div>
                          </div>
                        </td>

                        {/* Dept & Designation */}
                        <td className="py-3.5 px-5">
                          <div className="font-bold text-gray-700 dark:text-[#EDF0FA]">{emp.department || 'N/A'}</div>
                          <div className="text-[10px] text-gray-400 dark:text-[#8892B8] flex items-center gap-1.5 mt-1 font-medium">
                            <span>{emp.designation}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-white/10" />
                            <span className="uppercase text-[9px] font-extrabold text-blue-500 dark:text-blue-400 tracking-wider">{emp.experienceLevel}</span>
                          </div>
                        </td>

                        {/* Tech stack / Skills */}
                        <td className="py-3.5 px-5 max-w-[200px] hidden md:table-cell">
                          <div className="flex flex-wrap gap-1.5">
                            {emp.skills && emp.skills.slice(0, 3).map((skill, i) => (
                              <span key={i} className="px-2 py-0.5 bg-blue-500/5 hover:bg-blue-500/10 dark:bg-white/[0.02] dark:hover:bg-white/[0.04] text-blue-600 dark:text-blue-400 rounded-full text-[9px] font-semibold border border-blue-500/10 dark:border-white/[0.04] transition-all duration-150">
                                {skill}
                              </span>
                            ))}
                            {emp.skills && emp.skills.length > 3 && (
                              <span className="text-[9px] font-bold text-gray-400 self-center px-1">
                                +{emp.skills.length - 3}
                              </span>
                            )}
                            {(!emp.skills || emp.skills.length === 0) && (
                              <span className="text-gray-400 dark:text-[#5A6282] italic text-[10px]">No skills defined</span>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-5">
                          <span className={`chip inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-extrabold ${
                            emp.status === 'active' ? 'chip-success' :
                            emp.status === 'on_leave' ? 'chip-warning' :
                            'chip-neutral'
                          }`}>
                            {emp.status === 'active' && <span className="live-dot mr-1 animate-pulse" />}
                            {emp.status === 'active' ? 'Active' : emp.status === 'on_leave' ? 'On Leave' : 'Inactive'}
                          </span>
                        </td>

                        {/* Join Date */}
                        <td className="py-3.5 px-5 text-gray-500 dark:text-[#8892B8] font-medium text-[11px] hidden sm:table-cell">
                          {new Date(emp.joiningDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-5 text-right">
                          <div className="flex justify-end gap-2 actions opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Link
                              to={`/dashboard/admin/employees/${emp._id}`}
                              className="p-2 border border-gray-200 dark:border-white/[0.06] hover:bg-gray-100 dark:hover:bg-white/[0.04] hover:text-blue-500 dark:hover:text-blue-400 text-gray-600 dark:text-[#EDF0FA] rounded-xl transition-all duration-150 cursor-pointer shadow-sm"
                              title="View Profile"
                            >
                              <Eye size={13} />
                            </Link>
                            <Link
                              to={`/dashboard/admin/employees/edit/${emp._id}`}
                              className="p-2 border border-gray-200 dark:border-white/[0.06] hover:bg-blue-500/10 hover:text-blue-500 text-gray-600 dark:text-[#EDF0FA] rounded-xl transition-all duration-150 cursor-pointer shadow-sm"
                              title="Edit Employee"
                            >
                              <Edit size={13} />
                            </Link>
                            {emp.status !== 'inactive' ? (
                              <button
                                onClick={() => handleDelete(emp._id)}
                                className="p-2 border border-gray-200 dark:border-white/[0.06] hover:bg-rose-500/10 text-rose-500 rounded-xl transition-all duration-150 cursor-pointer shadow-sm"
                                title="Deactivate Employee"
                              >
                                <Trash2 size={13} />
                              </button>
                            ) : (
                              <div className="w-8" />
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

// ─── HIGH-FIDELITY SEED DATA FALLBACK ───
