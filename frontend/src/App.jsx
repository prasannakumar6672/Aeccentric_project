import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './layouts/Navbar';
import Footer from './layouts/Footer';

// Dashboard Imports
import ProtectedRoute from './components/dashboard/ProtectedRoute';
import DashboardLayout from './layouts/dashboard/DashboardLayout';

const Home = lazy(() => import('./pages/Home'));
const AIServicesAutomation = lazy(() => import('./pages/AIServicesAutomation'));
const ITProductDevelopment = lazy(() => import('./pages/ITProductDevelopment'));
const ThreeDPrintingSolutions = lazy(() => import('./pages/ThreeDPrintingSolutions'));
const DigitalTransformation = lazy(() => import('./pages/DigitalTransformation'));
const AIPoweredManufacturing = lazy(() => import('./pages/AIPoweredManufacturing'));
const Consultation = lazy(() => import('./pages/Consultation'));
const EMSLogin = lazy(() => import('./pages/EMSLogin'));
const EMSSignup = lazy(() => import('./pages/EMSSignup'));
const Testimonials = lazy(() => import('./pages/Testimonials'));
const CaseStudies = lazy(() => import('./pages/CaseStudies'));
const Resources = lazy(() => import('./pages/Resources'));
const Company = lazy(() => import('./pages/Company'));
const Team = lazy(() => import('./pages/Team'));
const Contact = lazy(() => import('./pages/Contact'));

const AdminDashboard = lazy(() => import('./pages/dashboard/admin/AdminDashboard'));
const EmployeeList = lazy(() => import('./pages/dashboard/admin/EmployeeList'));
const EmployeeDetail = lazy(() => import('./pages/dashboard/admin/EmployeeDetail'));
const EmployeeCreate = lazy(() => import('./pages/dashboard/admin/EmployeeCreate'));
const EmployeeEdit = lazy(() => import('./pages/dashboard/admin/EmployeeEdit'));
const AdminAnalytics = lazy(() => import('./pages/dashboard/admin/AdminAnalytics'));
const AdminProjects = lazy(() => import('./pages/dashboard/admin/AdminProjects'));
const AdminTasks = lazy(() => import('./pages/dashboard/admin/AdminTasks'));
const AICopilot = lazy(() => import('./pages/dashboard/admin/AICopilot'));
const Reports = lazy(() => import('./pages/dashboard/admin/Reports'));
const Finance = lazy(() => import('./pages/dashboard/admin/Finance'));
const Security = lazy(() => import('./pages/dashboard/admin/Security'));
const Messages = lazy(() => import('./pages/dashboard/admin/Messages'));
const Calendar = lazy(() => import('./pages/dashboard/admin/Calendar'));
const Integrations = lazy(() => import('./pages/dashboard/admin/Integrations'));
const AdminSettings = lazy(() => import('./pages/dashboard/admin/Settings'));
const AdminLeaves = lazy(() => import('./pages/dashboard/admin/AdminLeaves'));
const Attendance = lazy(() => import('./pages/dashboard/admin/Attendance'));

const EmployeeDashboard = lazy(() => import('./pages/dashboard/employee/EmployeeDashboard'));
const ProfilePage = lazy(() => import('./pages/dashboard/employee/ProfilePage'));
const EmployeeTasks = lazy(() => import('./pages/dashboard/employee/EmployeeTasks'));
const EmployeeProjects = lazy(() => import('./pages/dashboard/employee/EmployeeProjects'));
const EmployeeLeaves = lazy(() => import('./pages/dashboard/employee/EmployeeLeaves'));
const EmployeeSettings = lazy(() => import('./pages/dashboard/employee/EmployeeSettings'));
const PlaceholderPage = lazy(() => import('./pages/dashboard/employee/Placeholders'));
const EmployeeMessages = lazy(() => import('./pages/dashboard/employee/EmployeeMessages'));

// Routes where the site Navbar + Footer are hidden (standalone fullscreen pages)
const HIDDEN_CHROME_ROUTES = ['/ems-login', '/ems-signup'];

function Layout() {
  const location = useLocation();
  const hideChrome = HIDDEN_CHROME_ROUTES.includes(location.pathname) || location.pathname.startsWith('/dashboard');

  return (
    <div className="min-h-screen bg-[var(--bg)] transition-colors duration-500">
      {!hideChrome && <Navbar />}
      <div className={hideChrome ? '' : 'app-main-content'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services/ai-services-and-automation" element={<AIServicesAutomation />} />
          <Route path="/services/it-product-development" element={<ITProductDevelopment />} />
          <Route path="/services/3d-printing-and-engineering-solutions" element={<ThreeDPrintingSolutions />} />
          <Route path="/services/digital-transformation-services" element={<DigitalTransformation />} />
          <Route path="/services/ai-powered-manufacturing" element={<AIPoweredManufacturing />} />
          <Route path="/consultation" element={<Consultation />} />
          <Route path="/ems-login" element={<EMSLogin />} />
          <Route path="/ems-signup" element={<EMSSignup />} />
          <Route path="/work/testimonials" element={<Testimonials />} />
          <Route path="/work/case-studies" element={<CaseStudies />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/about/company" element={<Company />} />
          <Route path="/about/team" element={<Team />} />
          <Route path="/contact" element={<Contact />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              {/* Admin Routes */}
              <Route path="admin" element={<ProtectedRoute allowedRoles={['super_admin', 'admin', 'hr']} />}>
                <Route index element={<AdminDashboard />} />
                <Route path="employees" element={<EmployeeList />} />
                <Route path="employees/:id" element={<EmployeeDetail />} />
                <Route path="employees/create" element={<EmployeeCreate />} />
                <Route path="employees/edit/:id" element={<EmployeeEdit />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="tasks" element={<AdminTasks />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="ai" element={<AICopilot />} />
                <Route path="reports" element={<Reports />} />
                <Route path="finance" element={<Finance />} />
                <Route path="security" element={<Security />} />
                <Route path="messages" element={<Messages />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="integrations" element={<Integrations />} />
                <Route path="leaves" element={<AdminLeaves />} />
                <Route path="attendance" element={<Attendance />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Route>
              
            {/* Employee Routes - Uses standard DashboardLayout */}
            <Route path="employee" element={<ProtectedRoute allowedRoles={['employee']} />}>
              <Route element={<DashboardLayout />}>
                <Route index element={<EmployeeDashboard />} />
                <Route path="tasks" element={<EmployeeTasks />} />
                <Route path="projects" element={<EmployeeProjects />} />
                <Route path="leaves" element={<EmployeeLeaves />} />
                <Route path="attendance" element={<Attendance />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="settings" element={<EmployeeSettings />} />
                <Route path="messages" element={<EmployeeMessages />} />
                <Route path="timesheets" element={<PlaceholderPage title="Timesheets" description="Daily work logs, submitted hours, and approval history." />} />
                <Route path="performance" element={<PlaceholderPage title="My Performance" description="Completion trends, productivity insights, goals, and recognition." />} />
                <Route path="salary" element={<PlaceholderPage title="My Salary" description="Payslips, salary structure, reimbursements, and payroll status." />} />
                <Route path="expenses" element={<PlaceholderPage title="Expenses" description="Reimbursement claims, uploaded bills, and approval progress." />} />
                <Route path="announcements" element={<PlaceholderPage title="Announcements" description="Company updates, HR notices, and policy broadcasts." />} />
                <Route path="meetings" element={<PlaceholderPage title="Meetings" description="Today's calls, upcoming reviews, and meeting links." />} />
                <Route path="notifications" element={<PlaceholderPage title="Notifications" description="Unread alerts, approvals, task updates, and system messages." />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </div>
      {!hideChrome && <Footer />}
    </div>
  );
}

function RouteFallback() {
  return <div className="min-h-[50vh]" aria-busy="true" />;
}

function App() {
  return (
    <Router>
      <Suspense fallback={<RouteFallback />}>
        <Layout />
      </Suspense>
    </Router>
  );
}

export default App;
