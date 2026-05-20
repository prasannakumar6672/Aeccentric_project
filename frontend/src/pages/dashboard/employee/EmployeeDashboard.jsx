import { useState } from "react";
import {
  CheckSquare, MoreHorizontal, ArrowUpRight, ArrowDownRight,
  Activity, CheckCircle2, Calendar, LayoutDashboard, ListTodo,
  FolderOpen, UserCircle, Settings, LogOut, Bell, Search,
  TrendingUp, Award, Clock, Zap, Target, ChevronRight,
  Star, Coffee, Briefcase
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from "recharts";

// â”€â”€ DATA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const performanceData = [
  { name: "Q1", thisYear: 85, lastYear: 70 },
  { name: "Q2", thisYear: 90, lastYear: 65 },
  { name: "Q3", thisYear: 78, lastYear: 80 },
  { name: "Q4", thisYear: 95, lastYear: 85 },
];

const weeklyActivity = [
  { day: "Mon", tasks: 12, hours: 7.5 },
  { day: "Tue", tasks: 18, hours: 8.2 },
  { day: "Wed", tasks: 9, hours: 6.8 },
  { day: "Thu", tasks: 22, hours: 9.1 },
  { day: "Fri", tasks: 15, hours: 7.3 },
  { day: "Sat", tasks: 5, hours: 3.0 },
  { day: "Sun", tasks: 2, hours: 1.5 },
];

const teamData = [
  { id: 1, name: "Alice Freeman", role: "Senior UX Designer", score: 98, delta: 5, last: 93, avatar: "AF", color: "#1D4ED8" },
  { id: 2, name: "Marcus Johnson", role: "Frontend Lead", score: 92, delta: 2, last: 90, avatar: "MJ", color: "#0ea5e9" },
  { id: 3, name: "Sarah Chen", role: "Product Manager", score: 88, delta: -3, last: 91, avatar: "SC", color: "#f59e0b" },
  { id: 4, name: "David Lopez", role: "Backend Developer", score: 95, delta: 4, last: 91, avatar: "DL", color: "#10b981" },
  { id: 5, name: "Priya Menon", role: "Data Analyst", score: 91, delta: 6, last: 85, avatar: "PM", color: "#ec4899" },
];

const expensesData = [
  { category: "Software & Tools", amount: 1250, percent: 62, color: "#2563EB" },
  { category: "Equipment", amount: 450, percent: 22, color: "#10b981" },
  { category: "Travel & Allowances", amount: 200, percent: 10, color: "#f59e0b" },
  { category: "Training & Dev", amount: 120, percent: 6, color: "#a855f7" },
];

const recentTasks = [
  { id: 1, title: "Redesign onboarding flow", due: "Today", status: "in-progress", priority: "high" },
  { id: 2, title: "Q4 performance review draft", due: "Tomorrow", status: "pending", priority: "medium" },
  { id: 3, title: "Update component library", due: "May 20", status: "completed", priority: "low" },
  { id: 4, title: "Stakeholder presentation", due: "May 22", status: "pending", priority: "high" },
];

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: ListTodo, label: "My Tasks" },
  { icon: FolderOpen, label: "Projects" },
  { icon: UserCircle, label: "Profile" },
  { icon: Settings, label: "Settings" },
];

const tabs = ["Dashboard", "Leave", "Attendance", "Performance"];

const PIE_COLORS = ["#2563EB", "#EEF2FF"];

// â”€â”€ HELPERS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const Avatar = ({ initials, color, size = 36 }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%",
    background: `linear-gradient(135deg, ${color}cc, ${color})`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: size * 0.33, fontWeight: 700, color: "#fff",
    flexShrink: 0, boxShadow: `0 2px 8px ${color}44`
  }}>{initials}</div>
);

const Badge = ({ label, color }) => (
  <span style={{
    fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99,
    background: color + "18", color, border: `1px solid ${color}30`,
    textTransform: "uppercase", letterSpacing: 0.4
  }}>{label}</span>
);

const statusMap = {
  "in-progress": { color: "#2563EB", label: "In Progress" },
  "pending": { color: "#f59e0b", label: "Pending" },
  "completed": { color: "#10b981", label: "Done" },
};
const priorityMap = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#10b981",
};

// â”€â”€ CARD WRAPPER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const Card = ({ children, style = {}, className = "" }) => (
  <div style={{
    background: "#fff",
    borderRadius: 20,
    border: "1px solid #eef2f7",
    boxShadow: "0 1px 3px rgba(15,23,42,0.06), 0 4px 16px rgba(15,23,42,0.04)",
    padding: "22px 24px",
    ...style
  }} className={className}>{children}</div>
);

const SectionTitle = ({ title, sub, action, actionLabel = "View All" }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
    <div>
      <p style={{ fontWeight: 700, fontSize: 16, color: "#0f172a", margin: 0 }}>{title}</p>
      {sub && <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 3 }}>{sub}</p>}
    </div>
    {action && (
      <button onClick={action} style={{ fontSize: 12, fontWeight: 700, color: "#2563EB", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 2 }}>
        {actionLabel} <ChevronRight size={13} />
      </button>
    )}
  </div>
);

// â”€â”€ KPI CARD â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const KPICard = ({ title, value, subtext, icon: Icon, trend, color, delay = 0 }) => (
  <Card style={{ padding: "20px 22px", cursor: "default", transition: "transform 0.2s, box-shadow 0.2s", animationDelay: `${delay}ms` }}
    className="kpi-hover">
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: color + "14", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={19} color={color} />
      </div>
      <button style={{ background: "none", border: "none", cursor: "pointer", color: "#cbd5e1" }}><MoreHorizontal size={16} /></button>
    </div>
    <div style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", letterSpacing: -0.5, lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4, marginBottom: 10 }}>{title}</div>
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{
        display: "flex", alignItems: "center", gap: 2, fontSize: 11, fontWeight: 700,
        padding: "3px 7px", borderRadius: 6,
        color: trend > 0 ? "#059669" : trend < 0 ? "#dc2626" : "#64748b",
        background: trend > 0 ? "#d1fae5" : trend < 0 ? "#fee2e2" : "#f1f5f9"
      }}>
        {trend > 0 ? <ArrowUpRight size={11} /> : trend < 0 ? <ArrowDownRight size={11} /> : null}
        {Math.abs(trend)}%
      </span>
      <span style={{ fontSize: 11, color: "#94a3b8" }}>{subtext}</span>
    </div>
  </Card>
);

// â”€â”€ MAIN COMPONENT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function EmployeeDashboard() {
  const [activeTab, setActiveTab] = useState("Performance");
  const [activeNav, setActiveNav] = useState("Dashboard");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f6f8fc", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", fontSize: 14 }}>

      {/* â”€â”€ SIDEBAR â”€â”€ */}
      <aside style={{
        width: 220, flexShrink: 0, background: "#fff",
        borderRight: "1px solid #eef2f7",
        boxShadow: "2px 0 12px rgba(15,23,42,0.04)",
        display: "flex", flexDirection: "column", padding: "0 0 20px"
      }}>
        {/* Logo */}
        <div style={{ padding: "24px 22px 20px", borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg,#2563EB,#1D4ED8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: 14, fontWeight: 800 }}>A</span>
            </div>
            <div>
              <p style={{ fontWeight: 800, fontSize: 14, color: "#0f172a", margin: 0, letterSpacing: -0.3 }}>AECCENTRIC</p>
              <p style={{ fontSize: 10, color: "#94a3b8", margin: 0, textTransform: "uppercase", letterSpacing: 0.8 }}>Employee Portal</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "16px 12px", flex: 1 }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: "#cbd5e1", textTransform: "uppercase", letterSpacing: 1, padding: "0 10px", marginBottom: 8 }}>Menu</p>
          {navItems.map(({ icon: Icon, label }) => {
            const active = activeNav === label;
            return (
              <button key={label} onClick={() => setActiveNav(label)} style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%",
                padding: "9px 12px", borderRadius: 10, border: "none", cursor: "pointer",
                background: active ? "#eff4ff" : "transparent",
                color: active ? "#2563EB" : "#64748b",
                fontWeight: active ? 700 : 500, fontSize: 13.5,
                marginBottom: 2, transition: "all 0.15s"
              }}>
                <Icon size={17} />
                {label}
                {active && <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#2563EB" }} />}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div style={{ margin: "0 12px", padding: "14px", borderRadius: 12, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar initials="US" color="#2563EB" size={34} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 700, fontSize: 12, color: "#0f172a", margin: 0 }}>User Smith</p>
              <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>Sr. Designer</p>
            </div>
          </div>
        </div>

        <button style={{ display: "flex", alignItems: "center", gap: 8, margin: "10px 12px 0", padding: "9px 12px", borderRadius: 10, border: "none", cursor: "pointer", background: "transparent", color: "#ef4444", fontWeight: 600, fontSize: 13 }}>
          <LogOut size={15} /> Logout
        </button>
      </aside>

      {/* â”€â”€ CONTENT â”€â”€ */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* â”€â”€ TOPBAR â”€â”€ */}
        <header style={{
          background: "#fff", borderBottom: "1px solid #eef2f7",
          padding: "0 28px", height: 64,
          display: "flex", alignItems: "center", gap: 16, flexShrink: 0
        }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: 18, color: "#0f172a", margin: 0, letterSpacing: -0.3 }}>Overview</p>
          </div>
          {/* Search */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f6f8fc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "7px 14px", width: 210 }}>
            <Search size={14} color="#94a3b8" />
            <input placeholder="Searchâ€¦" style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, color: "#0f172a", width: "100%" }} />
          </div>
          {/* Bell */}
          <div style={{ position: "relative", cursor: "pointer" }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff" }}>
              <Bell size={17} color="#64748b" />
            </div>
            <span style={{ position: "absolute", top: 7, right: 8, width: 8, height: 8, borderRadius: "50%", background: "#ef4444", border: "2px solid #fff" }} />
          </div>
          {/* Avatar */}
          <Avatar initials="US" color="#2563EB" size={38} />
        </header>

        {/* â”€â”€ SCROLLABLE BODY â”€â”€ */}
        <main style={{ flex: 1, overflowY: "auto", padding: "28px 28px 32px" }}>

          {/* TABS */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 5, width: "fit-content", marginBottom: 28, boxShadow: "0 1px 4px rgba(15,23,42,0.06)" }}>
            {tabs.map(tab => {
              const active = activeTab === tab;
              return (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{
                  padding: "8px 20px", borderRadius: 10, border: "none", cursor: "pointer",
                  fontSize: 13.5, fontWeight: active ? 700 : 500,
                  background: active ? "#2563EB" : "transparent",
                  color: active ? "#fff" : "#64748b",
                  boxShadow: active ? "0 4px 12px rgba(37,99,235,0.28)" : "none",
                  transition: "all 0.2s"
                }}>{tab}</button>
              );
            })}
          </div>

          {/* KPI GRID â€” 5 columns */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 24 }}>

            {/* My Performance donut */}
            <Card style={{ padding: "20px 18px", textAlign: "center" }}>
              <p style={{ fontWeight: 700, fontSize: 13.5, color: "#0f172a", marginBottom: 12, textAlign: "left" }}>My Performance</p>
              <div style={{ position: "relative", height: 110, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[{ value: 84.34 }, { value: 15.66 }]} innerRadius={36} outerRadius={50}
                      dataKey="value" stroke="none" cornerRadius={6} startAngle={90} endAngle={-270}>
                      <Cell fill="#2563EB" />
                      <Cell fill="#EEF2FF" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>84%</span>
                  <span style={{ fontSize: 9, color: "#94a3b8" }}>score</span>
                </div>
              </div>
              <p style={{ fontSize: 11, color: "#10b981", fontWeight: 700, marginTop: 6 }}>âœ¦ Excellent standing</p>
            </Card>

            <KPICard title="Tasks Assigned" value="189" subtext="vs last month" trend={12.5} icon={CheckSquare} color="#2563EB" delay={50} />
            <KPICard title="Task Completion" value="98.5%" subtext="vs last month" trend={4.2} icon={CheckCircle2} color="#10b981" delay={100} />
            <KPICard title="Attendance Rate" value="89.8%" subtext="vs last month" trend={-2.1} icon={Calendar} color="#f59e0b" delay={150} />
            <KPICard title="Leaves Taken" value="04" subtext="total this year" trend={0} icon={Activity} color="#a855f7" delay={200} />
          </div>

          {/* MAIN 3-COL GRID */}
          <div style={{ display: "grid", gridTemplateColumns: "5fr 4fr 3fr", gap: 20, marginBottom: 20 }}>

            {/* MY TEAM */}
            <Card style={{ padding: "22px 24px" }}>
              <SectionTitle title="My Team" sub="Performance overview for direct reports" action={() => { }} />
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Team Member", "Score", "This Month", "Last Month"].map(h => (
                      <th key={h} style={{ textAlign: h === "Team Member" ? "left" : "center", fontSize: 10.5, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.6, paddingBottom: 12, borderBottom: "1px solid #f1f5f9" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {teamData.map(m => (
                    <tr key={m.id} style={{ borderBottom: "1px solid #f8fafc", cursor: "pointer" }}>
                      <td style={{ padding: "12px 0" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <Avatar initials={m.avatar} color={m.color} size={34} />
                          <div>
                            <p style={{ fontWeight: 700, fontSize: 13, color: "#0f172a", margin: 0 }}>{m.name}</p>
                            <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{m.role}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span style={{
                          padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 700,
                          background: m.score >= 90 ? "#d1fae5" : m.score >= 80 ? "#eff4ff" : "#fef3c7",
                          color: m.score >= 90 ? "#059669" : m.score >= 80 ? "#2563EB" : "#d97706"
                        }}>{m.score}%</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: m.delta > 0 ? "#059669" : "#dc2626" }}>
                          {m.delta > 0 ? "+" : ""}{m.delta}%
                        </span>
                      </td>
                      <td style={{ textAlign: "center", fontSize: 13, color: "#64748b", fontWeight: 600 }}>{m.last}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            {/* PERFORMANCE BAR CHART */}
            <Card style={{ padding: "22px 24px" }}>
              <SectionTitle title="Performance" sub="Year over year comparison" />
              <div style={{ display: "flex", gap: 16, marginBottom: 16, fontSize: 11, color: "#64748b" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: "#2563EB", display: "inline-block" }} /> This Year</span>
                <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: "#e2e8f0", display: "inline-block" }} /> Last Year</span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={performanceData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                  />
                  <Bar dataKey="thisYear" fill="#2563EB" radius={[5, 5, 0, 0]} barSize={14} />
                  <Bar dataKey="lastYear" fill="#e2e8f0" radius={[5, 5, 0, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* BUDGET & EXPENSES */}
            <Card style={{ padding: "22px 22px", display: "flex", flexDirection: "column" }}>
              <SectionTitle title="Budget & Expenses" />
              <div style={{ marginBottom: 18 }}>
                <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>Total Spent (YTD)</p>
                <p style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", margin: "4px 0 0", letterSpacing: -0.5 }}>$1,900<span style={{ fontSize: 15, color: "#94a3b8", fontWeight: 600 }}>.00</span></p>
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
                {expensesData.map((item, i) => (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12 }}>
                      <span style={{ color: "#475569", fontWeight: 600 }}>{item.category}</span>
                      <span style={{ color: "#0f172a", fontWeight: 700 }}>${item.amount}</span>
                    </div>
                    <div style={{ width: "100%", height: 6, background: "#f1f5f9", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ width: `${item.percent}%`, height: "100%", background: item.color, borderRadius: 99, transition: "width 1s ease" }} />
                    </div>
                  </div>
                ))}
              </div>
              <button style={{ width: "100%", marginTop: 20, padding: "10px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#f8fafc", color: "#0f172a", fontWeight: 700, fontSize: 12.5, cursor: "pointer", transition: "background 0.15s" }}>
                Generate Report â†’
              </button>
            </Card>
          </div>

          {/* BOTTOM ROW: Weekly Activity + Recent Tasks + Achievements */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 300px", gap: 20 }}>

            {/* WEEKLY ACTIVITY */}
            <Card style={{ padding: "22px 24px" }}>
              <SectionTitle title="Weekly Activity" sub="Tasks completed & hours logged" />
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={weeklyActivity} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="taskGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} dy={6} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 12 }} />
                  <Area type="monotone" dataKey="tasks" stroke="#2563EB" strokeWidth={2} fill="url(#taskGrad)" dot={{ fill: "#2563EB", r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", gap: 16, marginTop: 12, paddingTop: 12, borderTop: "1px solid #f1f5f9" }}>
                {[{ label: "Avg Tasks/Day", val: "11.9", icon: Target, color: "#2563EB" }, { label: "Total Hours", val: "43.4h", icon: Clock, color: "#10b981" }, { label: "Focus Score", val: "87%", icon: Zap, color: "#f59e0b" }].map(m => (
                  <div key={m.label} style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: m.color + "14", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <m.icon size={14} color={m.color} />
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", margin: 0 }}>{m.val}</p>
                      <p style={{ fontSize: 10, color: "#94a3b8", margin: 0 }}>{m.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* RECENT TASKS */}
            <Card style={{ padding: "22px 24px" }}>
              <SectionTitle title="Recent Tasks" sub="Your active workload" action={() => { }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {recentTasks.map(task => {
                  const s = statusMap[task.status];
                  return (
                    <div key={task.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 12, background: "#f8fafc", border: "1px solid #f1f5f9", cursor: "pointer", transition: "border-color 0.15s" }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: priorityMap[task.priority], flexShrink: 0, boxShadow: `0 0 6px ${priorityMap[task.priority]}55` }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 600, fontSize: 13, color: "#0f172a", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{task.title}</p>
                        <p style={{ fontSize: 11, color: "#94a3b8", margin: "2px 0 0" }}>Due: {task.due}</p>
                      </div>
                      <Badge label={s.label} color={s.color} />
                    </div>
                  );
                })}
              </div>
              <button style={{ width: "100%", marginTop: 14, padding: "9px", borderRadius: 10, border: "1.5px dashed #e2e8f0", background: "transparent", color: "#2563EB", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}>
                + Add New Task
              </button>
            </Card>

            {/* ACHIEVEMENTS */}
            <Card style={{ padding: "22px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
              <SectionTitle title="Achievements" sub="Earned this quarter" />
              {[
                { icon: Star, label: "Top Performer", sub: "April 2025", color: "#f59e0b" },
                { icon: Award, label: "100% Attendance", sub: "March 2025", color: "#2563EB" },
                { icon: TrendingUp, label: "Sprint Champion", sub: "3 sprints in a row", color: "#10b981" },
                { icon: Coffee, label: "Team Mentor", sub: "Onboarded 2 devs", color: "#a855f7" },
              ].map((a, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 12, background: a.color + "0d", border: `1px solid ${a.color}20` }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: a.color + "20", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <a.icon size={16} color={a.color} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 12.5, color: "#0f172a", margin: 0 }}>{a.label}</p>
                    <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{a.sub}</p>
                  </div>
                </div>
              ))}
            </Card>
          </div>

        </main>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .kpi-hover:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(15,23,42,0.10) !important; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 2px; }
        input::placeholder { color: #94a3b8; }
        tr:hover td { background: #fafbff; }
      `}</style>
    </div>
  );
}