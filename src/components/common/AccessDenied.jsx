import { Link } from 'react-router-dom';
import { ShieldX } from 'lucide-react';
import Button from '../ui/Button';

function AccessDenied() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="surface-panel w-full max-w-xl p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-50 text-rose-600">
          <ShieldX className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-3xl font-bold text-[var(--text)]">Access denied</h1>
        <p className="mt-3 text-sm text-muted sm:text-base">
          This area is limited to administrators. Use an admin account or return to the main workspace.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to="/dashboard">
            <Button>Go to dashboard</Button>
          </Link>
          <Link to="/">
            <Button variant="secondary">Back to home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AccessDenied;
