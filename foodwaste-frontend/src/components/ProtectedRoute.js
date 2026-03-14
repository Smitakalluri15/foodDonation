import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="loading-center"><div className="spinner" /></div>;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    // Redirect to correct dashboard
    const dashboards = { DONOR: '/donor', NGO: '/ngo', VOLUNTEER: '/volunteer', ADMIN: '/admin' };
    return <Navigate to={dashboards[user.role] || '/'} replace />;
  }

  return children;
};

export default ProtectedRoute;
