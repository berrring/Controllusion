import {
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  Grid2x2,
  LayoutDashboard,
  Mail,
  MoreHorizontal,
  Play,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
  Workflow,
} from 'lucide-react';
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UIContext } from '../../context/UIContext';

const desktopFeatures = [
  {
    title: 'Automated Workflows',
    description:
      'Build fluid processes that execute automatically, reduce manual entry, and let the system handle the scaffolding.',
    icon: Workflow,
    className: 'home-bento-card lg:h-[328px]',
  },
  {
    title: 'Advanced Analytics',
    description:
      'Turn raw metrics into clear signals. The analytics layer is tuned for fast decisions instead of dashboard noise.',
    icon: BarChart3,
    className: 'home-bento-card lg:col-span-2 lg:h-[328px]',
  },
  {
    title: 'Team Collaboration',
    description:
      'Coordinate handoffs, notes, and account ownership in one place without losing the primary objective.',
    icon: Users,
    className: 'home-bento-card lg:col-span-2 lg:h-[242px]',
  },
  {
    title: 'Enterprise Security',
    description: 'Bank-grade encryption standard.',
    icon: ShieldCheck,
    className: 'home-accent-card lg:h-[242px]',
  },
];

const mobileFeatures = [
  {
    title: 'Precision Analytics',
    description: 'Cut through the noise. Real-time metrics presented with absolute clarity and zero clutter.',
    icon: BarChart3,
  },
  {
    title: 'Fluid Workflows',
    description: 'Designed for speed. Navigate complex datasets with intuitive, gesture-based controls.',
    icon: Workflow,
  },
  {
    title: 'Enterprise Security',
    description: 'Bank-grade encryption ensuring your most sensitive data remains locked down and compliant.',
    icon: ShieldCheck,
  },
];

const desktopNav = [
  { label: 'Features', href: '#features' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Pricing', href: '#footer' },
  { label: 'Resources', href: '#footer' },
];

const footerGroups = [
  {
    title: 'PRODUCT',
    links: ['Features', 'Integrations', 'Pricing', 'Changelog'],
  },
  {
    title: 'COMPANY',
    links: ['About Us', 'Careers', 'Blog', 'Contact'],
  },
  {
    title: 'LEGAL',
    links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
  },
];

function AnalyticsChart() {
  const bars = [18, 31, 45, 57, 74, 92];
  const points = [
    [24, 158],
    [64, 136],
    [104, 132],
    [148, 110],
    [190, 92],
    [232, 48],
    [282, 18],
  ];

  return (
    <div className="relative h-[192px] w-full overflow-hidden rounded-[8px] bg-[#e6eeff] lg:max-w-[311px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(53,37,205,0.14),transparent_56%)]" />
      <svg className="absolute inset-0 h-full w-full" fill="none" viewBox="0 0 308 192">
        {[28, 60, 92, 124, 156].map((y) => (
          <line key={y} stroke="rgba(70,69,85,0.14)" x1="0" x2="308" y1={y} y2={y} />
        ))}
      </svg>
      <div className="absolute inset-x-0 bottom-0 flex h-full items-end gap-4 px-5 pb-4 pt-8">
        {bars.map((height, index) => (
          <div className="flex h-full flex-1 items-end" key={`${height}-${index}`}>
            <div
              className="w-full rounded-t-[6px] bg-[linear-gradient(180deg,#31c8ff_0%,#1e9be8_100%)] shadow-[0_14px_24px_-18px_rgba(30,155,232,0.85)]"
              style={{ height: `${height}%` }}
            />
          </div>
        ))}
      </div>
      <svg className="absolute inset-0 h-full w-full" fill="none" viewBox="0 0 308 192">
        <polyline
          points={points.map(([x, y]) => `${x},${y}`).join(' ')}
          stroke="#f59e0b"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
        />
        {points.map(([x, y]) => (
          <circle cx={x} cy={y} fill="#f59e0b" key={`${x}-${y}`} r="3" />
        ))}
      </svg>
    </div>
  );
}

function MobileHome({ isAuthenticated, heroAction, secondaryAction, onOpenHub, onShowUpdates }) {
  const mobileNavItems = [
    {
      label: 'Home',
      icon: Grid2x2,
      to: '/',
    },
    {
      label: isAuthenticated ? 'Dash' : 'Login',
      icon: LayoutDashboard,
      to: isAuthenticated ? '/dashboard' : '/login',
    },
    {
      label: isAuthenticated ? 'Profile' : 'Join',
      icon: UserRound,
      to: isAuthenticated ? '/profile' : '/register',
    },
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-[#f6f8ff] lg:hidden">
      <div className="pointer-events-none absolute left-[-15%] top-[6%] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(76,66,232,0.16)_0%,rgba(76,66,232,0)_72%)]" />
      <div className="pointer-events-none absolute bottom-[22%] right-[-12%] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(111,179,255,0.14)_0%,rgba(111,179,255,0)_72%)]" />

      <header className="fixed inset-x-0 top-0 z-30 border-b border-[rgba(229,234,246,0.96)] bg-[rgba(255,255,255,0.96)] backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[560px] items-center justify-between px-4">
          <button className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#eef2ff] text-[#4c42e8]" onClick={onOpenHub} type="button">
            <Grid2x2 className="h-4 w-4" />
          </button>
          <p className="text-sm font-black tracking-[-0.03em] text-[#1f2a44]">Controllusion</p>
          <button className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#eef2ff] text-[#4c42e8]" onClick={onShowUpdates} type="button">
            <Bell className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[560px] px-4 pb-[94px] pt-20">
        <div className="rounded-full bg-[#eef2ff] px-3 py-1.5 text-center text-[11px] font-bold uppercase tracking-[0.12em] text-[#4c42e8]">
          New: AI Insights V2
        </div>

        <h1 className="mt-6 text-center text-[42px] font-black tracking-[-0.06em] text-[#1f2a44]">
          Master your data.
          <span className="block text-[#4c42e8]">Effortlessly.</span>
        </h1>

        <p className="mx-auto mt-4 max-w-[320px] text-center text-base leading-8 text-[#6d7890]">
          The high-end workspace for decision makers. Precision analytics, fluid workflows, zero friction.
        </p>

        <div className="mt-8 space-y-3">
          <Link
            className="flex h-12 items-center justify-center rounded-[12px] bg-[linear-gradient(135deg,#4c42e8_0%,#5a49f4_100%)] text-sm font-bold text-white shadow-[0_18px_30px_-20px_rgba(76,66,232,0.85)]"
            to={heroAction.to}
          >
            {isAuthenticated ? 'Open Dashboard' : 'Start Free Trial'}
          </Link>
          <Link
            className="flex h-12 items-center justify-center rounded-[12px] bg-[#dbe5ff] text-sm font-bold text-[#2f2ac8]"
            to={secondaryAction.to}
          >
            {isAuthenticated ? 'View Customers' : 'View Demo'}
          </Link>
        </div>

        <div className="mt-8 overflow-hidden rounded-[18px] border border-white/70 bg-white p-2 shadow-[0_20px_44px_-28px_rgba(17,24,39,0.26)]">
          <img
            alt="Controllusion preview"
            className="h-[260px] w-full rounded-[14px] object-cover"
            src="/figma-dashboard-preview.png"
          />
        </div>

        <section className="mt-10" id="mobile-features">
          <h2 className="text-[24px] font-black tracking-[-0.04em] text-[#1f2a44]">Why Controllusion?</h2>
          <div className="mt-5 space-y-4">
            {mobileFeatures.map((feature) => (
              <article
                className="rounded-[18px] border border-[rgba(237,240,251,0.96)] bg-white p-5 shadow-[0_18px_40px_-34px_rgba(31,42,68,0.12)]"
                key={feature.title}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#eef2ff] text-[#4c42e8]">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-[22px] font-black tracking-[-0.04em] text-[#1f2a44]">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#6d7890]">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[rgba(229,234,246,0.96)] bg-[rgba(255,255,255,0.96)] px-3 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] pt-3 backdrop-blur">
        <div className="mx-auto flex max-w-[560px] items-center gap-2">
          {mobileNavItems.map((item, index) => (
            <Link
              className={`flex flex-1 flex-col items-center gap-1.5 rounded-[14px] px-2 py-2 text-[10px] font-bold uppercase tracking-[0.12em] ${
                index === 0
                  ? 'bg-[linear-gradient(135deg,#4c42e8_0%,#5a49f4_100%)] text-white'
                  : 'text-[#7e89a3]'
              }`}
              key={item.label}
              to={item.to}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          ))}
          <a
            className="flex flex-1 flex-col items-center gap-1.5 rounded-[14px] px-2 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#7e89a3]"
            href="#mobile-features"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span>More</span>
          </a>
        </div>
      </nav>
    </div>
  );
}

function DesktopHome({ currentYear, isAuthenticated, heroAction, primaryAction, secondaryAction }) {
  return (
    <div className="home-shell hidden min-h-screen overflow-x-hidden font-ui lg:block" id="top">
      <header className="home-topbar fixed inset-x-0 top-0 z-40">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link className="font-display text-[20px] font-bold tracking-[-0.05em] text-[#0d1c2f]" to="/">
            Controllusion
          </Link>

          <nav className="flex items-center gap-8">
            {desktopNav.map((item) => (
              <a
                className="text-sm font-medium tracking-[-0.02em] text-[#464555] transition hover:text-[#0d1c2f]"
                href={item.href}
                key={item.label}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link className="text-sm font-medium text-[#464555] transition hover:text-[#0d1c2f]" to={secondaryAction.to}>
              {secondaryAction.label}
            </Link>
            <Link
              className="inline-flex items-center justify-center rounded-[12px] bg-[linear-gradient(161deg,#3525cd_0%,#4f46e5_100%)] px-5 py-2.5 text-sm font-medium text-white shadow-[0_10px_15px_-3px_rgba(53,37,205,0.2),0_4px_6px_-4px_rgba(53,37,205,0.2)] transition hover:translate-y-[-1px]"
              to={primaryAction.to}
            >
              {primaryAction.label}
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-16">
        <section className="mx-auto flex max-w-[1280px] flex-col items-center px-4 pb-24 pt-16 text-center sm:px-6 lg:px-8 lg:pb-32">
          <div className="home-enter flex flex-col items-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#eff4ff] px-4 py-1.5 text-sm font-medium text-[#3525cd]">
              <Sparkles className="h-4 w-4" />
              Introducing Controllusion AI 2.0
            </div>

            <h1 className="font-display mt-8 max-w-[896px] text-[72px] font-extrabold leading-[0.95] tracking-[-0.05em] text-[#0d1c2f]">
              Revolutionize your
              <br />
              customer relationships
            </h1>

            <p className="mt-6 max-w-[672px] text-[20px] leading-[28px] text-[#464555]">
              The high-end CRM designed for precision and fluidity. Automate workflows, gain advanced analytics, and
              empower your team to close deals faster.
            </p>

            <div className="mt-10 flex gap-4">
              <Link className="home-primary-btn" to={heroAction.to}>
                {isAuthenticated ? 'Open Dashboard' : 'Get Started Free'}
                <ArrowRight className="h-4 w-4" />
              </Link>

              {isAuthenticated ? (
                <Link className="home-secondary-btn" to="/customers">
                  <Users className="h-4 w-4" />
                  Open Pipeline
                </Link>
              ) : (
                <a className="home-secondary-btn" href="#solutions">
                  <Play className="h-4 w-4" />
                  Watch Demo
                </a>
              )}
            </div>
          </div>

          <div
            className="home-enter home-enter-delay mt-16 w-full max-w-[1024px] rounded-[16px] border border-[rgba(199,196,216,0.2)] bg-white p-2 shadow-[0_24px_64px_-12px_rgba(13,28,47,0.12)] sm:p-[9px]"
            id="solutions"
          >
            <div className="relative overflow-hidden rounded-[12px]">
              <img
                alt="Controllusion dashboard preview"
                className="w-full rounded-[12px] object-cover"
                src="/figma-dashboard-preview.png"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(248,249,255,0.4)]" />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] scroll-mt-24 px-4 pb-24 sm:px-6 lg:px-8" id="features">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-[36px] font-bold tracking-[-0.04em] text-[#0d1c2f]">
              Precision tools for modern teams
            </h2>
            <p className="mt-4 text-[18px] leading-7 text-[#464555]">
              Everything you need, nothing you don&apos;t. Designed for clarity.
            </p>
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-3 lg:grid-rows-[328px_242px]">
            {desktopFeatures.map((feature) => {
              const isAnalytics = feature.title === 'Advanced Analytics';
              const isSecurity = feature.title === 'Enterprise Security';
              const isTeam = feature.title === 'Team Collaboration';

              return (
                <article className={feature.className} key={feature.title}>
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-[12px] ${
                      isSecurity ? 'bg-[rgba(255,255,255,0.2)] text-white' : 'bg-[#e6eeff] text-[#3525cd]'
                    }`}
                  >
                    <feature.icon className="h-5 w-5" />
                  </div>

                  {isAnalytics ? (
                    <div className="mt-6 flex h-full items-center justify-between gap-6">
                      <div className="max-w-[310px]">
                        <h3 className="font-display text-[20px] font-bold text-[#0d1c2f]">{feature.title}</h3>
                        <p className="mt-3 text-[16px] leading-[26px] text-[#464555]">{feature.description}</p>
                        <a
                          className="mt-6 inline-flex items-center gap-2 text-[16px] font-medium text-[#3525cd] transition hover:text-[#2314b1]"
                          href="#footer"
                        >
                          Explore Analytics
                          <ArrowRight className="h-4 w-4" />
                        </a>
                      </div>
                      <AnalyticsChart />
                    </div>
                  ) : (
                    <>
                      <h3
                        className={`font-display mt-6 font-bold ${
                          isSecurity ? 'text-white' : 'text-[#0d1c2f]'
                        } ${isTeam ? 'text-[24px]' : 'text-[20px]'}`}
                      >
                        {feature.title}
                      </h3>
                      <p
                        className={`mt-3 ${
                          isSecurity ? 'text-[rgba(255,255,255,0.82)]' : 'text-[#464555]'
                        } ${isTeam ? 'max-w-[576px] text-[18px] leading-[29px]' : 'text-[16px] leading-[26px]'}`}
                      >
                        {feature.description}
                      </p>
                    </>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <footer className="border-t border-[rgba(199,196,216,0.1)] bg-white" id="footer">
          <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[2fr_repeat(3,minmax(0,1fr))]">
              <div>
                <p className="font-display text-[20px] font-bold tracking-[-0.05em] text-[#0d1c2f]">Controllusion</p>
                <p className="mt-4 max-w-[320px] text-sm leading-6 text-[#464555]">
                  The architectural minimalist CRM for modern enterprise teams.
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <a aria-label="Contact Controllusion" className="home-social-link" href="#top">
                    <Mail className="h-4 w-4" />
                  </a>
                  <a aria-label="Read the Controllusion handbook" className="home-social-link" href="#features">
                    <BookOpen className="h-4 w-4" />
                  </a>
                </div>
              </div>

              {footerGroups.map((group) => (
                <div key={group.title}>
                  <p className="text-sm font-bold tracking-[0.05em] text-[#0d1c2f]">{group.title}</p>
                  <div className="mt-4 space-y-3">
                    {group.links.map((item) => (
                      <a
                        className="block text-sm text-[#464555] transition hover:text-[#0d1c2f]"
                        href={item === 'Features' ? '#features' : '#footer'}
                        key={item}
                      >
                        {item}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 flex items-center justify-between border-t border-[rgba(199,196,216,0.1)] pt-8 text-sm text-[#464555]">
              <p>{`Copyright ${currentYear} Controllusion Inc. All rights reserved.`}</p>
              <div className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
                All systems operational
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

function HomePage() {
  const navigate = useNavigate();
  const { showToast } = useContext(UIContext);
  const { isAuthenticated } = useAuth();
  const currentYear = new Date().getFullYear();
  const primaryAction = isAuthenticated
    ? { label: 'Open Dashboard', to: '/dashboard' }
    : { label: 'Get Started', to: '/register' };
  const heroAction = isAuthenticated
    ? { label: 'Open Dashboard', to: '/dashboard' }
    : { label: 'Get Started Free', to: '/register' };
  const secondaryAction = isAuthenticated
    ? { label: 'Customers', to: '/customers' }
    : { label: 'Log In', to: '/login' };

  function openHub() {
    navigate(isAuthenticated ? '/dashboard' : '/login');
  }

  function showUpdates() {
    showToast({
      title: 'Product updates',
      description: 'Scrolling to the key feature highlights.',
      type: 'info',
    });
    window.setTimeout(() => {
      document.getElementById('mobile-features')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  }

  return (
    <>
      <MobileHome
        heroAction={heroAction}
        isAuthenticated={isAuthenticated}
        onOpenHub={openHub}
        onShowUpdates={showUpdates}
        secondaryAction={secondaryAction}
      />
      <DesktopHome
        currentYear={currentYear}
        heroAction={heroAction}
        isAuthenticated={isAuthenticated}
        primaryAction={primaryAction}
        secondaryAction={secondaryAction}
      />
    </>
  );
}

export default HomePage;
