import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  CalendarRange,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  RefreshCw,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import api from '../../../services/api';

const reportTypes = [
  { id: 'payroll', label: 'Payroll Ledger', icon: FileText, desc: 'Salary breakdown, allowances, deductions, and payment status.' },
  { id: 'employees', label: 'Workforce Performance', icon: ShieldCheck, desc: 'Headcount audits, departments, corporate designations, and scores.' },
  { id: 'attendance', label: 'Attendance logs', icon: CalendarRange, desc: 'Check-in timestamps, check-out status, and active operations hours.' },
  { id: 'projects', label: 'Projects & Pipeline', icon: BarChart3, desc: 'Initiatives status, tech leads, operational progress, and deadlines.' },
  { id: 'tasks', label: 'Task command sheet', icon: FileSpreadsheet, desc: 'Action owners, high priorities, due dates, and context mapping.' },
];

const getRows = (type, data) => {
  if (type === 'payroll') {
    return (data.payrolls || []).map((row) => ({
      employee: row.employee?.fullName,
      employeeId: row.employee?.employeeId,
      department: row.employee?.department,
      month: row.month,
      basic: row.salary,
      allowances: row.allowances,
      deductions: row.deductions,
      netPayable: row.netPayable,
      status: row.status,
    }));
  }

  if (type === 'employees') {
    return (data.employees || []).map((row) => ({
      employee: row.fullName,
      employeeId: row.employeeId,
      department: row.department,
      designation: row.designation,
      status: row.status,
      salary: row.salary,
      performanceScore: row.performanceScore,
    }));
  }

  if (type === 'attendance') {
    return (data.attendance || []).map((row) => ({
      employee: row.employee?.fullName,
      employeeId: row.employee?.employeeId,
      department: row.employee?.department,
      date: row.date ? new Date(row.date).toLocaleDateString() : '',
      checkIn: row.checkIn ? new Date(row.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
      checkOut: row.checkOut ? new Date(row.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
      workHours: row.workHours,
      status: row.status,
    }));
  }

  if (type === 'projects') {
    return (data.projects || []).map((row) => ({
      project: row.name,
      client: row.client,
      status: row.status,
      priority: row.priority,
      lead: row.lead?.fullName,
      progress: row.progress,
      budget: row.budget,
      deadline: row.endDate ? new Date(row.endDate).toLocaleDateString() : '',
    }));
  }

  return (data.tasks || []).map((row) => ({
    task: row.title,
    status: row.status,
    priority: row.priority,
    assignee: row.assignedTo?.fullName,
    project: row.project?.name,
    dueDate: row.dueDate ? new Date(row.dueDate).toLocaleDateString() : '',
  }));
};

const initials = (name = 'U') => name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();

const toCsv = (rows) => {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const escape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  return [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => escape(row[header])).join(',')),
  ].join('\n');
};

const downloadCsv = (name, rows) => {
  const blob = new Blob([toCsv(rows)], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${name.toLowerCase().replaceAll(' ', '-')}-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

export default function Reports() {
  const [selected, setSelected] = useState('payroll');
  const [department, setDepartment] = useState('');
  const [month, setMonth] = useState('2026-05');
  const [data, setData] = useState({ payrolls: [], employees: [], attendance: [], projects: [], tasks: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [payrollRes, employeesRes, attendanceRes, projectsRes, tasksRes] = await Promise.all([
        api.get('/payroll'),
        api.get('/employees?limit=200'),
        api.get('/attendance'),
        api.get('/projects'),
        api.get('/tasks'),
      ]);

      setData({
        payrolls: payrollRes.data.payrolls || [],
        employees: employeesRes.data.employees || [],
        attendance: attendanceRes.data.logs || [],
        projects: projectsRes.data.projects || [],
        tasks: tasksRes.data.tasks || [],
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load report datasets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const departments = useMemo(() => {
    const names = new Set((data.employees || []).map((employee) => employee.department).filter(Boolean));
    return [...names].sort();
  }, [data.employees]);

  const rows = useMemo(() => {
    return getRows(selected, data).filter((row) => {
      const deptMatch = !department || row.department === department;
      const monthMatch = selected !== 'payroll' || !month || row.month === month;
      return deptMatch && monthMatch;
    });
  }, [selected, data, department, month]);

  const activeType = reportTypes.find((type) => type.id === selected);

  const renderCellContent = (header, value) => {
    if (value === null || value === undefined) return '-';
    const valStr = String(value);

    // Status check
    if (header === 'status') {
      const lower = valStr.toLowerCase();
      if (['completed', 'done', 'active', 'processed', 'present'].includes(lower)) {
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold border border-emerald-500/10 uppercase shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {valStr}
          </span>
        );
      }
      if (['high', 'critical', 'danger', 'rejected', 'late'].includes(lower)) {
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-500 text-[10px] font-bold border border-rose-500/10 uppercase shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            {valStr}
          </span>
        );
      }
      if (['in_progress', 'review', 'pending', 'processing', 'on_leave'].includes(lower)) {
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold border border-amber-500/10 uppercase shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            {valStr}
          </span>
        );
      }
      return (
        <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/[0.04] text-[10px] text-gray-500 dark:text-slate-400 font-bold border border-gray-250 dark:border-white/[0.05] uppercase shrink-0">
          {valStr}
        </span>
      );
    }

    // Priority check
    if (header === 'priority') {
      const lower = valStr.toLowerCase();
      if (lower === 'critical') return <span className="px-2 py-0.5 rounded bg-pink-500/10 text-pink-500 text-[9px] font-extrabold uppercase border border-pink-500/10 shrink-0">Critical</span>;
      if (lower === 'high') return <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 text-[9px] font-extrabold uppercase border border-rose-500/10 shrink-0">High</span>;
      if (lower === 'medium') return <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 text-[9px] font-extrabold uppercase border border-amber-500/10 shrink-0">Medium</span>;
      return <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/[0.05] text-[9px] text-gray-500 dark:text-slate-400 font-extrabold uppercase border border-gray-250 dark:border-white/[0.04] shrink-0">Low</span>;
    }

    // Currency columns check
    if (['basic', 'allowances', 'deductions', 'netPayable', 'salary', 'budget'].includes(header)) {
      const num = Number(value);
      if (!isNaN(num)) {
        return <span className="font-mono font-bold text-[12px] text-gray-900 dark:text-white shrink-0">₹{num.toLocaleString('en-IN')}</span>;
      }
    }

    // Progress check
    if (header === 'progress') {
      const progressVal = Number(value) || 0;
      return (
        <div className="flex items-center gap-2 min-w-[100px] shrink-0">
          <div className="progress-bar flex-1 h-1.5 bg-gray-100 dark:bg-white/[0.04]">
            <div className="progress-bar-fill active bg-blue-600 h-full rounded" style={{ width: `${progressVal}%` }} />
          </div>
          <span className="font-mono text-[10px] font-extrabold text-gray-900 dark:text-white shrink-0">{progressVal}%</span>
        </div>
      );
    }

    // Employee names check
    if (['employee', 'assignee', 'lead'].includes(header)) {
      return (
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[9px] font-black uppercase border border-blue-500/10">
            {initials(valStr)}
          </div>
          <span className="font-bold text-gray-900 dark:text-white">{valStr}</span>
        </div>
      );
    }

    return <span className="font-semibold text-gray-600 dark:text-slate-350">{valStr}</span>;
  };

  return (
    <div className="flex flex-col gap-8 text-gray-900 dark:text-[#EDF0FA]">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-blue-500 font-extrabold uppercase tracking-wider pl-1 select-none">
            <Sparkles size={13} className="animate-pulse" /> Reporting Center
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight font-syne dark:text-white flex items-center gap-2 mt-1">
            Enterprise <span className="text-blue-600 dark:text-blue-400">Reports</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-[#8892B8] mt-1.5">
            Compile payroll, attendance, workforce, task, and project exports from live MongoDB-backed API datasets.
          </p>
        </div>
        
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-gray-700 dark:text-[#EDF0FA] rounded-xl text-xs font-bold transition-all border border-gray-250 dark:border-white/[0.06] cursor-pointer shadow-sm"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Sync datasets
          </button>
          <button
            disabled={!rows.length || loading}
            onClick={() => downloadCsv(activeType.label, rows)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/10 cursor-pointer"
          >
            <Download size={13} />
            Export CSV
          </button>
        </div>
      </div>

      {/* QUICK STATS PILLS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {reportTypes.slice(0, 3).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSelected(id)}
            className={`kpi-card text-left transition relative cursor-pointer ${
              selected === id 
                ? 'ring-2 ring-blue-500/40 border-blue-500/20 shadow-md shadow-blue-500/[0.02]' 
                : 'border border-gray-250 dark:border-white/[0.04]'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="kpi-label">{label}</span>
                <div className="kpi-number mt-4 text-2xl font-black">
                  {loading ? '...' : getRows(id, data).length}
                </div>
              </div>
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                <Icon size={14} />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* FILTERS & TEMPLATE SPLIT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Templates Card */}
        <div className="glass-card p-6 border border-gray-200 dark:border-white/[0.05] shadow-sm rounded-3xl bg-white/60 dark:bg-white/[0.005] backdrop-blur-md">
          <div className="pb-4 border-b border-gray-100 dark:border-white/[0.04] mb-4">
            <h2 className="text-sm font-black text-gray-900 dark:text-white">Report Template Library</h2>
            <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-1 font-bold">Select a structured template outline to refine.</p>
          </div>
          
          <div className="space-y-2.5">
            {reportTypes.map(({ id, label, desc, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setSelected(id)}
                className={`w-full rounded-2xl border p-4 text-left transition flex items-start gap-3 cursor-pointer ${
                  selected === id 
                    ? 'border-blue-500/25 bg-blue-500/[0.04] dark:border-blue-500/25 dark:bg-blue-500/[0.02] shadow-sm shadow-blue-500/[0.01]' 
                    : 'border-gray-200 bg-white/50 hover:border-gray-300 dark:border-white/[0.04] dark:bg-white/[0.005] dark:hover:border-white/[0.08]'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-gray-100 text-gray-600 dark:bg-white/[0.05] dark:text-slate-350 flex items-center justify-center shrink-0">
                  <Icon size={14} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-gray-950 dark:text-white">{label}</h3>
                  <p className="mt-1 text-[10.5px] leading-relaxed text-gray-500 dark:text-slate-500 font-semibold">{desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Refinement Console Card */}
        <div className="glass-card p-6 border border-gray-200 dark:border-white/[0.05] shadow-sm rounded-3xl bg-white/60 dark:bg-white/[0.005] backdrop-blur-md">
          <div className="pb-4 border-b border-gray-100 dark:border-white/[0.04] mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-gray-900 dark:text-white">Refinement Filters</h2>
              <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-1 font-bold">Narrow the live datasets prior to export.</p>
            </div>
            <Filter size={14} className="text-gray-400" />
          </div>

          <div className="grid gap-4.5">
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-gray-400 dark:text-slate-500 pl-1">Report type</span>
              <div className="relative group">
                <select 
                  className="w-full text-xs py-3.5 pl-4 pr-10 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-250 dark:border-white/[0.06] text-gray-800 dark:text-[#EDF0FA] focus:outline-none focus:border-blue-500 transition-all font-semibold shadow-sm cursor-pointer appearance-none" 
                  value={selected} 
                  onChange={(e) => setSelected(e.target.value)}
                >
                  {reportTypes.map((type) => <option key={type.id} value={type.id}>{type.label}</option>)}
                </select>
                <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-slate-500 pointer-events-none">
                  <ChevronDown size={14} />
                </span>
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-gray-400 dark:text-slate-500 pl-1">Department Filter</span>
              <div className="relative group">
                <select 
                  className="w-full text-xs py-3.5 pl-4 pr-10 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-250 dark:border-white/[0.06] text-gray-800 dark:text-[#EDF0FA] focus:outline-none focus:border-blue-500 transition-all font-semibold shadow-sm cursor-pointer appearance-none" 
                  value={department} 
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  <option value="">All departments</option>
                  {departments.map((name) => <option key={name} value={name}>{name}</option>)}
                </select>
                <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-slate-500 pointer-events-none">
                  <ChevronDown size={14} />
                </span>
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-gray-400 dark:text-slate-500 pl-1">Payroll Release Month</span>
              <input 
                className="w-full text-xs py-3.5 px-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-250 dark:border-white/[0.06] text-gray-800 dark:text-[#EDF0FA] focus:outline-none focus:border-blue-500 transition-all font-semibold shadow-sm cursor-pointer" 
                type="month" 
                value={month} 
                onChange={(e) => setMonth(e.target.value)} 
              />
            </label>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl flex items-center gap-3 text-sm">
          <AlertCircle className="shrink-0 w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* DYNAMIC DATA PREVIEW */}
      <div className="glass-card overflow-hidden border border-gray-200 dark:border-white/[0.05] shadow-sm rounded-3xl bg-white/60 dark:bg-white/[0.005] backdrop-blur-md">
        <div className="p-6 border-b border-gray-100 dark:border-white/[0.04] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black text-gray-900 dark:text-white">{activeType.label} Preview</h2>
            <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-1 font-bold">{rows.length} rows aligned and ready for extraction</p>
          </div>
        </div>

        {loading ? (
          <div className="p-6 space-y-3.5">
            <div className="w-full h-9 bg-gray-100 dark:bg-white/[0.04] rounded animate-pulse" />
            <div className="w-full h-9 bg-gray-100 dark:bg-white/[0.04] rounded animate-pulse" />
            <div className="w-full h-9 bg-gray-100 dark:bg-white/[0.04] rounded animate-pulse" />
          </div>
        ) : rows.length === 0 ? (
          <div className="p-16 text-center text-xs font-bold text-gray-400 border border-dashed border-gray-200 dark:border-white/[0.06] rounded-2xl m-6 bg-white/40 dark:bg-white/[0.005]">
            No live ledger rows match the active console filters.
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="data-table min-w-[820px]">
              <thead>
                <tr>
                  {Object.keys(rows[0]).map((header) => (
                    <th key={header} className="p-4 font-black uppercase text-[10px] text-gray-400 dark:text-[#5A6282] tracking-wider select-none">
                      {header.replace(/([A-Z])/g, ' $1')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/50 dark:divide-white/[0.02]">
                {rows.slice(0, 12).map((row, index) => (
                  <motion.tr 
                    key={index} 
                    initial={{ opacity: 0, y: 4 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: index * 0.025 }}
                    className="hover:bg-slate-50/50 dark:hover:bg-white/[0.015] transition-colors"
                  >
                    {Object.keys(rows[0]).map((header) => (
                      <td key={header} className="p-4 align-middle text-xs truncate">
                        {renderCellContent(header, row[header])}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
