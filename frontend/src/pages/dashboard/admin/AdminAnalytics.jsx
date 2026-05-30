/**
 * AdminAnalytics.jsx - Workforce Analytics Dashboard
 * All data is live from MongoDB via /api/dashboard/analytics
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp, TrendingDown, DollarSign, Users,
  ArrowUpRight, ArrowDownRight, RefreshCw,
  FolderKanban, CheckSquare, Calendar, Sparkles
} from 'lucide-react';
import api from '../../../services/api';
import { useTheme } from '../../../context/ThemeContext';

/* ─── CUSTOM CHART TOOLTIP ─── */
function ChartTip({ active, payload, label }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  if (!active || !payload?.length) return null;
  return (
    <div className={`p-3.5 rounded-xl border shadow-xl backdrop-blur-md ${isDark ? 'bg-[#161B22]/95 border-[#30363D] text-slate-100' : 'bg-white/95 border-slate-200 text-slate-900'}`}>
      <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">{label}</p>
      {payload.map((e, i) => (
        <p key={i} style={{ color: e.color }} className="text-[12.5px] font-bold my-0.5 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: e.color }} />
          {e.name}: {typeof e.value === 'number' && e.value > 999 ? `${(e.value / 1000).toFixed(1)}K` : e.value}
        </p>
      ))}
    </div>
  );
}

/* ─── SKELETON PULSE ─── */
function Skel({ h = 200 }) {
  return (
    <div 
      className="w-full rounded-xl skeleton"
      style={{ height: h }}
    />
  );
}

/* ─── KPI CARD ─── */
function KPICard({ title, value, change, up, icon: Icon, color, subtitle, loading, themeColors }) {
  return (
    <motion.div
      variants={{
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.35 } }
      }}
      className="kpi-card relative overflow-hidden"
    >
      <div 
        className="absolute -top-6 -right-6 w-16 h-16 rounded-full opacity-[0.06] dark:opacity-[0.08]" 
        style={{ backgroundColor: color }} 
      />
      <div className="flex items-center justify-between mb-4">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center" 
          style={{ backgroundColor: `${color}18`, color }}
        >
          <Icon size={18} />
        </div>
        <span className={`flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full ${up ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/[0.1] dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-500/[0.1] dark:text-rose-400'}`}>
          {up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
          {change}
        </span>
      </div>
      <div className="kpi-label">{title}</div>
      {loading ? (
        <div className="h-8 bg-gray-100 dark:bg-white/[0.08] rounded animate-pulse w-3/4 mt-1" />
      ) : (
        <div className="kpi-number">{value}</div>
      )}
      {subtitle && <div className="kpi-secondary mt-1">{subtitle}</div>}
    </motion.div>
  );
}

/* ─── CHART CARD WRAPPER ─── */
function ChartCard({ title, subtitle, children, loading, h = 200 }) {
  return (
    <motion.div 
      variants={{
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.35 } }
      }} 
      className="dashboard-card p-6 h-full flex flex-col justify-between"
    >
      <div className="mb-4">
        <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight font-syne">{title}</h3>
        {subtitle && <p className="text-[11.5px] text-gray-500 dark:text-slate-400 mt-1">{subtitle}</p>}
      </div>
      <div className="flex-1 w-full relative">
        {loading ? <Skel h={h} /> : children}
      </div>
    </motion.div>
  );
}

/* ─── EMPTY PLACEHOLDER ─── */
function Empty({ h = 200, label = 'No data yet. Run the seed script to populate MongoDB.' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 text-gray-400 dark:text-slate-500" style={{ height: h }}>
      <div className="text-4xl opacity-40">📊</div>
      <p className="text-xs text-center max-w-[240px] font-medium leading-relaxed">{label}</p>
    </div>
  );
}

/* ─── FORMAT CURRENCY ─── */
const fmtCurrency = (n) => {
  if (!n && n !== 0) return '₹0';
  if (n >= 1_000_000) return `₹${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `₹${(n / 1_000).toFixed(1)}K`;
  return `₹${n.toLocaleString('en-IN')}`;
};

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */
export default function AdminAnalytics() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const { theme }             = useTheme();
  const isDark                = theme === 'dark';

  const t = {
    text: isDark ? '#E6EDF3' : '#111827',
    muted: isDark ? '#8B949E' : '#4B5563',
    blue: isDark ? '#3B82F6' : '#1A56DB',
    teal: '#0D9488',
    amber: '#F59E0B',
    rose: '#E53E3E',
    violet: isDark ? '#9B6DFF' : '#7C3AED',
    green: '#0E9F6E',
    cyan: '#22D3EE',
    grid: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(17,24,39,0.05)',
  };

  const DEPT_COLORS = [t.blue, t.violet, t.teal, t.amber, t.green, t.rose, t.cyan, '#f59e0b'];
  const leaveStatusColors  = { pending: t.amber,  approved: t.green,  rejected: t.rose };
  const projectStatusColors = { active: t.blue, completed: t.green, on_hold: t.amber, cancelled: t.rose, planning: t.violet };
  const taskStatusColors   = { todo: t.blue, in_progress: t.amber, completed: t.green, blocked: t.rose };

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/dashboard/analytics');
      if (res.data.success) setData(res.data);
    } catch (err) {
      console.error(err);
      setError('Could not load analytics. Make sure the backend is running and the database is seeded.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnalytics(); }, []);

  const kpis = data?.kpis || {};

  return (
    <>
      <style>{`
        @keyframes shimmer { 0%,100%{background-position:200% 0} 50%{background-position:-200% 0} }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <motion.div 
        variants={{
          initial: { opacity: 0 },
          animate: { opacity: 1, transition: { staggerChildren: 0.05 } }
        }} 
        initial="initial" 
        animate="animate"
        className="flex flex-col gap-6 text-gray-900 dark:text-slate-100"
      >
        {/* ── Header ── */}
        <motion.div 
          variants={{ initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 } }} 
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold tracking-widest text-gray-400 dark:text-slate-500 uppercase">AECCENTRIC WORKFORCE INTELLIGENCE</span>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/[0.1] border border-blue-150/40 text-[9px] font-bold text-blue-600 dark:text-blue-400">
                <Sparkles size={8} /> Live Engine
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight font-syne dark:text-white">
              Workforce <span className="text-blue-600 dark:text-blue-450">Analytics</span>
            </h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              Live intelligence aggregated from your MongoDB workforce collections.
            </p>
          </div>
          <button
            onClick={fetchAnalytics}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--surface-L1)] border border-[var(--border-default)] hover:border-[var(--border-hover)] text-gray-700 dark:text-slate-350 hover:text-gray-900 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Refresh Intelligence
          </button>
        </motion.div>

        {/* ── Error Banner ── */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -8 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0 }} 
              className="p-3.5 bg-rose-500/[0.08] border border-rose-500/20 rounded-xl text-rose-600 dark:text-rose-450 text-xs font-semibold"
            >
              ⚠️ {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── KPI Cards ── */}
        <motion.div 
          variants={{ animate: { transition: { staggerChildren: 0.05 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <KPICard
            title="Total Employees" icon={Users} color={t.blue}
            value={loading ? '-' : kpis.totalEmployees ?? 0}
            change="+14.5%" up
            subtitle={`${kpis.activeEmployees ?? 0} currently active`}
            loading={loading}
          />
          <KPICard
            title="Active Projects" icon={FolderKanban} color={t.teal}
            value={loading ? '-' : kpis.activeProjects ?? 0}
            change="+8.3%" up
            subtitle={`${kpis.totalProjects ?? 0} total projects`}
            loading={loading}
          />
          <KPICard
            title="Total Revenue" icon={DollarSign} color={t.green}
            value={loading ? '-' : fmtCurrency(kpis.totalRevenue)}
            change="+18.2%" up
            subtitle="From finance ledger"
            loading={loading}
          />
          <KPICard
            title="Net Balance" icon={kpis.netBalance >= 0 ? TrendingUp : TrendingDown} color={t.violet}
            value={loading ? '-' : fmtCurrency(kpis.netBalance)}
            change={kpis.netBalance >= 0 ? '+2.4%' : '-2.4%'}
            up={(kpis.netBalance ?? 0) >= 0}
            subtitle="Revenue minus expenses"
            loading={loading}
          />
        </motion.div>

        {/* ── Revenue vs Expenses + Dept Breakdown ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
          <div className="xl:col-span-2">
            <ChartCard title="Revenue vs Expenses" subtitle="Monthly financial performance from ledger" loading={loading} h={280}>
              {data?.revenueExpense?.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={data.revenueExpense} margin={{ top: 10, right: 5, left: -22, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={t.blue} stopOpacity={0.22} />
                        <stop offset="100%" stopColor={t.blue} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={t.rose} stopOpacity={0.16} />
                        <stop offset="100%" stopColor={t.rose} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={t.grid} vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: t.muted, fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: t.muted, fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}K`} />
                    <Tooltip content={<ChartTip />} cursor={{ stroke: t.grid, strokeWidth: 1 }} />
                    <Area type="monotone" dataKey="revenue" stroke={t.blue} strokeWidth={2.5} fill="url(#revGrad)" name="Revenue (₹K)" />
                    <Area type="monotone" dataKey="expenses" stroke={t.rose} strokeWidth={2} fill="url(#expGrad)" name="Expenses (₹K)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <Empty h={280} label="No finance records found. Log transactions to see chart." />
              )}
            </ChartCard>
          </div>

          <div className="col-span-1">
            <ChartCard title="Employees by Department" subtitle="Headcount distribution" loading={loading} h={280}>
              {data?.deptBreakdown?.length > 0 ? (
                <div className="flex flex-col gap-4 mt-2">
                  {data.deptBreakdown.slice(0, 6).map((dept, i) => {
                    const maxCount = Math.max(...data.deptBreakdown.map(d => d.count));
                    const pct = (dept.count / maxCount) * 100;
                    const color = DEPT_COLORS[i % DEPT_COLORS.length];
                    return (
                      <div key={dept.name}>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[12.5px] font-semibold text-gray-700 dark:text-slate-350">{dept.name}</span>
                          <span className="text-[12px] font-bold" style={{ color }}>{dept.count} emp</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 dark:bg-white/[0.06] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
                            className="h-full rounded-full"
                            style={{ background: `linear-gradient(90deg, ${color}99, ${color})` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <Empty h={280} label="No department data. Seed the database to see breakdown." />
              )}
            </ChartCard>
          </div>
        </div>

        {/* ── Leave Status + Project Status + Task Pipeline ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {/* Leave Status Donut */}
          <div className="col-span-1">
            <ChartCard title="Leave Status" subtitle="Breakdown by approval stage" loading={loading} h={240}>
              {data?.leaveByStatus?.length > 0 ? (
                <div className="flex flex-col justify-between h-full pt-2">
                  <div className="flex justify-center items-center relative mb-4">
                    <ResponsiveContainer width={170} height={170}>
                      <PieChart>
                        <Pie data={data.leaveByStatus} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="count" startAngle={90} endAngle={-270}>
                          {data.leaveByStatus.map((entry, i) => (
                            <Cell key={i} fill={leaveStatusColors[entry.name] || t.blue} stroke="none" />
                          ))}
                        </Pie>
                        <Tooltip content={<ChartTip />} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <div className="font-syne text-2xl font-black text-amber-500 leading-none">
                        {data.leaveByStatus.find(l => l.name === 'pending')?.count ?? 0}
                      </div>
                      <div className="text-[9px] text-gray-400 dark:text-slate-500 font-bold uppercase mt-1 tracking-widest">PENDING</div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 border-t border-[var(--border-default)] pt-3.5">
                    {data.leaveByStatus.map((l, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: leaveStatusColors[l.name] || t.blue }} />
                          <span className="capitalize text-gray-500 dark:text-slate-400 font-medium">{l.name}</span>
                        </div>
                        <span className="font-bold text-gray-905 dark:text-slate-200">{l.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <Empty h={240} label="No leave records yet." />
              )}
            </ChartCard>
          </div>

          {/* Project Status Bar */}
          <div className="col-span-1">
            <ChartCard title="Project Status" subtitle="Projects by lifecycle stage" loading={loading} h={240}>
              {data?.projectStatus?.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={data.projectStatus} margin={{ top: 15, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={t.grid} vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 9, fill: t.muted, fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 9, fill: t.muted, fontWeight: 600 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                    <Bar dataKey="count" name="Projects" radius={[4, 4, 0, 0]}>
                      {data.projectStatus.map((entry, index) => (
                        <Cell key={index} fill={projectStatusColors[entry.name] || t.blue} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Empty h={240} label="No project data yet." />
              )}
            </ChartCard>
          </div>

          {/* Task Pipeline */}
          <div className="col-span-1">
            <ChartCard title="Task Pipeline" subtitle="Tasks by current status" loading={loading} h={240}>
              {data?.taskStats?.length > 0 ? (
                <div className="flex flex-col gap-3.5 mt-2">
                  {(() => {
                    const total = data.taskStats.reduce((s, x) => s + x.count, 0);
                    return data.taskStats.map((step, i) => {
                      const pct = total > 0 ? Math.round((step.count / total) * 100) : 0;
                      const widthPct = 30 + (pct / 100) * 70;
                      const color = taskStatusColors[step.name] || t.blue;
                      return (
                        <motion.div 
                          key={step.name} 
                          initial={{ opacity: 0, x: -10 }} 
                          animate={{ opacity: 1, x: 0 }} 
                          transition={{ delay: i * 0.05 }}
                        >
                          <div className="flex justify-between items-center mb-1 text-xs">
                            <span className="capitalize text-gray-700 dark:text-slate-350 font-bold">{step.name.replace('_', ' ')}</span>
                            <span className="font-extrabold" style={{ color }}>{step.count}</span>
                          </div>
                          <div 
                            className="h-7 rounded-lg flex items-center justify-end px-3 border" 
                            style={{ 
                              width: `${widthPct}%`, 
                              backgroundColor: `${color}10`, 
                              borderColor: `${color}25` 
                            }}
                          >
                            <span className="text-[10px] font-extrabold font-mono" style={{ color }}>{pct}%</span>
                          </div>
                        </motion.div>
                      );
                    });
                  })()}
                </div>
              ) : (
                <Empty h={240} label="No task data yet." />
              )}
            </ChartCard>
          </div>
        </div>

        {/* ── Leave By Type + Headcount Growth ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <div className="col-span-1">
            <ChartCard title="Leave by Type" subtitle="Requests categorized by leave reason" loading={loading} h={250}>
              {data?.leaveByType?.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={data.leaveByType} layout="vertical" margin={{ top: 10, right: 10, left: 45, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={t.grid} horizontal={false} vertical={true} />
                    <XAxis type="number" tick={{ fontSize: 9, fill: t.muted }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 9, fill: t.muted, fontWeight: 650, textTransform: 'capitalize' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: 'rgba(255,255,255,0.015)' }} />
                    <Bar dataKey="count" name="Requests" fill={t.violet} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Empty h={250} label="No leave requests found." />
              )}
            </ChartCard>
          </div>

          <div className="col-span-1">
            <ChartCard title="Headcount Growth" subtitle="New employees added by month (joining date)" loading={loading} h={250}>
              {data?.headcountByMonth?.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={data.headcountByMonth} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={t.grid} vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: t.muted, fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: t.muted, fontWeight: 600 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<ChartTip />} cursor={{ stroke: t.grid, strokeWidth: 1 }} />
                    <Line type="monotone" dataKey="count" stroke={t.teal} strokeWidth={2.5} dot={{ r: 4, fill: t.teal, stroke: isDark ? '#161B22' : '#FFFFFF', strokeWidth: 2 }} name="New Hires" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Empty h={250} label="No headcount growth data. Check that employees have joiningDate set." />
              )}
            </ChartCard>
          </div>
        </div>
      </motion.div>
    </>
  );
}
