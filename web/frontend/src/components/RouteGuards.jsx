import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export const AdminRoute = ({ children, requireSuperadmin = false }) => {
  const { currentUser } = useStore();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPERADMIN') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (requireSuperadmin && currentUser.role !== 'SUPERADMIN') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export const CustomerRoute = ({ children }) => {
  const { currentUser } = useStore();

  if (currentUser && (currentUser.role === 'ADMIN' || currentUser.role === 'SUPERADMIN')) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};