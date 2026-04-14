import {
  Activity,
  ArrowRight,
  CheckCircle2,
  CircleDollarSign,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
  UserRoundPlus,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useAuth } from '../../hooks/useAuth';

const HERO_STATS = [
  { label: 'Pipeline value', value: '$286k', tone: 'bg-brand-50 text-brand-700' },
  { label: 'Active deals', value: '48', tone: 'bg-amber-50 text-amber-700' },
  { label: 'Reply rate', value: '92%', tone: 'bg-emerald-50 text-emerald-700' },
];

const QUICK_PROOF = [
  { label: 'Customer workspace', value: 'CRUD ready' },
  { label: 'Authentication', value: 'JWT session' },
  { label: 'Admin control', value: 'Role based' },
  { label: 'Deploy target', value: 'Vercel + Render' },
];

const CRM_FEATURES = [
  {
    title: 'Pipeline visibility',
    description:
      'Watch deal value, active stages, and follow-up momentum from the same dashboard your team uses every day.',
    icon: LayoutDashboard,
  },
  {
    title: 'Customer operations',
    description:
      'Create, edit, filter, sort, and review customer records without bouncing between unrelated admin-template pages.',
    icon: Users,
  },
  {
    title: 'Access management',
    description:
      'Control team roles, invited users, and protected routes from an admin area that matches the same product language.',
    icon: UserRoundPlus,
  },
];

const WORKFLOW_STEPS = [
  {
    title: 'Authenticate cleanly',
    description: 'Login, register, restore session, and guard protected routes with a real backend-ready auth flow.',
  },
  {
    title: 'Track the dashboard',
    description: 'Surface customer counts, pipeline value, revenue trend, and activity in one crisp summary view.',
  },
  {
    title: 'Manage customers',
    description: 'Move through list, detail, create, edit, and delete actions with proper state handling and feedback.',
  },
  {
    title: 'Control team access',
    description: 'Keep admin actions focused on users, roles, active state, and profile ownership instead of generic demo modules.',
  },
];

const PREVIEW_ROWS = [
  { name: 'Ava Collins', company: 'Northline Studio', stage: 'Negotiation', value: '$24,000' },
  { name: 'Mina Patel', company: 'Blue Harbor', stage: 'Won', value: '$61,000' },
  { name: 'Carlos Vega', company: 'Orbit Works', stage: 'Proposal', value: '$17,500' },
];

function getStageTone(stage) {
  switch (stage) {
    case 'Won':
      return 'bg-emerald-50 text-emerald-700';
    case 'Negotiation':
      return 'bg-amber-50 text-amber-700';
    default:
      return 'bg-slate-100 text-slate-600';
  }
}

function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="page-shell min-h-screen overflow-hidden">
      <header className="sticky top-0 z-20 border-b border-white/60 bg-[rgba(250,251,255,0.88)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link className="flex items-center gap-3" to="/">
            <img alt="Controllusion" className="h-11 w-11 rounded-[16px]" src="/favicon.svg" />
            <div>
              <p className="text-base font-extrabold text-brand-600">Controllusion</p>
              <p className="text-xs font-semibold text-muted">CRM for customers, users, and pipeline ops</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-bold text-slate-500 md:flex">
            <a href="#overview">Overview</a>
            <a href="#features">Features</a>
            <a href="#workflow">Workflow</a>
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

      <main className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(circle_at_top_left,rgba(79,128,255,0.18),transparent_32%),radial-gradient(circle_at_top_right,rgba(123,160,255,0.18),transparent_28%)]" />

        <section className="px-4 pb-10 pt-14 sm:px-6 lg:px-8 lg:pt-20" id="overview">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white/90 px-4 py-2 text-sm font-extrabold text-brand-700 shadow-[0_16px_35px_-28px_rgba(79,128,255,0.65)]">
                <Sparkles className="h-4 w-4" />
                Controllusion CRM workspace
              </div>

              <h1 className="mt-7 max-w-3xl text-5xl font-black tracking-tight text-[var(--text)] sm:text-6xl">
                The first screen should already feel like the CRM.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
                Controllusion is a focused customer relationship workspace with a polished dashboard, clean customer flow,
                protected user access, and backend-connected actions. The landing page now introduces the same product
                language you see after login.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link to={isAuthenticated ? '/dashboard' : '/register'}>
                  <Button className="w-full sm:w-auto" size="lg">
                    {isAuthenticated ? 'Go to dashboard' : 'Create account'}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to={isAuthenticated ? '/customers' : '/login'}>
                  <Button className="w-full sm:w-auto" size="lg" variant="secondary">
                    {isAuthenticated ? 'View customers' : 'Login'}
                  </Button>
                </Link>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-2">
                {[
                  'Light dashboard shell, rounded cards, and blue-accent hierarchy pulled from the CRM screens.',
                  'Customers, profile, dashboard, and admin stay in one coherent flow instead of random template modules.',
                  'Prepared for Java backend plus PostgreSQL deployment while keeping the frontend interaction clean.',
                  'Responsive layout that still looks intentional on smaller screens instead of collapsing into empty filler.',
                ].map((item) => (
                  <p
                    className="flex items-start gap-3 rounded-[20px] bg-white/80 px-4 py-4 text-sm font-semibold text-slate-600 shadow-[0_22px_40px_-34px_rgba(17,24,39,0.22)]"
                    key={item}
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                    {item}
                  </p>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-10 top-10 hidden h-36 w-36 rounded-full bg-brand-100/80 blur-3xl lg:block" />
              <div className="absolute -right-8 top-16 hidden h-32 w-32 rounded-full bg-sky-100/90 blur-3xl lg:block" />

              <div className="surface-panel overflow-hidden p-3 sm:p-4">
                <div className="rounded-[28px] border border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#f4f7ff_100%)] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] sm:p-4">
                  <div className="flex items-center justify-between rounded-[22px] border border-[color:var(--border)] bg-white px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                    </div>
                    <div className="hidden rounded-full bg-slate-100 px-4 py-1.5 text-xs font-extrabold text-slate-500 sm:block">
                      controllusion.app/dashboard
                    </div>
                    <div className="rounded-full bg-brand-600 px-3 py-1.5 text-xs font-extrabold text-white">Live CRM</div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {HERO_STATS.map((item) => (
                      <div className="rounded-[24px] border border-[color:var(--border)] bg-white p-4 shadow-[0_18px_35px_-28px_rgba(17,24,39,0.14)]" key={item.label}>
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-extrabold ${item.tone}`}>{item.label}</span>
                        <p className="mt-4 text-3xl font-black tracking-tight text-[var(--text)]">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 overflow-hidden rounded-[28px] border border-[color:var(--border)] bg-white p-4 shadow-[0_20px_40px_-32px_rgba(17,24,39,0.18)]">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-brand-600">Dashboard preview</p>
                        <h2 className="mt-2 text-xl font-black text-[var(--text)]">The same shell the app opens after login</h2>
                      </div>
                      <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">Backend-ready</div>
                    </div>

                    <div className="relative mt-4">
                      <img
                        alt="Controllusion dashboard preview"
                        className="w-full rounded-[22px] border border-[color:var(--border)] shadow-[0_24px_50px_-34px_rgba(17,24,39,0.22)]"
                        src="/figma-dashboard-preview.png"
                      />

                      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_0.92fr]">
                        <div className="rounded-[24px] bg-[color:var(--surface-muted)] p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-brand-50 text-brand-700">
                              <Activity className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-brand-600">Recent activity</p>
                              <p className="mt-1 text-sm font-semibold text-slate-500">Meaningful CRM actions, not dead buttons</p>
                            </div>
                          </div>

                          <div className="mt-4 space-y-3">
                            {[
                              { title: 'Customer invited', description: 'Leah Summers joined the active customer pipeline.', amount: '+$13.2k' },
                              { title: 'Profile updated', description: 'Team identity and contact fields stayed in sync.', amount: 'Saved' },
                            ].map((item) => (
                              <div className="rounded-[18px] bg-white px-4 py-4" key={item.title}>
                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <p className="font-extrabold text-[var(--text)]">{item.title}</p>
                                    <p className="mt-1 text-sm text-muted">{item.description}</p>
                                  </div>
                                  <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-black text-brand-600">{item.amount}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-[24px] bg-[color:var(--surface-muted)] p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-emerald-50 text-emerald-700">
                              <CircleDollarSign className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-brand-600">Pipeline snapshot</p>
                              <p className="mt-1 text-sm font-semibold text-slate-500">A clean mini version of the customer list</p>
                            </div>
                          </div>

                          <div className="mt-4 space-y-3">
                            {PREVIEW_ROWS.map((row) => (
                              <div className="flex items-center justify-between gap-4 rounded-[18px] bg-white px-4 py-3" key={row.name}>
                                <div>
                                  <p className="font-extrabold text-[var(--text)]">{row.name}</p>
                                  <p className="text-sm text-muted">{row.company}</p>
                                </div>
                                <div className="text-right">
                                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-extrabold ${getStageTone(row.stage)}`}>{row.stage}</span>
                                  <p className="mt-2 text-sm font-bold text-[var(--text)]">{row.value}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {QUICK_PROOF.map((item) => (
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
              <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-brand-600">Why it lands better now</p>
              <h2 className="mt-4 text-4xl font-black tracking-tight text-[var(--text)]">
                The first page now feels like the product, not a detached promo block.
              </h2>
              <p className="mt-4 text-lg leading-8 text-muted">
                The same rounded cards, pale surfaces, KPI rhythm, and dashboard hierarchy now show up before the user even
                logs in. That makes the entrance screen match the rest of Controllusion instead of fighting it.
              </p>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {CRM_FEATURES.map((feature) => (
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

        <section className="px-4 pb-14 sm:px-6 lg:px-8" id="workflow">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.92fr]">
            <Card>
              <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-brand-600">CRM workflow</p>
              <h3 className="mt-4 text-3xl font-black text-[var(--text)]">
                Built around the pages that actually matter for the final CRM scope.
              </h3>
              <p className="mt-4 text-sm leading-7 text-muted">
                Instead of random template categories, the system stays centered on auth, dashboard, customers, profile,
                admin, and error handling. The home page now previews that exact product direction.
              </p>

              <div className="mt-8 space-y-4">
                {WORKFLOW_STEPS.map((item, index) => (
                  <div className="flex gap-4 rounded-[22px] bg-[color:var(--surface-muted)] px-4 py-4" key={item.title}>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-white text-sm font-black text-brand-600 shadow-[0_16px_28px_-22px_rgba(17,24,39,0.22)]">
                      0{index + 1}
                    </div>
                    <div>
                      <p className="font-extrabold text-[var(--text)]">{item.title}</p>
                      <p className="mt-1 text-sm leading-7 text-muted">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid gap-6">
              <Card>
                <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-brand-600">Primary navigation</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {['Dashboard', 'Customers', 'Profile', 'Admin'].map((item, index) => (
                    <div className="rounded-[18px] border border-[color:var(--border)] bg-white px-4 py-4" key={item}>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">0{index + 1}</p>
                      <p className="mt-2 text-lg font-black text-[var(--text)]">{item}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-brand-50 text-brand-700">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-brand-600">API ready</p>
                    <p className="mt-1 text-sm font-semibold text-slate-500">Frontend on Vercel. Backend on Render. Database on Neon.</p>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-7 text-muted">
                  The frontend uses an environment-based API URL, and the backend exposes JWT auth, customer CRUD, dashboard
                  summary, profile updates, and admin user management behind `/api`.
                </p>
              </Card>
            </div>
          </div>
        </section>

        <section className="px-4 pb-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="surface-panel overflow-hidden px-6 py-8 sm:px-8 sm:py-10">
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-brand-600">Get started</p>
                  <h2 className="mt-3 text-3xl font-black tracking-tight text-[var(--text)] sm:text-4xl">
                    Open the CRM, sign in, and continue in the same visual system from the first click.
                  </h2>
                  <p className="mt-4 max-w-2xl text-base leading-8 text-muted">
                    The landing page now introduces Controllusion with the same polished UI direction as the dashboard,
                    customer list, profile, and admin views.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <Link to={isAuthenticated ? '/dashboard' : '/register'}>
                    <Button className="w-full sm:w-auto lg:w-full" size="lg">
                      {isAuthenticated ? 'Open dashboard' : 'Create account'}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to={isAuthenticated ? '/customers' : '/login'}>
                    <Button className="w-full sm:w-auto lg:w-full" size="lg" variant="secondary">
                      {isAuthenticated ? 'Browse customers' : 'Sign in'}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;
