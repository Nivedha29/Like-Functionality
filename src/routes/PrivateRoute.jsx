import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';

export default function PrivateRoute({ children }) {
  const { token, ready } = useAuth();
  const location = useLocation();

  // 🟢 Don't render or redirect until auth has initialized.
  if (!ready) return null; // or return a loader, e.g. <div>Loading…</div>

  // 🔒 If not authenticated, go to sign-in.
  if (!token) {
    return <Navigate to="/sign-in" replace state={{ from: location }} />;
  }

  return children;
}
