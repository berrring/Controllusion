import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Button from '../../components/ui/Button';

function NotFoundPage() {
  return (
    <div className="page-shell flex min-h-screen items-center justify-center px-4 py-8">
      <div className="surface-panel w-full max-w-5xl overflow-hidden p-4 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div className="p-4 sm:p-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-brand-50 text-brand-700 lg:mx-0">
              <Compass className="h-8 w-8" />
            </div>
            <p className="mt-6 text-sm font-extrabold uppercase tracking-[0.18em] text-brand-600">404</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-[var(--text)]">That page is off the map.</h1>
            <p className="mt-4 max-w-lg text-base leading-8 text-muted">
              The route you requested does not exist in this workspace. Return to the homepage or jump back into the CRM dashboard.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/">
                <Button>Go home</Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="secondary">Open dashboard</Button>
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] bg-[linear-gradient(180deg,#f7faff_0%,#eff4ff_100%)] p-4 sm:p-5">
            <img alt="Dashboard preview" className="w-full rounded-[22px] border border-white/80 shadow-[0_28px_50px_-34px_rgba(17,24,39,0.18)]" src="/figma-dashboard-preview.png" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
