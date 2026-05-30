import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Award,
  BarChart3,
  CheckSquare,
  ChevronRight,
  Clock,
  Download,
  FileUp,
  Flame,
  FolderOpen,
  MessageSquare,
  Plane,
  Play,
  Send,
  Sparkles,
  SquarePen,
  Target,
  TimerReset,
  Zap,
} from "lucide-react";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import api from "../../../services/api";
import {
  badgeBounce,
  cardVariants,
  clockPulse,
  containerVariants,
  hoverLift,
  pageVariants,
  progressFill,
  staggerItem,
  streakPulse,
  tapFeedback,
  useCountUp,
} from "../../../lib/motion";
import { mergeDashboardData } from "./employeeWorkspaceData";

const completedStatuses = ["done", "completed"];
const priorityColor = {
  critical: "#dc2626",
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#10b981",
};
const statusLabels = {
  todo: "Todo",
  in_progress: "In Progress",
  review: "Review",
  done: "Done",
  completed: "Done",
  blocked: "Blocked",
};
const insightIcons = { AlertTriangle: AlertCircle, Target, Zap, Clock };

const formatMinutes = (minutes = 0) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m}m`;
  return `${h}h ${m}m`;
};

const initials = (name = "Employee") =>
  name.split(" ").map(part => part[0]).join("").slice(0, 2).toUpperCase();

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });

const dueLabel = (date) => {
  if (!date) return "No due date";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(date);
  due.setHours(0, 0, 0, 0);
  const diff = Math.round((due - today) / 86400000);
  if (diff < 0) return "Overdue";
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return `In ${diff} days`;
};

const Card = ({ children, className = "", hover = true, ...props }) => (
  <motion.section
    variants={cardVariants}
    {...(hover ? hoverLift : {})}
    className={`dashboard-card h-full ${className}`}
    {...props}
  >
    {children}
  </motion.section>
);

const Header = ({ title, subtitle, action, onAction }) => (
  <div className="mb-4 flex items-start justify-between gap-3">
    <div className="min-w-0">
      <h2 className="truncate text-[16px] font-bold text-slate-950 dark:text-[#f8fafc]">{title}</h2>
      {subtitle && <p className="mt-0.5 text-xs text-slate-500 dark:text-[#94a3b8]">{subtitle}</p>}
    </div>
    {action && (
      <motion.button
        {...tapFeedback}
        onClick={onAction}
        className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400"
      >
        {action} <ChevronRight size={13} />
      </motion.button>
    )}
  </div>
);

const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse rounded-xl bg-slate-200/70 dark:bg-white/[0.05] ${className}`} />
);

const DashboardSkeleton = () => (
  <div className="space-y-5">
    <Skeleton className="h-28" />
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {[0, 1, 2, 3].map(i => <Skeleton key={i} className="h-[140px]" />)}
    </div>
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
      <Skeleton className="h-80 xl:col-span-3" />
      <Skeleton className="h-80 xl:col-span-2" />
    </div>
  </div>
);

const ProgressBar = ({ pct, color = "#2563eb", className = "" }) => (
  <div className={`h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/[0.06] ${className}`}>
    <motion.div className="h-full rounded-full" style={{ backgroundColor: color }} {...progressFill(Math.min(100, Math.max(0, pct || 0)))} />
  </div>
);

const CountNumber = ({ value, suffix = "" }) => {
  const counted = useCountUp(value || 0, 1200);
  return <>{counted}{suffix}</>;
};

const AvatarStack = ({ people = [], max = 4 }) => {
  const visible = people.slice(0, max);
  return (
    <div className="flex -space-x-2">
      {visible.map(person => (
        <div
          key={person._id || person.fullName}
          className="grid h-7 w-7 place-items-center rounded-full bg-blue-600 text-[10px] font-black text-white ring-2 ring-white dark:ring-[#111827]"
          title={person.fullName}
        >
          {initials(person.fullName)}
        </div>
      ))}
      {people.length > max && (
        <div className="grid h-7 w-7 place-items-center rounded-full bg-slate-200 text-[10px] font-black text-slate-600 ring-2 ring-white dark:bg-white/[0.08] dark:text-slate-300 dark:ring-[#111827]">
          +{people.length - max}
        </div>
      )}
    </div>
  );
};

const getKpiColorStyles = (color) => {
  if (color === "#2563eb") {
    return { bg: "rgba(26, 86, 219, 0.08)", text: "text-blue-600 dark:text-blue-400" };
  }
  if (color === "#8b5cf6") {
    return { bg: "rgba(124, 58, 237, 0.08)", text: "text-purple-600 dark:text-purple-400" };
  }
  if (color === "#f59e0b") {
    return { bg: "rgba(245, 158, 11, 0.08)", text: "text-amber-600 dark:text-amber-500" };
  }
  return { bg: `${color}14`, text: "" };
};

const KpiCard = ({ icon: Icon, title, value, suffix, sub, pct, color, children }) => {
  const styles = getKpiColorStyles(color);
  const bgStyle = styles.bg.startsWith("rgba") ? { backgroundColor: styles.bg } : {};

  return (
    <motion.div variants={cardVariants} className="kpi-card flex flex-col justify-between h-full min-h-[140px]">
      <div className="flex items-start justify-between">
        <span className="kpi-label">{title}</span>
        <div className={`kpi-icon ${styles.text}`} style={bgStyle}>
          <Icon size={15} />
        </div>
      </div>

      <div className="kpi-number mt-2">
        <CountNumber value={value} suffix={suffix} />
      </div>

      {children && <div className="mt-2 shrink-0">{children}</div>}

      <div className="mt-auto pt-2">
        <p className="mb-1.5 text-[11px] font-semibold text-slate-500 dark:text-[#94a3b8]">{sub}</p>
        <ProgressBar pct={pct} color={color} />
      </div>
    </motion.div>
  );
};

const ClockCard = ({ attendance, onToggle }) => {
  const isIn = Boolean(attendance?.clockedIn);
  return (
    <motion.div variants={cardVariants} className="kpi-card flex flex-col items-center justify-center gap-3 text-center h-full min-h-[140px]">
      <motion.button
        {...tapFeedback}
        {...(isIn ? clockPulse : {})}
        onClick={onToggle}
        className={`grid h-16 w-16 place-items-center rounded-full text-white shadow-lg ${isIn ? "bg-rose-500 shadow-rose-500/25" : "bg-emerald-500 shadow-emerald-500/25"}`}
      >
        {isIn ? <TimerReset size={24} /> : <Play size={24} fill="currentColor" className="ml-1" />}
        <span className="sr-only">{isIn ? "Clock Out" : "Clock In"}</span>
      </motion.button>
      <div>
        <p className="text-sm font-black text-slate-950 dark:text-white">{isIn ? "Clock Out" : "Clock In"}</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-[#94a3b8] leading-tight">
          {isIn && attendance.loginTime
            ? `Since ${new Date(attendance.loginTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}`
            : "Ready for today's session"}
        </p>
      </div>
    </motion.div>
  );
};

const FocusRing = ({ value }) => {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="relative grid h-32 w-32 shrink-0 place-items-center">
      <svg className="h-32 w-32 -rotate-90" viewBox="0 0 132 132">
        <circle cx="66" cy="66" r={radius} stroke="currentColor" strokeWidth="10" fill="none" className="text-slate-100 dark:text-white/[0.06]" />
        <motion.circle
          cx="66"
          cy="66"
          r={radius}
          stroke="#2563eb"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - (circumference * value) / 100 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-black text-slate-950 dark:text-white"><CountNumber value={value} suffix="%" /></div>
        <div className="text-[10px] font-bold uppercase text-slate-400">Done</div>
      </div>
    </div>
  );
};

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingTask, setUpdatingTask] = useState("");
  const [chartRange, setChartRange] = useState("This Week");

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/dashboard/employee-overview");
      if (res.data.success) setData(mergeDashboardData(res.data));
    } catch (err) {
      setData(mergeDashboardData());
      setError(err?.response?.data?.message || "Failed to load employee dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    queueMicrotask(fetchDashboardData);
  }, []);

  const profile = data?.profile || {};
  const tasks = data?.tasks || [];
  const todayTasks = data?.todayTasks?.length ? data.todayTasks : (data?.openTasks || tasks).slice(0, 5);
  const projects = data?.projects || [];
  const attendance = data?.attendance || { clockedIn: false, streak: 0 };
  const performance = data?.performance || {};
  const leaveBalance = data?.leaveBalance || { remaining: 0, sick: 0, casual: 0, earned: 0, used: 0, total: 1 };
  const completed = tasks.filter(task => completedStatuses.includes(task.status)).length;
  const completionRate = performance.taskCompletionRate ?? (tasks.length ? Math.round((completed / tasks.length) * 100) : 0);
  const openTasks = tasks.filter(task => !completedStatuses.includes(task.status));
  const pendingLeaves = (data?.leaves || []).filter(leave => leave.status === "pending");

  const firstName = (profile.fullName || "Prasanna").split(" ")[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const insightText = useMemo(() => {
    const overdue = openTasks.filter(task => task.dueDate && dueLabel(task.dueDate) === "Overdue").length;
    if (overdue) return `${overdue} tasks are overdue - review now`;
    if (attendance.streak >= 5) return `${attendance.streak}-day attendance streak - keep it up`;
    return `You completed ${completionRate}% of sprint goals this week`;
  }, [attendance.streak, completionRate, openTasks]);

  const handleClockToggle = async () => {
    try {
      if (attendance.clockedIn) {
        await api.put("/attendance/clock-out");
      } else {
        await api.post("/attendance/clock-in");
      }
      window.dispatchEvent(new Event("ems:attendance-updated"));
      fetchDashboardData();
    } catch (err) {
      setError(err?.response?.data?.message || "Could not update attendance.");
    }
  };

  const handleTaskStatus = async (taskId, status) => {
    setUpdatingTask(taskId);
    try {
      if (String(taskId).startsWith("demo-")) {
        setData(prev => ({
          ...prev,
          tasks: (prev.tasks || []).map(task => task._id === taskId ? { ...task, status } : task),
          todayTasks: (prev.todayTasks || []).map(task => task._id === taskId ? { ...task, status } : task),
        }));
        return;
      }
      const res = await api.put(`/tasks/${taskId}`, { status });
      const updated = res.data.task;
      setData(prev => ({
        ...prev,
        tasks: (prev.tasks || []).map(task => task._id === taskId ? updated : task),
        todayTasks: (prev.todayTasks || []).map(task => task._id === taskId ? updated : task),
      }));
    } catch (err) {
      setError(err?.response?.data?.message || "Could not update task status.");
    } finally {
      setUpdatingTask("");
    }
  };

  const handleChartRange = async (range) => {
    setChartRange(range);
    try {
      const res = await api.get("/analytics/my-weekly", {
        params: { range: range.toLowerCase().replaceAll(" ", "-") },
      });
      if (res.data.success) {
        setData(prev => ({
          ...prev,
          weeklyActivity: res.data.data,
          performance: {
            ...(prev?.performance || {}),
            workedThisWeek: res.data.summary?.workedHours ?? prev?.performance?.workedThisWeek,
            tasksCompletedThisWeek: res.data.summary?.completedTasks ?? prev?.performance?.tasksCompletedThisWeek,
          },
        }));
      }
    } catch {
      // The overview payload already includes chart data; keep it if the tab endpoint is unavailable.
    }
  };

  const handleQuickAction = (key) => {
    if (key === "clock") return handleClockToggle();
    if (key === "leave") return navigate("/dashboard/employee/leaves");
    if (key === "upload") return fileInputRef.current?.click();
    if (key === "task") return navigate("/dashboard/employee/tasks");
    if (key === "message") return navigate("/dashboard/employee/messages");
    if (key === "payslip") return navigate("/dashboard/employee/salary");
    return null;
  };

  const quickActions = [
    { key: "clock", icon: TimerReset, label: attendance.clockedIn ? "Clock Out" : "Clock In" },
    { key: "leave", icon: Plane, label: "Request Leave" },
    { key: "upload", icon: FileUp, label: "Upload File" },
    { key: "task", icon: SquarePen, label: "Update Task" },
    { key: "message", icon: Send, label: "Message Team" },
    { key: "payslip", icon: Download, label: "View Payslip" },
  ];

  if (loading) return <DashboardSkeleton />;

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageVariants.transition}
      className="dash-page flex flex-col gap-6 md:gap-8 text-slate-950 dark:text-[#f8fafc]"
    >
      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm font-semibold text-rose-600 dark:text-rose-300">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-6 md:gap-8">
        
        {/* ── SECTION 1: PAGE HEADER ── */}
        <motion.div variants={cardVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold tracking-wider text-gray-400 dark:text-slate-500 uppercase">AECCENTRIC EMS</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/[0.1] border border-blue-100 dark:border-blue-500/20 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                <Sparkles size={9} />
                Employee Workspace
              </span>
            </div>
            <h1 className="text-[32px] font-bold tracking-tight text-gray-950 dark:text-white leading-none">
              {greeting}, {firstName}
            </h1>
            <p className="text-[13px] text-gray-500 dark:text-slate-405 mt-2 font-normal">
              Welcome back to your workstation. {insightText}.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <span className="text-xs text-slate-450 dark:text-slate-500 font-semibold">{formatDate(new Date())}</span>
            {attendance.clockedIn && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/25 text-[11px] font-black text-emerald-600 dark:text-emerald-400 animate-pulse">
                ● Active Work Session
              </span>
            )}
          </div>
        </motion.div>

        {/* ── ZONE 1: KPI STRIP ── */}
        <div>
          <div className="zone-label mb-3">Zone 1: Key Workspace Metrics</div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            <ClockCard attendance={attendance} onToggle={handleClockToggle} />
            <KpiCard icon={CheckSquare} title="Tasks Today" value={todayTasks.length} sub={`${completed} completed · ${openTasks.length} remaining`} pct={tasks.length ? (completed / tasks.length) * 100 : 0} color="#2563eb" />
            <KpiCard icon={BarChart3} title="Completion Rate" value={completionRate} suffix="%" sub="This month vs last month" pct={completionRate} color="#8b5cf6" />
            <KpiCard icon={FolderOpen} title="Active Projects" value={projects.length} sub={`${openTasks.length} tasks across ${projects.length} projects`} pct={projects.length ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length) : 0} color="#f59e0b">
              <AvatarStack people={projects.flatMap(p => p.members || []).slice(0, 4)} />
            </KpiCard>
          </div>
        </div>

        {/* ── ZONE 2: DAILY FOCUS & SYNCS ── */}
        <div>
          <div className="zone-label mb-3">Zone 2: Daily Focus & Syncs</div>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
            <Card className="xl:col-span-3">
              <Header title="Today's Focus" subtitle="Sprint 4 · active deliverables" action="View All" onAction={() => navigate("/dashboard/employee/tasks")} />
              <div className="grid gap-5 lg:grid-cols-[140px_1fr]">
                <FocusRing value={completionRate} />
                <div className="space-y-3">
                  {todayTasks.slice(0, 5).map((task, index) => (
                    <motion.div
                      key={task._id}
                      {...staggerItem(index)}
                      className={`grid gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-white/[0.05] dark:bg-white/[0.03] md:grid-cols-[1fr_auto] ${completedStatuses.includes(task.status) ? "opacity-55" : ""}`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: priorityColor[task.priority] || "#64748b" }} />
                          <p className={`truncate text-sm font-bold text-slate-900 dark:text-white ${completedStatuses.includes(task.status) ? "line-through" : ""}`}>{task.title}</p>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-500 dark:text-[#94a3b8]">
                          <span className="rounded-full bg-blue-50 px-2 py-1 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">{task.project?.name || "General"}</span>
                          <span className={dueLabel(task.dueDate) === "Overdue" ? "text-rose-500" : ""}>{dueLabel(task.dueDate)}</span>
                        </div>
                      </div>
                      <select
                        value={task.status}
                        disabled={updatingTask === task._id}
                        onChange={(e) => handleTaskStatus(task._id, e.target.value)}
                        className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 dark:border-white/[0.08] dark:bg-[#0d1526] dark:text-slate-200"
                      >
                        <option value="todo">Todo</option>
                        <option value="in_progress">In Progress</option>
                        <option value="review">Review</option>
                        <option value="done">Done</option>
                      </select>
                    </motion.div>
                  ))}
                  {todayTasks.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm font-semibold text-slate-500 dark:border-white/[0.08] dark:text-slate-400">
                      No tasks due today.
                    </div>
                  )}
                </div>
              </div>
            </Card>

            <Card className="xl:col-span-2">
              <Header title="Today's Schedule" subtitle={new Date().toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short" })} />
              <div className="space-y-3">
                {(data?.meetings || []).slice(0, 4).map((meeting, index) => (
                  <motion.div
                    key={meeting._id}
                    {...staggerItem(index)}
                    whileHover={{ x: 4 }}
                    className="grid grid-cols-[56px_1fr] gap-3 rounded-xl border-l-4 border-blue-500 bg-slate-50 p-3 dark:bg-white/[0.03]"
                  >
                    <div className="text-xs font-black text-slate-500 dark:text-slate-405">
                      {new Date(meeting.startTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false })}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-950 dark:text-white">{meeting.title}</p>
                      <p className="text-xs text-slate-500 dark:text-[#94a3b8]">{meeting.duration || "30 mins"} · {(meeting.participants || []).length + 1} participants</p>
                    </div>
                  </motion.div>
                ))}
                {(data?.meetings || []).length === 0 && (
                  <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm font-semibold text-slate-500 dark:border-white/[0.08] dark:text-slate-400">
                    You have a clear schedule today.
                  </div>
                )}
                <div className="mt-3 rounded-xl bg-emerald-50 p-3 text-xs font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                  {pendingLeaves.length} leave days pending approval
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* ── ZONE 3: ACTIVE INITIATIVES & TEAM ── */}
        <div>
          <div className="zone-label mb-3">Zone 3: Active Initiatives & Team</div>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            <Card className="xl:col-span-8">
              <Header title="My Projects" subtitle="Initiatives you are currently participating in" action="View All" onAction={() => navigate("/dashboard/employee/projects")} />
              <div className="grid gap-4 md:grid-cols-2">
                {projects.slice(0, 4).map(project => {
                  const daysLeft = project.endDate ? Math.ceil((new Date(project.endDate) - new Date()) / 86400000) : null;
                  return (
                    <motion.div
                      key={project._id}
                      whileHover={{ y: -5, borderColor: "#2563eb" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate("/dashboard/employee/projects")}
                      className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-white/[0.06] dark:bg-white/[0.03]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-black text-slate-950 dark:text-white">{project.name}</p>
                          <p className="mt-1 truncate text-xs text-slate-500 dark:text-[#94a3b8]">{project.client || "Internal"}</p>
                        </div>
                        <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-black uppercase text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">{project.status}</span>
                      </div>
                      <div className="my-4 flex items-center justify-between">
                        <AvatarStack people={project.members || []} />
                        {daysLeft !== null && (
                          <span className={`text-[11px] font-black ${daysLeft < 7 ? "text-rose-500" : daysLeft < 14 ? "text-amber-500" : "text-emerald-500"}`}>
                            {daysLeft} days left
                          </span>
                        )}
                      </div>
                      <ProgressBar pct={project.progress || 0} color={project.color || "#2563eb"} />
                      <div className="mt-3 flex justify-between text-[11px] font-bold text-slate-500 dark:text-[#94a3b8]">
                        <span>{project.openTasks || 0} tasks open</span>
                        <span>{project.progress || 0}%</span>
                      </div>
                    </motion.div>
                  );
                })}
                {projects.length < 3 && (
                  <div className="flex flex-col justify-center rounded-xl border border-dashed border-slate-200 p-6 text-center dark:border-white/[0.08]">
                    <FolderOpen className="mx-auto mb-2 text-slate-300 dark:text-slate-600" size={26} />
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300">No more active projects</p>
                    <button onClick={() => navigate("/dashboard/employee/projects")} className="mt-2 text-xs font-black text-blue-600 dark:text-blue-400">View All Projects</button>
                  </div>
                )}
              </div>
            </Card>

            <Card className="xl:col-span-4">
              <Header title="Team" subtitle={`${(data?.team || []).filter(m => m.status === "Online").length} online now`} />
              <div className="space-y-2">
                {(data?.team || []).slice(0, 5).map((member, index) => (
                  <motion.div key={member._id} {...staggerItem(index)} whileHover={{ x: 4 }} className="flex items-center gap-3 rounded-xl p-2 hover:bg-blue-50/60 dark:hover:bg-blue-500/[0.05]">
                    <div className={`grid h-9 w-9 place-items-center rounded-full bg-blue-600 text-[11px] font-black text-white ring-2 ${member.status === "Online" ? "ring-emerald-400" : "ring-slate-300 dark:ring-slate-600"}`}>
                      {initials(member.fullName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-slate-950 dark:text-white">{member.fullName}</p>
                      <p className="truncate text-[11px] text-slate-500 dark:text-[#94a3b8]">{member.designation || "Employee"}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-600 dark:bg-white/[0.06] dark:text-slate-300">{member.status}</span>
                  </motion.div>
                ))}
              </div>
              <motion.button {...tapFeedback} onClick={() => navigate("/dashboard/employee/messages")} className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-xs font-black text-white">
                <MessageSquare size={14} /> New Message
              </motion.button>
            </Card>
          </div>
        </div>

        {/* ── ZONE 4: PERFORMANCE ANALYTICS & AI COPILOT ── */}
        <div>
          <div className="zone-label mb-3">Zone 4: Performance Analytics & AI Copilot</div>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <div className="mb-4 flex items-center justify-between gap-3">
                <Header title="Work Analytics" subtitle="Tasks completed and work hours" />
                <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-white/[0.05]">
                  {["This Week", "This Month", "Last Month"].map(tab => (
                    <button key={tab} onClick={() => handleChartRange(tab)} className={`rounded-lg px-3 py-1.5 text-[11px] font-black ${chartRange === tab ? "bg-white text-blue-600 shadow-sm dark:bg-[#111827] dark:text-blue-300" : "text-slate-500 dark:text-slate-400"}`}>
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={data?.weeklyActivity || []} margin={{ top: 10, right: 4, bottom: 0, left: -18 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.18)" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                    <Tooltip contentStyle={{ background: "#0f172a", border: "0", borderRadius: 12, color: "#fff", fontSize: 12 }} />
                    <Area type="monotone" dataKey="hours" fill="#10b98122" stroke="none" />
                    <Bar dataKey="tasks" fill="#2563eb" radius={[5, 5, 0, 0]} barSize={16} />
                    <Line type="monotone" dataKey="hours" stroke="#10b981" strokeWidth={3} dot={{ r: 3, fill: "#10b981" }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                <div className="rounded-full bg-blue-50 px-3 py-2 text-center text-xs font-black text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">{(performance.workedThisWeek || 0).toFixed(1)}h worked</div>
                <div className="rounded-full bg-emerald-50 px-3 py-2 text-center text-xs font-black text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">{performance.tasksCompletedThisWeek || 0} tasks done</div>
                <div className="rounded-full bg-violet-50 px-3 py-2 text-center text-xs font-black text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">{performance.attendanceRate || 0}% attendance</div>
              </div>
            </Card>

            <Card className="border-indigo-200 bg-[linear-gradient(135deg,#eff6ff,#faf5ff)] dark:border-indigo-300/10 dark:bg-[linear-gradient(135deg,#0d1526,#130d26)]">
              <p className="mb-1 text-[11px] font-black uppercase tracking-[0.12em] text-blue-600 dark:text-blue-300">AI Insights</p>
              <Header title="Aeccentric Copilot" />
              <div className="space-y-3">
                {(data?.insights || []).slice(0, 3).map((insight, index) => {
                  const Icon = insightIcons[insight.icon] || Sparkles;
                  return (
                    <motion.div key={insight.title} {...staggerItem(index)} className="rounded-xl border border-white/70 bg-white/70 p-3 dark:border-white/[0.08] dark:bg-white/[0.04]">
                      <div className="flex gap-3">
                        <Icon className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-300" size={16} />
                        <div>
                          <p className="text-sm font-black text-slate-950 dark:text-white">{insight.title}</p>
                          <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-[#94a3b8]">{insight.text}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              <button onClick={() => navigate("/dashboard/employee/performance")} className="mt-4 text-xs font-black text-blue-600 dark:text-blue-300">View Full Report</button>
            </Card>
          </div>
        </div>

        {/* ── ZONE 5: ACTIVE DELIVERABLES CHECKLIST ── */}
        <div>
          <div className="zone-label mb-3">Zone 5: Recent Deliverables Checklist</div>
          <Card hover={false}>
            <Header title="Recent Tasks" subtitle="Your active deliverables checklist" action="View All" onAction={() => navigate("/dashboard/employee/tasks")} />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] uppercase tracking-[0.08em] text-slate-400 dark:border-white/[0.06]">
                    <th className="py-3 px-4">Task Name</th>
                    <th className="px-4">Project</th>
                    <th className="px-4">Priority</th>
                    <th className="px-4">Due Date</th>
                    <th className="px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.slice(0, 8).map((task, index) => (
                    <motion.tr key={task._id} {...staggerItem(index)} whileHover={{ x: 3 }} className="border-b border-slate-100 last:border-0 dark:border-white/[0.05] hover:bg-slate-50/50 dark:hover:bg-white/[0.02]">
                      <td className="py-3 px-4 font-bold text-slate-950 dark:text-white">{task.title}</td>
                      <td className="px-4 text-slate-500 dark:text-[#94a3b8]">{task.project?.name || "General"}</td>
                      <td className="px-4"><span className="inline-flex items-center gap-2 text-xs font-bold capitalize"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: priorityColor[task.priority] || "#64748b" }} />{task.priority}</span></td>
                      <td className={`px-4 ${dueLabel(task.dueDate) === "Overdue" ? "font-bold text-rose-500" : "text-slate-500 dark:text-[#94a3b8]"}`}>{dueLabel(task.dueDate)}</td>
                      <td className="px-4"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-600 dark:bg-white/[0.06] dark:text-slate-300">{statusLabels[task.status] || task.status}</span></td>
                      <td className="py-3 px-4 text-right"><button onClick={() => navigate("/dashboard/employee/tasks")} className="text-blue-600 dark:text-blue-300"><ChevronRight size={16} /></button></td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {tasks.length === 0 && <div className="py-10 text-center text-sm font-semibold text-slate-500">No recent tasks - request tasks from your manager.</div>}
            </div>
          </Card>
        </div>

        {/* ── ZONE 6: WORKSPACE QUICK ACTIONS ── */}
        <div>
          <div className="zone-label mb-3">Zone 6: Workspace Quick Actions</div>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-6">
            {quickActions.map((action) => (
              <motion.button
                key={action.label}
                {...hoverLift}
                {...tapFeedback}
                onClick={() => handleQuickAction(action.key)}
                className="flex min-h-[72px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-4 text-xs font-black text-slate-700 shadow-sm dark:border-white/[0.07] dark:bg-[#111827] dark:text-slate-200"
              >
                <action.icon size={16} /> {action.label}
              </motion.button>
            ))}
            <input ref={fileInputRef} type="file" className="hidden" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
