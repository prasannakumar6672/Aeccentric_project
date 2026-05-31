import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, CheckCircle, XCircle, Users, 
  Play, Square, CalendarCheck, Search, Filter, ChevronDown
} from 'lucide-react';
import api from '../../../services/api';

/* ─── ANIMATION VARIANTS ─────────────────────────────────────── */
const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
};

export default function Attendance() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [myLogs, setMyLogs] = useState([]);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [todayRecord, setTodayRecord] = useState(null);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  /* Filters & sorting */
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedDate, setSelectedDate] = useState('');

  /* Get user info */
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('ems_user') || '{}');
    } catch {
      return {};
    }
  })();
  
  const role = storedUser.role || 'employee';
  const isAdmin = ['super_admin', 'admin', 'hr'].includes(role);

  const fetchAttendance = async () => {
    setLoading(true);
    setError(null);
    try {
      if (isAdmin) {
        // Fetch all logs
        let url = `/attendance?sort=${sortOrder}`;
        if (selectedStatus !== 'All') url += `&status=${selectedStatus}`;
        if (selectedDate) url += `&date=${selectedDate}`;
        const res = await api.get(url);
        if (res.data?.success) {
          setLogs(res.data.logs || []);
        }
      } else {
        // Fetch my logs
        let url = `/attendance/my?sort=${sortOrder}`;
        if (selectedStatus !== 'All') url += `&status=${selectedStatus}`;
        if (selectedDate) url += `&date=${selectedDate}`;
        const res = await api.get(url);
        if (res.data?.success) {
          const fetchedLogs = res.data.logs || [];
          setMyLogs(fetchedLogs);
          
          // Check if checked in today
          const startOfToday = new Date();
          startOfToday.setHours(0,0,0,0);
          
          const todayRec = fetchedLogs.find(log => {
            const logDate = new Date(log.date);
            logDate.setHours(0,0,0,0);
            return logDate.getTime() === startOfToday.getTime();
          });

          if (todayRec) {
            setTodayRecord(todayRec);
            setIsCheckedIn(!!todayRec.checkIn && !todayRec.checkOut);
          } else {
            setTodayRecord(null);
            setIsCheckedIn(false);
          }
        }
      }
    } catch {
      if (!isAdmin) setMyLogs([]);
      setError('Could not sync attendance ledger with live servers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [isAdmin, sortOrder, selectedStatus, selectedDate]);

  const handleCheckIn = async () => {
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await api.post('/attendance/check-in');
      if (res.data?.success) {
        setIsCheckedIn(true);
        setSuccessMsg('Successfully clocked in for today!');
        fetchAttendance();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Check-in transaction failed.');
    }
  };

  const handleCheckOut = async () => {
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await api.post('/attendance/check-out');
      if (res.data?.success) {
        setIsCheckedIn(false);
        setSuccessMsg('Successfully clocked out for today. Have a nice evening!');
        fetchAttendance();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Check-out transaction failed.');
    }
  };

  /* Filter admin logs in memory */
  const filteredLogs = logs.filter(log => {
    const name = log.employee?.fullName || '';
    const dept = log.employee?.department || '';
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || dept.toLowerCase() === selectedDept.toLowerCase();
    return matchesSearch && matchesDept;
  });

  return (
    <motion.div
      initial="initial"
      animate="animate"
      className="flex flex-col text-gray-900 dark:text-slate-100"
      style={{ gap: '24px' }}
    >
      {/* HEADER SECTION */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold tracking-wider text-gray-400 dark:text-slate-500 uppercase">AECCENTRIC EMS</span>
          <h1 className="text-[32px] font-bold tracking-tight text-gray-900 dark:text-white leading-none mt-1">
            Attendance Ledger
          </h1>
          <p className="text-[13px] text-gray-500 mt-2">
            {isAdmin 
              ? 'Real-time check-in monitors, working hours metrics, and historical logs.'
              : 'Clock-in, check-out daily logs, working hours, and historic attendance sheets.'
            }
          </p>
        </div>
      </motion.div>

      {/* FEEDBACK STATUSES */}
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-sm font-semibold">
          {error}
        </div>
      )}
      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-450 rounded-xl text-sm font-semibold">
          {successMsg}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : isAdmin ? (
        /* ─── ADMIN ATTENDANCE VIEW ─── */
        <>
          {/* Bento Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <KPICard title="Checked In Today" value={logs.filter(l => l.status === 'present').length} icon={Users} color="blue" />
            <KPICard title="Late Entries" value={logs.filter(l => l.status === 'late').length} icon={Clock} color="amber" />
            <KPICard title="Total Logged Hours" value={`${logs.reduce((acc, curr) => acc + (curr.workHours || 0), 0).toFixed(1)} hrs`} icon={CalendarCheck} color="emerald" />
            <KPICard title="Absent Tallies" value={0} icon={XCircle} color="purple" />
          </div>

          {/* Table Directory and Filter Bar */}
          <div className="dashboard-card">
            <div className="card-header">
              <div>
                <h2 className="card-title">Attendance logs</h2>
                <p className="card-subtitle">Real-time check-in ledger</p>
              </div>
            </div>

            {/* Admin filters & Sort */}
            <div className="p-6 border-b border-gray-150 dark:border-white/[0.04] bg-white/[0.01] flex flex-col gap-5">
              
              {/* Search Bar + Filters Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                
                {/* Search Console (4 cols on lg) */}
                <div className="lg:col-span-4 relative group">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 dark:text-[#8892B8] pointer-events-none group-focus-within:text-blue-500 transition-colors">
                    <Search size={16} />
                  </span>
                  <input
                    type="text"
                    placeholder="Search employee name or code..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full text-[13px] pl-12 pr-4 py-3 rounded-xl bg-gray-50/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] hover:border-blue-500/30 text-gray-900 dark:text-[#EDF0FA] placeholder-gray-400/50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200 shadow-sm"
                  />
                </div>

                {/* Filter by Date Calendar Picker (3 cols on lg) */}
                <div className="lg:col-span-3 relative group">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-450 dark:text-[#8892B8] pointer-events-none">
                    <CalendarCheck size={16} className="text-blue-500" />
                  </span>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                    className="w-full text-[13px] pl-11 pr-12 py-3 rounded-xl bg-gray-50/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] hover:border-blue-500/30 text-gray-800 dark:text-[#EDF0FA] focus:outline-none cursor-pointer shadow-sm font-semibold"
                  />
                  {selectedDate && (
                    <button
                      onClick={() => setSelectedDate('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-500 text-[10px] font-bold uppercase transition-colors"
                      title="Clear Date Filter"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Filter by Status Dropdown (3 cols on lg) */}
                <div className="lg:col-span-3 relative group">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 dark:text-[#8892B8] pointer-events-none">
                    <CheckCircle size={16} className="text-emerald-500" />
                  </span>
                  <select
                    value={selectedStatus}
                    onChange={e => setSelectedStatus(e.target.value)}
                    className="w-full text-[13px] pl-11 pr-10 py-3 rounded-xl bg-gray-50/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] hover:border-blue-500/30 text-gray-800 dark:text-[#EDF0FA] focus:outline-none cursor-pointer appearance-none shadow-sm font-semibold"
                  >
                    <option value="All">All Statuses</option>
                    <option value="present">Present Entries</option>
                    <option value="late">Late Entries</option>
                  </select>
                  <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-[#5A6282] pointer-events-none">
                    <ChevronDown size={15} />
                  </span>
                </div>

                {/* Sort Dropdown (2 cols on lg) */}
                <div className="lg:col-span-2 relative group">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 dark:text-[#8892B8] pointer-events-none">
                    <Clock size={16} className="text-indigo-500" />
                  </span>
                  <select
                    value={sortOrder}
                    onChange={e => setSortOrder(e.target.value)}
                    className="w-full text-[13px] pl-11 pr-10 py-3 rounded-xl bg-gray-50/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] hover:border-blue-500/30 text-gray-800 dark:text-[#EDF0FA] focus:outline-none cursor-pointer appearance-none shadow-sm font-semibold"
                  >
                    <option value="desc">Newest</option>
                    <option value="asc">Oldest</option>
                  </select>
                  <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-450 dark:text-[#5A6282] pointer-events-none">
                    <ChevronDown size={15} />
                  </span>
                </div>

              </div>

              {/* Department filter pills */}
              <div className="flex flex-col gap-2.5">
                <span className="text-[10px] font-extrabold text-gray-400 dark:text-[#5A6282] uppercase tracking-wider block pl-1 select-none">
                  Filter by Department
                </span>
                <div className="filter-pills-container hide-scrollbar border-0 p-0 bg-transparent flex flex-wrap gap-2">
                  {['All', 'Engineering', 'HR', 'Marketing', 'Operations', 'Finance'].map(dept => (
                    <button
                      key={dept}
                      onClick={() => setSelectedDept(dept)}
                      className={`filter-pill ${selectedDept === dept ? 'active' : ''}`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Logs Table */}
            <div className="card-body table-responsive-wrapper p-0">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-16 text-gray-400">No matching attendance records found.</div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Department</th>
                      <th>Check-In</th>
                      <th>Check-Out</th>
                      <th>Hours</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map(log => {
                      const emp = log.employee || {};
                      const initial = emp.fullName?.charAt(0) || 'E';
                      const avatarClass = emp.department ? `avatar-${emp.department.toLowerCase()}` : 'avatar-engineering';
                      return (
                        <tr key={log._id}>
                          <td>
                            <div className="flex items-center gap-2.5">
                              <div className={`w-8 h-8 rounded-full avatar flex items-center justify-center font-bold text-[11px] ${avatarClass}`}>
                                {initial}
                              </div>
                              <div>
                                <div className="text-[12.5px] font-bold text-gray-900 dark:text-slate-200">{emp.fullName}</div>
                                <div className="text-[10px] text-gray-450 dark:text-slate-500 mt-0.5">{emp.employeeId || 'AE-001'}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="text-[12.5px] font-medium text-gray-700 dark:text-slate-350">{emp.department || 'Operations'}</span>
                          </td>
                          <td>
                            <span className="font-mono text-[12px]">{log.checkIn ? new Date(log.checkIn).toLocaleTimeString() : '-'}</span>
                          </td>
                          <td>
                            <span className="font-mono text-[12px]">{log.checkOut ? new Date(log.checkOut).toLocaleTimeString() : '-'}</span>
                          </td>
                          <td>
                            <span className="font-mono text-[12.5px] font-bold text-blue-600">{log.workHours ? `${log.workHours} hrs` : '-'}</span>
                          </td>
                          <td>
                            <span className={`chip ${log.status === 'present' ? 'chip-success' : 'chip-warning'}`}>
                              {log.status === 'present' ? 'Present' : 'Late'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      ) : (
        /* ─── EMPLOYEE ATTENDANCE VIEW ─── */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left panel: Clock-in action console */}
          <div className="dashboard-card lg:col-span-1 p-6 space-y-6">
            <h2 className="text-lg font-bold text-gray-950 dark:text-white border-b border-[var(--border-default)] pb-3">Clock Console</h2>
            
            <div className="flex flex-col items-center text-center p-5 bg-[var(--surface-L2)] border border-[var(--border-default)] rounded-xl relative overflow-hidden">
              <Clock size={40} className="text-blue-500 mb-3 animate-pulse" />
              
              <div className="text-sm text-gray-400 font-bold uppercase tracking-wider">Today's Session</div>
              <div className="text-3xl font-black text-gray-950 dark:text-white mt-1 leading-none">
                {todayRecord ? (todayRecord.workHours ? `${todayRecord.workHours} hrs` : 'Clocked In') : '00.00'}
              </div>
              <div className="text-[11px] text-gray-450 mt-1">
                {todayRecord ? `Started at: ${new Date(todayRecord.checkIn).toLocaleTimeString()}` : 'Not clocked in yet today'}
              </div>
            </div>

            <div className="space-y-3">
              {!isCheckedIn ? (
                <button
                  onClick={handleCheckIn}
                  disabled={!!todayRecord?.checkOut}
                  className={`w-full flex items-center justify-center gap-2 h-11 rounded-lg font-bold text-sm text-white shadow-sm transition-colors cursor-pointer ${
                    todayRecord?.checkOut 
                      ? 'bg-gray-300 dark:bg-slate-700 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/10'
                  }`}
                >
                  <Play size={14} fill="currentColor" />
                  <span>Clock In Present</span>
                </button>
              ) : (
                <button
                  onClick={handleCheckOut}
                  className="w-full flex items-center justify-center gap-2 h-11 rounded-lg font-bold text-sm text-white bg-rose-600 hover:bg-rose-700 shadow-sm shadow-rose-600/10 transition-colors cursor-pointer"
                >
                  <Square size={14} fill="currentColor" />
                  <span>Clock Out Session</span>
                </button>
              )}
            </div>

            <div className="p-3 bg-blue-50/50 dark:bg-blue-500/[0.03] border border-blue-100 dark:border-blue-500/20 text-blue-600 text-[11px] leading-relaxed rounded-lg">
              <strong>Check-In Guidelines:</strong> Please log your check-in when arriving at your desk. Remember to close your session by checking out before heading home to ensure accurate timesheet exports.
            </div>
          </div>

          {/* Right panel: Personal Logs History */}
          <div className="dashboard-card lg:col-span-2">
            <div className="card-header flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="card-title">My Attendance History</h2>
                <p className="card-subtitle">Previous check-in records</p>
              </div>
              <div className="relative min-w-[170px] group">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-450 dark:text-[#8892B8] pointer-events-none">
                  <CalendarCheck size={14} className="text-blue-500" />
                </span>
                <select
                  value={sortOrder}
                  onChange={e => setSortOrder(e.target.value)}
                  className="w-full text-xs pl-9 pr-9 py-2 rounded-xl bg-gray-50/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] hover:border-blue-500/30 text-gray-800 dark:text-[#EDF0FA] focus:outline-none cursor-pointer appearance-none shadow-sm font-semibold"
                >
                  <option value="desc">Newest Date</option>
                  <option value="asc">Oldest Date</option>
                </select>
                <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 dark:text-[#5A6282] pointer-events-none">
                  <ChevronDown size={13} />
                </span>
              </div>
            </div>

            <div className="card-body table-responsive-wrapper p-0">
              {myLogs.length === 0 ? (
                <div className="text-center py-20 text-gray-450">No previous sessions found.</div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Check-In</th>
                      <th>Check-Out</th>
                      <th>Work Hours</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myLogs.map(log => (
                      <tr key={log._id}>
                        <td>
                          <span className="font-semibold">{new Date(log.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </td>
                        <td>
                          <span className="font-mono text-[12px]">{log.checkIn ? new Date(log.checkIn).toLocaleTimeString() : '-'}</span>
                        </td>
                        <td>
                          <span className="font-mono text-[12px]">{log.checkOut ? new Date(log.checkOut).toLocaleTimeString() : '-'}</span>
                        </td>
                        <td>
                          <span className="font-mono font-bold text-blue-600">{log.workHours ? `${log.workHours} hrs` : '-'}</span>
                        </td>
                        <td>
                          <span className={`chip ${log.status === 'present' ? 'chip-success' : 'chip-warning'}`}>
                            {log.status === 'present' ? 'Present' : 'Late'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

/* Helper Metric card for Attendance Admin dashboard */
function KPICard({ title, value, icon: Icon, color }) {
  const colors = {
    blue:   { bg: 'rgba(26, 86, 219, 0.08)',   text: 'text-blue-600 dark:text-blue-400' },
    emerald:{ bg: 'rgba(14, 159, 110, 0.08)', text: 'text-emerald-600 dark:text-emerald-400' },
    purple: { bg: 'rgba(124, 58, 237, 0.08)', text: 'text-purple-600 dark:text-purple-400' },
    amber:  { bg: 'rgba(245, 158, 11, 0.08)',  text: 'text-amber-600' }
  };
  const c = colors[color] || colors.blue;
  return (
    <div className="glass-card p-5 flex flex-col gap-1 relative overflow-hidden" style={{ minHeight: '100px' }}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{title}</span>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: c.bg }}>
          <Icon size={15} className={c.text} />
        </div>
      </div>
      <div className="text-2xl font-black text-gray-950 dark:text-white mt-2 leading-none">{value}</div>
    </div>
  );
}
