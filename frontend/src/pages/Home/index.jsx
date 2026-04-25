import { BarChart3, CheckCircle2, Mail, Megaphone, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { APP_BRAND } from '../../utils/constants';

const featureCards = [
  {
    title: 'Visual Sales Pipeline',
    description: 'Drag and drop deals across stages. Instantly identify bottlenecks and prioritize high-value accounts with clear, color-coded status indicators.',
    icon: BarChart3,
    span: 'lg:col-span-2',
    visual: 'chart',
  },
  {
    title: 'Automated Outreach',
    description: 'Set up intelligent email sequences. Let Controllusion follow up while you focus on closing.',
    icon: Mail,
  },
  {
    title: 'Revenue Forecasting',
    description: 'Predict future revenue with AI-driven models based on historical deal velocity and current pipeline health.',
    icon: TrendingUp,
    tone: 'peach',
  },
  {
    title: 'Deep Analytics',
    description: 'Generate custom reports in seconds. Understand individual rep performance and team-wide trends without needing a data scientist.',
    icon: Megaphone,
    span: 'lg:col-span-2',
    visual: 'form',
  },
];

const footerGroups = [
  ['PRODUCT', 'Features', 'Pricing', 'Integrations', 'Changelog'],
  ['RESOURCES', 'Blog', 'Help Center', 'Community', 'API Docs'],
  ['COMPANY', 'About Us', 'Careers', 'Contact', 'Partners'],
];

function DashboardPreview() {
  return (
    <div className="relative h-[360px] w-[470px] overflow-hidden rounded-[14px] border-[8px] border-white bg-[#071018] shadow-[0_26px_60px_-32px_rgba(15,23,42,0.75)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_20%,rgba(76,66,232,0.18),transparent_34%),linear-gradient(180deg,#0d1a24_0%,#061017_100%)]" />
      <div className="relative p-6 text-[#7390a4]">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[#8bb5cc]">Dashboard</span>
          <span>Q3.4.210</span>
        </div>
        <div className="mt-8 h-1 w-full rounded-full bg-[#102432]" />
        <div className="mt-8 h-[120px] rounded-[6px] border border-[#163245] bg-[#0a1822]/80 p-4">
          <svg className="h-full w-full" viewBox="0 0 360 100">
            <path d="M0 78 C42 42 68 62 96 30 C132 -8 150 72 190 50 C232 28 250 10 290 24 C320 34 340 18 360 6" fill="none" stroke="#325a70" strokeWidth="2" />
            <path d="M0 84 C46 52 74 70 104 42 C138 14 160 84 204 58 C244 36 266 22 302 32 C330 40 346 28 360 20" fill="none" stroke="#29485d" strokeWidth="2" />
          </svg>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[1, 2, 3].map((item) => (
            <div className="h-48 rounded-[6px] border border-[#163245] bg-[#0a1822]/80" key={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FeatureVisual({ type }) {
  if (type === 'chart') {
    return (
      <div className="mt-7 h-[150px] overflow-hidden rounded-[8px] bg-[#424b52] p-5">
        <svg className="h-full w-full" viewBox="0 0 560 120">
          <path d="M0 58 C50 32 70 70 108 62 C150 54 160 20 200 38 C240 56 240 80 286 52 C332 24 360 36 402 34 C450 32 460 62 502 44 C536 30 548 28 560 22" fill="none" stroke="#a1c754" strokeWidth="4" />
          {[20, 56, 92].map((y) => (
            <line key={y} stroke="rgba(255,255,255,0.1)" x1="0" x2="560" y1={y} y2={y} />
          ))}
        </svg>
      </div>
    );
  }

  if (type === 'form') {
    return (
      <div className="absolute bottom-8 right-7 hidden h-[150px] w-[290px] items-center justify-center rounded-[8px] bg-[#4b7180] lg:flex">
        <div className="h-[136px] w-[180px] rounded-[6px] bg-white p-4 shadow-xl">
          <div className="mb-4 h-3 w-24 rounded-full bg-[#edf2fb]" />
          <div className="space-y-3">
            <div className="h-6 rounded bg-[#f3f6fb]" />
            <div className="h-6 rounded bg-[#f3f6fb]" />
            <div className="h-6 rounded bg-[#f3f6fb]" />
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function HomePage() {
  const { isAuthenticated } = useAuth();
  const primaryPath = isAuthenticated ? '/dashboard' : '/register';
  const secondaryPath = isAuthenticated ? '/customers' : '/login';

  return (
    <div className="min-h-screen bg-[#f4f7ff] font-ui text-[#14213d]">
      <header className="sticky top-0 z-30 border-t-4 border-[#1685df] bg-[#f7f9ff]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1160px] items-center justify-between px-6">
          <Link className="text-[18px] font-black tracking-[-0.04em]" to="/">
            {APP_BRAND.name}
          </Link>
          <nav className="hidden items-center gap-8 text-[13px] font-semibold text-[#39465f] md:flex">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#resources">Resources</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link className="text-[13px] font-semibold text-[#3b2fd3]" to={secondaryPath}>
              {isAuthenticated ? 'Accounts' : 'Log In'}
            </Link>
            <Link className="rounded-[12px] bg-[#4c42e8] px-4 py-2 text-[13px] font-bold text-white shadow-[0_12px_24px_-16px_rgba(76,66,232,0.9)]" to={primaryPath}>
              {isAuthenticated ? 'Dashboard' : 'Get Started'}
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-[1160px] items-center gap-14 px-6 pb-24 pt-20 lg:grid-cols-[1fr_470px]">
          <div>
            <h1 className="max-w-[470px] text-[48px] font-black leading-[1.08] tracking-[-0.06em] sm:text-[56px]">
              Close more deals.
              <span className="block text-[#4338dc]">Grow faster.</span>
            </h1>
            <p className="mt-8 max-w-[510px] text-[17px] leading-8 text-[#4d5a73]">
              The enterprise CRM designed for precision and fluidity. Automate outreach, forecast revenue, and visualize your pipeline without the visual clutter.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link className="rounded-[9px] bg-[#4c42e8] px-7 py-4 text-sm font-bold text-white shadow-[0_14px_24px_-16px_rgba(76,66,232,0.85)]" to={primaryPath}>
                Start Free Trial
              </Link>
              <Link className="rounded-[9px] bg-[#dfe9ff] px-7 py-4 text-sm font-bold text-[#3429d4]" to={secondaryPath}>
                Request Demo
              </Link>
            </div>
            <div className="mt-12 flex flex-wrap gap-6 text-[13px] font-medium text-[#56637c]">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#4c42e8]" />
                No credit card required
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#4c42e8]" />
                14-day free trial
              </span>
            </div>
          </div>
          <div className="hidden justify-end lg:flex">
            <DashboardPreview />
          </div>
        </section>

        <section className="bg-[#eaf1fb] px-6 py-16" id="features">
          <div className="mx-auto max-w-[1060px]">
            <div className="text-center">
              <h2 className="text-[34px] font-black tracking-[-0.05em]">Everything you need to scale</h2>
              <p className="mt-4 text-[16px] text-[#56637c]">Powerful tools built into a seamless, high-performance workspace.</p>
            </div>

            <div className="mt-16 grid gap-7 lg:grid-cols-3">
              {featureCards.map((feature) => (
                <article className={`relative min-h-[260px] overflow-hidden rounded-[14px] bg-white p-8 shadow-[0_18px_50px_-44px_rgba(31,42,68,0.28)] ${feature.span || ''}`} key={feature.title}>
                  <div className={`flex h-11 w-11 items-center justify-center rounded-[9px] ${feature.tone === 'peach' ? 'bg-[#ffe5d9] text-[#9b3f16]' : 'bg-[#ded9ff] text-[#3226c8]'}`}>
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-7 text-[22px] font-black tracking-[-0.04em]">{feature.title}</h3>
                  <p className="mt-4 max-w-[410px] text-[15px] leading-7 text-[#4d5a73]">{feature.description}</p>
                  <FeatureVisual type={feature.visual} />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20 text-center" id="pricing">
          <h2 className="text-[42px] font-black tracking-[-0.06em]">Ready to take control?</h2>
          <p className="mx-auto mt-5 max-w-[660px] text-[17px] leading-8 text-[#56637c]">
            Join thousands of high-performing teams who rely on Controllusion to manage their sales pipeline.
          </p>
          <Link className="mt-10 inline-flex rounded-[10px] bg-[#4c42e8] px-9 py-4 text-[16px] font-bold text-white shadow-[0_18px_35px_-18px_rgba(76,66,232,0.9)]" to={primaryPath}>
            Start Your Free Trial
          </Link>
        </section>
      </main>

      <footer className="bg-[#dfe9f9] px-6 py-14" id="resources">
        <div className="mx-auto max-w-[980px]">
          <div className="grid gap-10 md:grid-cols-4">
            <div>
              <p className="text-[18px] font-black tracking-[-0.04em]">{APP_BRAND.name}</p>
              <p className="mt-6 text-[14px] leading-6 text-[#56637c]">The editorial, high-end CRM experience for B2B teams.</p>
            </div>
            {footerGroups.map(([title, ...links]) => (
              <div key={title}>
                <p className="text-[13px] font-black tracking-[0.06em]">{title}</p>
                <div className="mt-5 space-y-3">
                  {links.map((link) => (
                    <a className="block text-[14px] font-medium text-[#56637c]" href="#features" key={link}>
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-14 flex flex-col gap-4 border-t border-[#cfdaee] pt-7 text-[12px] text-[#56637c] md:flex-row md:items-center md:justify-between">
            <p>© 2024 Controllusion Inc. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#resources">Privacy Policy</a>
              <a href="#resources">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
