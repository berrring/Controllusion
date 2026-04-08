import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../hooks/useAuth';

const HomePage = lazy(() => import('../pages/Home'));
const LoginPage = lazy(() => import('../pages/Login'));
const RegisterPage = lazy(() => import('../pages/Register'));
const DashboardPage = lazy(() => import('../pages/Dashboard'));
const CustomersPage = lazy(() => import('../pages/Customers'));
const CustomerDetailPage = lazy(() => import('../pages/CustomerDetail'));
const CustomerCreatePage = lazy(() => import('../pages/CustomerCreate'));
const CustomerEditPage = lazy(() => import('../pages/CustomerEdit'));
const ProfilePage = lazy(() => import('../pages/Profile'));
const AdminPage = lazy(() => import('../pages/Admin'));
const NotFoundPage = lazy(() => import('../pages/NotFound'));

function GuestRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return null;
  }
  return isAuthenticated ? <Navigate replace to="/dashboard" /> : children;
}

function AppRoutes() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="surface-panel w-full max-w-md px-8 py-10 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-brand-600" />
            <p className="mt-5 text-sm text-muted">Loading interface...</p>
          </div>
        </div>
      }
    >
      <Routes>
        <Route element={<HomePage />} path="/" />
        <Route
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
          path="/login"
        />
        <Route
          element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          }
          path="/register"
        />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route element={<DashboardPage />} path="/dashboard" />
            <Route element={<CustomersPage />} path="/customers" />
            <Route element={<CustomerCreatePage />} path="/customers/create" />
            <Route element={<CustomerDetailPage />} path="/customers/:id" />
            <Route element={<CustomerEditPage />} path="/customers/:id/edit" />
            <Route element={<ProfilePage />} path="/profile" />
            <Route
              element={
                <ProtectedRoute allowedRoles={['Admin']} mode="ui">
                  <AdminPage />
                </ProtectedRoute>
              }
              path="/admin"
            />
          </Route>
        </Route>

        <Route element={<NotFoundPage />} path="*" />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
