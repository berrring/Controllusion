import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HOME_FEATURES, KPI_TRUST_ITEMS } from '../../utils/constants';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useAuth } from '../../hooks/useAuth';

function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="page-shell min-h-screen">
      <header className="sticky top-0 z-20 border-b border-white/60 bg-[rgba(250,251,255,0.88)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link className="flex items-center gap-3" to="/">
            <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-brand-50 text-sm font-extrabold text-brand-700">
              C
            </div>
            <div>
              <p className="text-base font-extrabold text-brand-600">Controllusion</p>
              <p className="text-xs font-semibold text-muted">Figma-inspired CRM shell</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-bold text-slate-500 md:flex">
            <a href="#features">Features</a>
            <a href="#preview">Preview</a>
            <a href="#why">Why it works</a>
          </nav>

          <div className="flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Link className="hidden sm:block" to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Get Started</Button>
                </Link>
              </>
            ) : (
              <Link to="/dashboard">
                <Button>Open Dashboard</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-extrabold text-brand-700">
                <ShieldCheck className="h-4 w-4" />
                Rebuilt to mirror the shared Figma dashboard style
              </div>

              <h1 className="mt-7 max-w-3xl text-5xl font-black tracking-tight text-[var(--text)] sm:text-6xl">
                Customer workflows now sit inside the same bright admin system as the Figma reference.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
                The project keeps its CRM routes and logic, but the shell, cards, tables, forms, and auth pages now follow
                the blue-and-white dashboard language from the provided design.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link to={isAuthenticated ? '/dashboard' : '/register'}>
                  <Button className="w-full sm:w-auto" size="lg">
                    {isAuthenticated ? 'Go to dashboard' : 'Create workspace'}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to={isAuthenticated ? '/customers' : '/login'}>
                  <Button className="w-full sm:w-auto" size="lg" variant="secondary">
                    {isAuthenticated ? 'View customers' : 'Login'}
                  </Button>
                </Link>
              </div>

              <div className="mt-10 space-y-3">
                {[
                  'Dashboard analytics, customer tables, forms, and account pages share one visual system.',
                  'The layout stays responsive on desktop and mobile while keeping the same shell structure.',
                  'Protected routes, admin tools, and local mock workflows remain intact.',
                ].map((item) => (
                  <p className="flex items-start gap-3 text-sm font-semibold text-slate-600" key={item}>
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                    {item}
                  </p>
                ))}
              </div>
            </div>

            <div className="relative" id="preview">
              <div className="absolute -left-4 top-10 hidden h-28 w-28 rounded-full bg-brand-100 blur-3xl lg:block" />
              <Card className="overflow-hidden p-4 sm:p-5">
                <div className="rounded-[24px] bg-[linear-gradient(180deg,#ffffff_0%,#f5f8ff_100%)] p-4">
                  <img
                    alt="Dashboard preview inspired by the provided Figma design"
                    className="w-full rounded-[22px] border border-[color:var(--border)] shadow-[0_24px_50px_-30px_rgba(17,24,39,0.2)]"
                    src="/figma-dashboard-preview.png"
                  />
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {KPI_TRUST_ITEMS.map((item) => (
              <div className="surface-card panel-outline p-5" key={item.label}>
                <p className="text-sm font-semibold text-muted">{item.label}</p>
                <p className="mt-3 text-3xl font-black text-[var(--text)]">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 lg:px-8" id="features">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-brand-600">Features</p>
              <h2 className="mt-4 text-4xl font-black tracking-tight text-[var(--text)]">
                The restyle goes past the dashboard and into the actual CRM workflows.
              </h2>
              <p className="mt-4 text-lg leading-8 text-muted">
                Shared components carry the design through data tables, customer detail views, creation/edit flows,
                profile settings, admin tooling, and authentication.
              </p>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {HOME_FEATURES.map((feature) => (
                <Card className="h-full" key={feature.title}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-brand-50 text-brand-700">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-black text-[var(--text)]">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-24 sm:px-6 lg:px-8" id="why">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.9fr]">
            <Card>
              <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-brand-600">Why Controllusion</p>
              <h3 className="mt-4 text-3xl font-black text-[var(--text)]">
                A practical CRM rebuilt around one clear visual rhythm.
              </h3>
              <p className="mt-4 text-sm leading-7 text-muted">
                Instead of styling only the landing page, the update pushes the same blue highlight system, rounded cards,
                bright tables, and lightweight chrome across the complete route set in this repository.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  'Dashboard metrics and analytics use the same card proportions as the Figma frame.',
                  'Customer management screens keep the CRM logic but inherit the same shell and component language.',
                  'Profile and admin flows now feel like part of the same product instead of separate layouts.',
                  'Auth pages use the same visual palette and preview imagery rather than an unrelated style.',
                ].map((item) => (
                  <div className="rounded-[18px] bg-[color:var(--surface-muted)] px-4 py-4 text-sm font-semibold text-slate-700" key={item}>
                    {item}
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid gap-6">
              <Card>
                <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-brand-600">Current routes</p>
                <p className="mt-4 text-2xl font-black text-[var(--text)]">Dashboard, customers, detail, form, profile, admin, auth.</p>
                <p className="mt-3 text-sm leading-7 text-muted">
                  The existing application structure stays intact while the presentation layer moves closer to the supplied Figma direction.
                </p>
              </Card>

              <Card>
                <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-brand-600">Asset note</p>
                <p className="mt-4 text-sm leading-7 text-muted">
                  The shared Figma link exposed one rendered dashboard frame and a low-resolution canvas thumbnail. That was enough to reproduce
                  the overall style, but not enough to export every original image asset exactly.
                </p>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;
