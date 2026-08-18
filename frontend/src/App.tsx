import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/auth/AuthContext';
import './index.css';

import LoginPage from './features/auth/LoginPage';
import LandingPage from './pages/LandingPage';

import RegisterPage from './features/auth/RegisterPage';
import AdminDashboard from './features/admin/AdminDashboard';
import ClientDashboard from './features/client/ClientDashboard';

// Placeholder Pages
import AdminClients from './features/admin/AdminClients';
import AdminInvoices from './features/admin/AdminInvoices';
import AdminSettings from './features/admin/AdminSettings';
import ClientInvoices from './features/client/ClientInvoices';
import ClientSettings from './features/client/ClientSettings';

const Forbidden = () => <div className="page-center"><h1>403 Forbidden</h1></div>;

const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role?: 'ADMIN' | 'CLIENT' }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="page-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/403" replace />;

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/403" element={<Forbidden />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/clients" element={<ProtectedRoute role="ADMIN"><AdminClients /></ProtectedRoute>} />
      <Route path="/admin/invoices" element={<ProtectedRoute role="ADMIN"><AdminInvoices /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute role="ADMIN"><AdminSettings /></ProtectedRoute>} />
      
      {/* Client Routes */}
      <Route path="/client" element={<ProtectedRoute role="CLIENT"><ClientDashboard /></ProtectedRoute>} />
      <Route path="/client/invoices" element={<ProtectedRoute role="CLIENT"><ClientInvoices /></ProtectedRoute>} />
      <Route path="/client/settings" element={<ProtectedRoute role="CLIENT"><ClientSettings /></ProtectedRoute>} />
      
      <Route path="/" element={<LandingPage />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
