import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AccessDenied from '../components/common/AccessDenied';

function ProtectedRoute({ allowedRoles, mode = 'redirect', children }) {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f8ff] px-6">
        <div className="w-full max-w-md rounded-[24px] border border-[var(--border)] bg-white px-8 py-10 text-center shadow-[0_30px_60px_-34px_rgba(17,24,39,0.2)]">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#edf1fb] border-t-[#4c42e8]" />
          <p className="mt-5 text-sm font-medium text-[#7b86a0]">Preparing your workspace...</p>
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
