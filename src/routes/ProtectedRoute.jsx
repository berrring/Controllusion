import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AccessDenied from '../components/common/AccessDenied';

function ProtectedRoute({ allowedRoles, mode = 'redirect', children }) {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="surface-panel w-full max-w-md px-8 py-10 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-brand-600" />
          <p className="mt-5 text-sm text-muted">Preparing your workspace...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(user?.role)) {
    if (mode === 'ui') {
      return <AccessDenied />;
    }
    return <Navigate replace to="/dashboard" />;
  }

  return children || <Outlet />;
}

export default ProtectedRoute;
