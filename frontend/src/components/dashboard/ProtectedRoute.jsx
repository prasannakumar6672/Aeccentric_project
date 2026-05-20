import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('ems_token');
  const userStr = localStorage.getItem('ems_user');
  let user = null;

  try {
    if (userStr) user = JSON.parse(userStr);
  } catch (e) {
    console.error('Failed to parse user', e);
  }

  // If no token or user, redirect to login
  if (!token || !user) {
    return <Navigate to="/ems-login" replace />;
  }

  // If roles are specified and user role doesn't match, redirect to their default dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'employee') return <Navigate to="/dashboard/employee" replace />;
    return <Navigate to="/dashboard/admin" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
