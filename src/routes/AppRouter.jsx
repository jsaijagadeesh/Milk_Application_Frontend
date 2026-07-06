import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

import AppLayout      from '../components/layout/AppLayout';
import LoginPage      from '../pages/auth/LoginPage';
import RegisterPage   from '../pages/auth/RegisterPage';
import DashboardPage  from '../pages/dashboard/DashboardPage';
import ProductsPage   from '../pages/products/ProductsPage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ProductsAdminPage from '../pages/admin/ProductsAdminPage';
import UsersPage      from '../pages/admin/UsersPage';

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
}

function GuestRoute({ children }) {
  const { isAuthenticated, isAdmin } = useAuth();
  if (isAuthenticated) return <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />;
  return children;
}

export default function AppRouter({ toastContainer }) {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

      {/* Protected user routes */}
      <Route element={<PrivateRoute><AppLayout toastContainer={toastContainer} /></PrivateRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/products"  element={<ProductsPage />} />
      </Route>

      {/* Admin-only routes */}
      <Route element={<AdminRoute><AppLayout toastContainer={toastContainer} /></AdminRoute>}>
        <Route path="/admin"          element={<AdminDashboard />} />
        <Route path="/admin/products" element={<ProductsAdminPage />} />
        <Route path="/admin/users"    element={<UsersPage />} />
      </Route>

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
