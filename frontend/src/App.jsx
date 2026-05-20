import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './layouts/Navbar';
import Footer from './layouts/Footer';
import Home from './pages/Home';
import AIServicesAutomation from './pages/AIServicesAutomation';
import ITProductDevelopment from './pages/ITProductDevelopment';
import ThreeDPrintingSolutions from './pages/ThreeDPrintingSolutions';
import DigitalTransformation from './pages/DigitalTransformation';
import AIPoweredManufacturing from './pages/AIPoweredManufacturing';
import Consultation from './pages/Consultation';
import EMSLogin from './pages/EMSLogin';
import EMSSignup from './pages/EMSSignup';
import Testimonials from './pages/Testimonials';
import CaseStudies from './pages/CaseStudies';
import Resources from './pages/Resources';
import Company from './pages/Company';
import Team from './pages/Team';
import Contact from './pages/Contact';

// Dashboard Imports
import ProtectedRoute from './components/dashboard/ProtectedRoute';
import DashboardLayout from './layouts/dashboard/DashboardLayout';
import AdminDashboard from './pages/dashboard/admin/AdminDashboard';
import EmployeeList from './pages/dashboard/admin/EmployeeList';
import EmployeeDetail from './pages/dashboard/admin/EmployeeDetail';
import EmployeeCreate from './pages/dashboard/admin/EmployeeCreate';
import EmployeeEdit from './pages/dashboard/admin/EmployeeEdit';
import { AdminProjects, AdminTasks, AdminAnalytics, AdminSettings } from './pages/dashboard/admin/Placeholders';

import EmployeeDashboard from './pages/dashboard/employee/EmployeeDashboard';
import ProfilePage from './pages/dashboard/employee/ProfilePage';
import { EmployeeTasks, EmployeeProjects, EmployeeSettings } from './pages/dashboard/employee/Placeholders';

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
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Route>
              
            {/* Employee Routes - Uses its own internal layout */}
            <Route path="employee" element={<ProtectedRoute allowedRoles={['employee']} />}>
              <Route index element={<EmployeeDashboard />} />
              <Route path="tasks" element={<EmployeeTasks />} />
              <Route path="projects" element={<EmployeeProjects />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<EmployeeSettings />} />
            </Route>
          </Route>
        </Routes>
      </div>
      {!hideChrome && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;