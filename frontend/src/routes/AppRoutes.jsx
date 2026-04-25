import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../hooks/useAuth';

const HomePage = lazy(() => import('../pages/Home'));
const LoginPage = lazy(() => import('../pages/Login'));
const RegisterPage = lazy(() => import('../pages/Register'));
const DashboardPage = lazy(() => import('../pages/Dashboard'));
const LeadsPage = lazy(() => import('../pages/Leads'));
const CustomersPage = lazy(() => import('../pages/Customers'));
const CustomerCreatePage = lazy(() => import('../pages/CustomerCreate'));
const CustomerDetailPage = lazy(() => import('../pages/CustomerDetail'));
const CustomerEditPage = lazy(() => import('../pages/CustomerEdit'));
const DealsPage = lazy(() => import('../pages/Deals'));
const AnalyticsPage = lazy(() => import('../pages/Analytics'));
const ProfilePage = lazy(() => import('../pages/Profile'));
const SettingsPage = lazy(() => import('../pages/Settings'));
const SearchResultsPage = lazy(() => import('../pages/SearchResults'));
const ActivityPage = lazy(() => import('../pages/Activity'));
const AdminPage = lazy(() => import('../pages/Admin'));
const AccessDeniedPage = lazy(() => import('../pages/AccessDenied'));
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
        <div className="flex min-h-screen items-center justify-center bg-[#f6f8fc] px-6">
          <div className="w-full max-w-md rounded-[30px] border border-[color:var(--border)] bg-white px-8 py-10 text-center shadow-[0_24px_60px_-38px_rgba(17,24,39,0.2)]">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-[#4f80ff]" />
            <p className="mt-5 text-sm font-semibold text-[#8b93a8]">Loading interface...</p>
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
            <Route element={<LeadsPage />} path="/leads" />
            <Route element={<CustomersPage />} path="/customers" />
            <Route element={<CustomerCreatePage />} path="/customers/create" />
            <Route element={<CustomerDetailPage />} path="/customers/:id" />
            <Route element={<CustomerEditPage />} path="/customers/:id/edit" />
            <Route element={<DealsPage />} path="/deals" />
            <Route element={<AnalyticsPage />} path="/analytics" />
            <Route element={<ActivityPage />} path="/activity" />
            <Route element={<SearchResultsPage />} path="/search" />
            <Route element={<ProfilePage />} path="/profile" />
            <Route element={<SettingsPage />} path="/settings" />
            <Route element={<AccessDeniedPage />} path="/access-denied" />
            <Route element={<ProtectedRoute allowedRoles={['Admin']} mode="ui" />}>
              <Route element={<AdminPage />} path="/admin" />
            </Route>
          </Route>
        </Route>

        <Route element={<NotFoundPage />} path="*" />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
