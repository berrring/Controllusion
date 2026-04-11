import { useContext, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BellDot,
  CalendarClock,
  Camera,
  Check,
  CircleDollarSign,
  Clock3,
  CreditCard,
  FolderKanban,
  Gamepad2,
  Headphones,
  Laptop,
  LayoutGrid,
  LifeBuoy,
  MapPin,
  MoreHorizontal,
  Package,
  PlayCircle,
  Search,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  UserPlus,
  Users,
  Watch,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import Avatar from '../../components/common/Avatar';
import { UIContext } from '../../context/UIContext';
import { useAuth } from '../../hooks/useAuth';
import { cx, formatCurrency, formatNumber } from '../../utils/formatters';
import { validatePasswordChange, validateProfile } from '../../utils/validation';
import { WORKSPACE_BY_KEY } from '../../utils/workspace';

const dashboardMetrics = [
  { label: 'Total User', value: formatNumber(40689), icon: Users, iconClassName: 'bg-[#f0ebff] text-[#8f7cff]', trend: '8.5% Up from yesterday', trendDirection: 'up' },
  { label: 'Total Order', value: formatNumber(10293), icon: Package, iconClassName: 'bg-[#fff5dc] text-[#ffbf32]', trend: '1.3% Up from past week', trendDirection: 'up' },
  { label: 'Total Sales', value: formatCurrency(89000), icon: Activity, iconClassName: 'bg-[#ddf8eb] text-[#44cf95]', trend: '4.3% Down from yesterday', trendDirection: 'down' },
  { label: 'Total Pending', value: formatNumber(2040), icon: Clock3, iconClassName: 'bg-[#ffe8e0] text-[#ff9067]', trend: '1.8% Up from yesterday', trendDirection: 'up' },
];

const salesChartData = [
  { label: '5k', value: 22 }, { label: '8k', value: 28 }, { label: '10k', value: 29 }, { label: '12k', value: 49 }, { label: '15k', value: 39 },
  { label: '17k', value: 52 }, { label: '20k', value: 44 }, { label: '21k', value: 86.5 }, { label: '23k', value: 35 }, { label: '25k', value: 53 },
  { label: '28k', value: 42 }, { label: '30k', value: 55 }, { label: '33k', value: 44 }, { label: '35k', value: 61 }, { label: '36k', value: 24 },
  { label: '38k', value: 32 }, { label: '40k', value: 27 }, { label: '42k', value: 48 }, { label: '44k', value: 44 }, { label: '45k', value: 44 },
  { label: '47k', value: 73 }, { label: '49k', value: 59 }, { label: '51k', value: 65 }, { label: '53k', value: 56 }, { label: '55k', value: 56 },
  { label: '57k', value: 42 }, { label: '59k', value: 57 }, { label: '61k', value: 52 }, { label: '63k', value: 58 },
];

const dealRows = [
  { id: 'ord_1', product: 'Apple Watch', location: '6096 Marjolaine Landing', dateTime: '12.09.2026 - 12:53 PM', piece: 423, amount: 34295, status: 'Delivered', icon: Watch, iconClassName: 'bg-[#fff0ea] text-[#f18d74]' },
  { id: 'ord_2', product: 'Macbook Pro 16', location: '3457 Mission Avenue', dateTime: '13.09.2026 - 09:12 AM', piece: 212, amount: 19840, status: 'Processing', icon: Laptop, iconClassName: 'bg-[#ecf3ff] text-[#4f80ff]' },
  { id: 'ord_3', product: 'iPhone 15 Pro', location: '82 Grand River Street', dateTime: '13.09.2026 - 03:42 PM', piece: 165, amount: 26780, status: 'Delivered', icon: Smartphone, iconClassName: 'bg-[#f2f8ea] text-[#71c46c]' },
  { id: 'ord_4', product: 'Airpods Max', location: '2241 Harbor Boulevard', dateTime: '14.09.2026 - 10:18 AM', piece: 84, amount: 12760, status: 'Pending', icon: Headphones, iconClassName: 'bg-[#fff4df] text-[#ecb13f]' },
];

const productCards = [
  { id: 'prod_watch', name: 'Apple Watch Series 9', category: 'Wearable', price: 799, stock: 142, accent: 'from-[#f8fbff] to-[#eef2ff]', icon: Watch, iconClassName: 'bg-[#111827] text-white' },
  { id: 'prod_headphones', name: 'Airpods Max Moon', category: 'Audio', price: 549, stock: 86, accent: 'from-[#fffaf2] to-[#f7f0e7]', icon: Headphones, iconClassName: 'bg-[#d7c2a4] text-white' },
  { id: 'prod_camera', name: 'Sony Alpha Vision', category: 'Camera', price: 1249, stock: 54, accent: 'from-[#eff6ff] to-[#ebf5f1]', icon: Camera, iconClassName: 'bg-[#4f80ff] text-white' },
  { id: 'prod_console', name: 'Playbox Flow', category: 'Gaming', price: 679, stock: 23, accent: 'from-[#f8f1ff] to-[#eef2ff]', icon: Gamepad2, iconClassName: 'bg-[#8055ff] text-white' },
];

const inboxThreads = [
  { id: 'msg_1', name: 'Emma Watson', role: 'Product Manager', subject: 'Please review the October order layout', time: '10:42 AM', unread: true },
  { id: 'msg_2', name: 'William Carter', role: 'Warehouse Lead', subject: 'Inventory sync is ready for QA', time: '09:28 AM', unread: true },
  { id: 'msg_3', name: 'Sophia Brooks', role: 'Support Agent', subject: 'Customer notes updated with shipping changes', time: 'Yesterday', unread: false },
  { id: 'msg_4', name: 'Noah Lee', role: 'Finance Team', subject: 'Invoice 3208 approved and ready to send', time: 'Yesterday', unread: false },
];

const orderPipeline = [
  { label: 'New Orders', value: '128', change: '+16 today', tone: 'brand' },
  { label: 'On Delivery', value: '42', change: '+5 today', tone: 'success' },
  { label: 'Returned', value: '07', change: '-2 today', tone: 'warning' },
];

const stockRows = [
  { name: 'Wearables', amount: 358, progress: 78, status: 'Healthy' },
  { name: 'Audio', amount: 164, progress: 46, status: 'Restock' },
  { name: 'Cameras', amount: 92, progress: 33, status: 'Critical' },
  { name: 'Gaming', amount: 214, progress: 61, status: 'Healthy' },
];

const pricingPlans = [
  { name: 'Starter', price: '$19', description: 'For small dashboards and lightweight order tracking.', button: 'Choose Starter', features: ['3 team members', 'Unlimited products', 'Basic analytics', 'Email support'] },
  { name: 'Business', price: '$49', description: 'Most aligned with the full Controllusion workspace.', button: 'Current Plan', featured: true, features: ['15 team members', 'Advanced analytics', 'Order automation', 'Priority support'] },
  { name: 'Enterprise', price: '$99', description: 'For larger operations that need custom workflows.', button: 'Contact Sales', features: ['Unlimited seats', 'Dedicated onboarding', 'Custom exports', 'Security reviews'] },
];

const todoColumns = [
  { title: 'To Do', items: ['Review Apple Watch restock request', 'Send revised invoice to Nova Inc', 'Confirm warehouse transfer for audio line'] },
  { title: 'In Progress', items: ['Finalize sales chart annotations', 'Prepare autumn campaign pricing', 'Audit saved favorites with team leads'] },
  { title: 'Done', items: ['Update top navigation language switcher', 'Approve payout batch for weekend sales', 'Publish new support macros'] },
];

const contactCards = [
  { name: 'Moni Roy', title: 'Admin', email: 'moni@controllusion.com', phone: '+1 (302) 555-0149' },
  { name: 'Sara Miles', title: 'Support Lead', email: 'sara@controllusion.com', phone: '+1 (302) 555-0177' },
  { name: 'Liam Brooks', title: 'Warehouse Ops', email: 'liam@controllusion.com', phone: '+1 (302) 555-0122' },
  { name: 'Ava Green', title: 'Finance Analyst', email: 'ava@controllusion.com', phone: '+1 (302) 555-0159' },
];

const invoiceRows = [
  { name: 'Apple Watch Series 9', qty: 8, rate: 799 },
  { name: 'Airpods Max Moon', qty: 6, rate: 549 },
  { name: 'Priority delivery', qty: 1, rate: 180 },
];

const teamMembers = [
  { name: 'Moni Roy', role: 'Admin', team: 'Management', status: 'Online' },
  { name: 'Sara Miles', role: 'Support Lead', team: 'Support', status: 'Online' },
  { name: 'Liam Brooks', role: 'Warehouse Ops', team: 'Operations', status: 'Away' },
  { name: 'Ava Green', role: 'Finance Analyst', team: 'Finance', status: 'Online' },
  { name: 'William Carter', role: 'Product Manager', team: 'Product', status: 'Busy' },
  { name: 'Sophia Brooks', role: 'Growth Marketer', team: 'Growth', status: 'Away' },
];

const tableRows = [
  { id: '#29321', product: 'Apple Watch', customer: 'Nova Inc', amount: 34295, method: 'Card', status: 'Paid' },
  { id: '#29322', product: 'Airpods Max', customer: 'Acme Co', amount: 12760, method: 'Wire', status: 'Pending' },
  { id: '#29323', product: 'Sony Alpha', customer: 'Orbit Labs', amount: 21880, method: 'Card', status: 'Paid' },
  { id: '#29324', product: 'Playbox Flow', customer: 'Iota Studio', amount: 8790, method: 'Cash', status: 'Refunded' },
  { id: '#29325', product: 'Macbook Pro 16', customer: 'Nexa Group', amount: 19840, method: 'Wire', status: 'Paid' },
];

const calendarWeeks = [
  [{ day: 29, muted: true }, { day: 30, muted: true }, { day: 1 }, { day: 2 }, { day: 3 }, { day: 4 }, { day: 5 }],
  [{ day: 6 }, { day: 7 }, { day: 8, active: true }, { day: 9 }, { day: 10 }, { day: 11 }, { day: 12 }],
  [{ day: 13 }, { day: 14 }, { day: 15 }, { day: 16, highlight: true }, { day: 17 }, { day: 18 }, { day: 19 }],
  [{ day: 20 }, { day: 21 }, { day: 22 }, { day: 23 }, { day: 24 }, { day: 25 }, { day: 26 }],
  [{ day: 27 }, { day: 28 }, { day: 29 }, { day: 30 }, { day: 31 }, { day: 1, muted: true }, { day: 2, muted: true }],
];

const calendarSchedule = [
  { title: 'Warehouse sync', time: '09:00 AM', detail: 'Inventory review for accessories' },
  { title: 'Design review', time: '11:30 AM', detail: 'UI elements and inbox states' },
  { title: 'Finance call', time: '02:00 PM', detail: 'Invoice and payout overview' },
];

const uiColors = [
  { label: 'Brand', hex: '#4F80FF', className: 'bg-[#4f80ff]' },
  { label: 'Teal', hex: '#16C098', className: 'bg-[#16c098]' },
  { label: 'Orange', hex: '#FFB648', className: 'bg-[#ffb648]' },
  { label: 'Purple', hex: '#8055FF', className: 'bg-[#8055ff]' },
  { label: 'Danger', hex: '#FF6B6B', className: 'bg-[#ff6b6b]' },
];

function statusClassName(status) {
  if (['Delivered', 'Paid', 'Healthy', 'Online'].includes(status)) return 'bg-[#16c098]';
  if (['Processing', 'Pending', 'Away'].includes(status)) return 'bg-[#4f80ff]';
  if (['Refunded', 'Critical', 'Busy'].includes(status)) return 'bg-[#ff6b6b]';
  if (status === 'Restock') return 'bg-[#ffb648]';
  return 'bg-[#a3acbf]';
}

function ShellCard({ children, className = '', padded = true }) {
  return <section className={cx('overflow-hidden rounded-[28px] border border-[color:var(--border)] bg-white shadow-[0_24px_55px_-42px_rgba(17,24,39,0.26)]', padded && 'p-6', className)}>{children}</section>;
}

function PageHeader({ title, description, actions }) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-[34px] font-black tracking-[-0.03em] text-[#20253a] sm:text-[40px]">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm font-semibold leading-7 text-[#8b93a8]">{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );
}

function GhostPill({ children, active = false }) {
  return <button className={cx('inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-extrabold transition', active ? 'border-[#4f80ff] bg-[#4f80ff] text-white' : 'border-[color:var(--border)] bg-white text-[#77819b] hover:border-[#cfd7e9] hover:text-[#20253a]')} type="button">{children}</button>;
}

function DropdownChip({ label }) {
  return <button className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-[color:var(--border)] bg-white px-3 text-xs font-bold text-[#9aa4bb]" type="button"><span>{label}</span><span className="text-[10px]">v</span></button>;
}

function StatusBadge({ children }) {
  return <span className={cx('inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold text-white', statusClassName(children))}>{children}</span>;
}

function Trend({ direction = 'up', text }) {
  const Icon = direction === 'down' ? ArrowDownRight : ArrowUpRight;
  return <span className={cx('inline-flex items-center gap-1 text-[13px] font-bold', direction === 'down' ? 'text-[#ff6b6b]' : 'text-[#16c098]')}><Icon className="h-4 w-4" />{text}</span>;
}

function MetricCard({ item }) {
  const Icon = item.icon;
  return (
    <ShellCard className="rounded-[24px] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-extrabold text-[#9aa4bb]">{item.label}</p>
          <p className="mt-3 text-[33px] font-black tracking-[-0.03em] text-[#20253a]">{item.value}</p>
        </div>
        <div className={cx('flex h-14 w-14 items-center justify-center rounded-[18px]', item.iconClassName)}>
          <Icon className="h-7 w-7" />
        </div>
      </div>
      <div className="mt-4"><Trend direction={item.trendDirection} text={item.trend} /></div>
    </ShellCard>
  );
}

function ProductCard({ product, favorite = false }) {
  const Icon = product.icon;
  return (
    <ShellCard className={cx('rounded-[24px] bg-gradient-to-b p-5', product.accent)}>
      <div className="flex items-center justify-between">
        <div className={cx('flex h-14 w-14 items-center justify-center rounded-[18px]', product.iconClassName)}>
          <Icon className="h-7 w-7" />
        </div>
        <button className="text-[#c6ccdb] transition hover:text-[#ff6b6b]" type="button">
          <Star className={cx('h-5 w-5', favorite && 'fill-current text-[#ff6b6b]')} />
        </button>
      </div>
      <div className="mt-10">
        <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#9aa4bb]">{product.category}</p>
        <h3 className="mt-2 text-xl font-black tracking-[-0.03em] text-[#20253a]">{product.name}</h3>
      </div>
      <div className="mt-5 flex items-center justify-between text-sm font-bold text-[#6f7b96]">
        <span>{formatCurrency(product.price)}</span>
        <span>{product.stock} in stock</span>
      </div>
    </ShellCard>
  );
}

function SmallStat({ label, value, detail, icon: Icon, tone = 'brand' }) {
  const toneClassName = { brand: 'bg-[#edf4ff] text-[#4f80ff]', success: 'bg-[#eaf9f3] text-[#16c098]', warning: 'bg-[#fff5e5] text-[#ffb648]', purple: 'bg-[#f4eeff] text-[#8055ff]' }[tone];
  return (
    <div className="rounded-[24px] border border-[color:var(--border)] bg-white p-5 shadow-[0_18px_45px_-38px_rgba(17,24,39,0.24)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-extrabold text-[#9aa4bb]">{label}</p>
          <p className="mt-3 text-[28px] font-black tracking-[-0.03em] text-[#20253a]">{value}</p>
        </div>
        <div className={cx('flex h-12 w-12 items-center justify-center rounded-[16px]', toneClassName)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {detail ? <p className="mt-4 text-sm font-semibold text-[#7d88a3]">{detail}</p> : null}
    </div>
  );
}

function ProgressBar({ value, color = '#4f80ff' }) {
  return <div className="h-2.5 w-full rounded-full bg-[#eff2f8]"><div className="h-full rounded-full" style={{ backgroundColor: color, width: `${value}%` }} /></div>;
}

function SettingsField({ label, error, children }) {
  return <label className="block"><span className="mb-2 block text-sm font-extrabold text-[#5f6a85]">{label}</span>{children}{error ? <span className="mt-2 block text-sm font-semibold text-[#ff6b6b]">{error}</span> : null}</label>;
}

function FieldInput(props) {
  return <input className="h-12 w-full rounded-[16px] border border-[color:var(--border)] bg-[#fbfcff] px-4 text-sm font-semibold text-[#20253a] outline-none transition placeholder:text-[#b5bdcd] focus:border-[#4f80ff]" {...props} />;
}

function DashboardSection() {
  return (
    <div className="space-y-7">
      <PageHeader title="Dashboard" description="A faithful bright admin shell inspired by the public Controllusion dashboard frame." />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">{dashboardMetrics.map((item) => <MetricCard item={item} key={item.label} />)}</div>
      <ShellCard className="p-0">
        <div className="flex items-center justify-between border-b border-[color:var(--border)] px-6 py-5">
          <h2 className="text-[18px] font-black text-[#20253a] sm:text-[20px]">Sales Details</h2>
          <DropdownChip label="October" />
        </div>
        <div className="h-[390px] px-4 py-6 sm:px-6">
          <ResponsiveContainer height="100%" width="100%">
            <AreaChart data={salesChartData} margin={{ top: 18, right: 10, left: -8, bottom: 0 }}>
              <defs><linearGradient id="salesGradientDashboardV2" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#4F80FF" stopOpacity={0.2} /><stop offset="100%" stopColor="#4F80FF" stopOpacity={0.02} /></linearGradient></defs>
              <CartesianGrid stroke="#edf1f8" vertical={false} />
              <XAxis axisLine={false} dataKey="label" interval={2} tick={{ fill: '#b8c0d1', fontSize: 11 }} tickLine={false} />
              <YAxis axisLine={false} domain={[20, 100]} tick={{ fill: '#b8c0d1', fontSize: 11 }} tickFormatter={(value) => `${value}%`} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 18, border: '1px solid #eceff6', boxShadow: '0 24px 45px -34px rgba(17,24,39,0.18)' }} formatter={(value) => [`${value}%`, 'Sales']} labelFormatter={(value) => `Revenue ${value}`} />
              <Area activeDot={{ fill: '#4F80FF', r: 5, stroke: '#fff', strokeWidth: 2 }} dataKey="value" dot={{ fill: '#4F80FF', r: 3, strokeWidth: 0 }} fill="url(#salesGradientDashboardV2)" isAnimationActive={false} stroke="#4F80FF" strokeWidth={2} type="monotone" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ShellCard>
      <ShellCard className="p-0">
        <div className="flex items-center justify-between border-b border-[color:var(--border)] px-6 py-5">
          <h2 className="text-[18px] font-black text-[#20253a] sm:text-[20px]">Deals Details</h2>
          <DropdownChip label="October" />
        </div>
        <div className="overflow-x-auto px-4 py-5 sm:px-6">
          <table className="min-w-full">
            <thead><tr className="bg-[#f5f7fb] text-left">{['Product Name', 'Location', 'Date - Time', 'Piece', 'Amount', 'Status'].map((label) => <th className="px-4 py-3 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#8d98b1]" key={label}>{label}</th>)}</tr></thead>
            <tbody>{dealRows.map((item) => <tr className="border-b border-[color:var(--border)] last:border-b-0" key={item.id}><td className="px-4 py-4"><div className="flex items-center gap-3"><div className={cx('flex h-10 w-10 items-center justify-center rounded-[14px]', item.iconClassName)}><item.icon className="h-5 w-5" /></div><span className="text-sm font-extrabold text-[#20253a]">{item.product}</span></div></td><td className="px-4 py-4 text-sm font-semibold text-[#7d88a3]">{item.location}</td><td className="px-4 py-4 text-sm font-semibold text-[#7d88a3]">{item.dateTime}</td><td className="px-4 py-4 text-sm font-bold text-[#20253a]">{item.piece}</td><td className="px-4 py-4 text-sm font-extrabold text-[#20253a]">{formatCurrency(item.amount)}</td><td className="px-4 py-4"><StatusBadge>{item.status}</StatusBadge></td></tr>)}</tbody>
          </table>
        </div>
      </ShellCard>
    </div>
  );
}

function ProductsSection() {
  return (
    <div className="space-y-7">
      <PageHeader title="Products" description="Products, cards, and stock summaries aligned to the same soft Figma admin visual language." actions={<><GhostPill active><LayoutGrid className="h-4 w-4" />Grid View</GhostPill><GhostPill>Latest First</GhostPill></>} />
      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">{productCards.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <ShellCard>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black tracking-[-0.03em] text-[#20253a]">Catalog Insight</h2>
              <p className="mt-1 text-sm font-semibold text-[#8b93a8]">What the merchandising team is focusing on this week.</p>
            </div>
            <GhostPill>Export</GhostPill>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <SmallStat detail="2.5% compared to last week" icon={TrendingUp} label="Revenue" tone="success" value="$124k" />
            <SmallStat detail="Most viewed in favorites" icon={Sparkles} label="Top Product" tone="purple" value="Watch" />
            <SmallStat detail="Needs replenishment soon" icon={ShoppingBag} label="Low Stock" tone="warning" value="Audio" />
          </div>
        </ShellCard>
        <ShellCard>
          <h2 className="text-xl font-black tracking-[-0.03em] text-[#20253a]">Top Collections</h2>
          <div className="mt-6 space-y-5">{[{ label: 'Wearables', value: 84, color: '#4f80ff' }, { label: 'Audio', value: 62, color: '#16c098' }, { label: 'Gaming', value: 48, color: '#8055ff' }].map((item) => <div key={item.label}><div className="mb-2 flex items-center justify-between text-sm font-bold text-[#6f7b96]"><span>{item.label}</span><span>{item.value}%</span></div><ProgressBar color={item.color} value={item.value} /></div>)}</div>
        </ShellCard>
      </div>
    </div>
  );
}

function FavoritesSection() {
  return (
    <div className="space-y-7">
      <PageHeader title="Favorites" description="Saved products, pinned cards, and hand-picked items presented like the UI kit composition." actions={<><GhostPill active>All Favorites</GhostPill><GhostPill>Archived</GhostPill></>} />
      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">{productCards.map((product) => <ProductCard favorite key={product.id} product={product} />)}</div>
      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <ShellCard>
          <h2 className="text-xl font-black tracking-[-0.03em] text-[#20253a]">Saved Collections</h2>
          <div className="mt-6 space-y-4">
            {[
              { title: 'Holiday launch set', items: '12 products', meta: 'Updated 1h ago' },
              { title: 'Admin kit references', items: '6 assets', meta: 'Updated yesterday' },
              { title: 'Best sellers', items: '24 products', meta: 'Synced with dashboard' },
            ].map((item) => (
              <div className="rounded-[22px] border border-[color:var(--border)] bg-[#fbfcff] p-4" key={item.title}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-base font-black text-[#20253a]">{item.title}</p>
                    <p className="mt-1 text-sm font-semibold text-[#8b93a8]">{item.items} · {item.meta}</p>
                  </div>
                  <button className="text-[#b4bdd0]" type="button"><MoreHorizontal className="h-5 w-5" /></button>
                </div>
              </div>
            ))}
          </div>
        </ShellCard>
        <ShellCard>
          <h2 className="text-xl font-black tracking-[-0.03em] text-[#20253a]">Wishlist Activity</h2>
          <div className="mt-6 space-y-4">
            {[
              'Emma added Apple Watch Series 9 to team favorites',
              'Finance pinned the October invoice template',
              'Support saved the inbox quick replies panel',
              'Warehouse bookmarked the product stock board',
            ].map((item) => (
              <div className="flex items-start gap-3 rounded-[22px] border border-[color:var(--border)] bg-white p-4" key={item}>
                <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#eef3ff] text-[#4f80ff]">
                  <Star className="h-5 w-5 fill-current" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-[#20253a]">{item}</p>
                  <p className="mt-1 text-sm font-semibold text-[#8b93a8]">Recently synchronized with the shared dashboard layout.</p>
                </div>
              </div>
            ))}
          </div>
        </ShellCard>
      </div>
    </div>
  );
}

function InboxSection() {
  const activeThread = inboxThreads[0];

  return (
    <div className="space-y-7">
      <PageHeader title="Inbox" description="An inbox screen using the same rounded surfaces, pale borders, and editorial spacing as the kit." actions={<><GhostPill active>Unread</GhostPill><GhostPill>Everything</GhostPill></>} />
      <div className="grid gap-5 xl:grid-cols-[0.84fr_1.16fr]">
        <ShellCard className="p-0">
          <div className="border-b border-[color:var(--border)] px-6 py-5">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#aab4c8]" />
              <input className="h-12 w-full rounded-[18px] border border-[color:var(--border)] bg-[#fbfcff] pl-11 pr-4 text-sm font-semibold text-[#20253a] outline-none placeholder:text-[#b5bdcd]" placeholder="Search conversations" type="text" />
            </div>
          </div>
          <div className="divide-y divide-[color:var(--border)]">
            {inboxThreads.map((thread, index) => (
              <button className={cx('flex w-full items-start gap-4 px-6 py-5 text-left transition hover:bg-[#fafcff]', index === 0 && 'bg-[#f7faff]')} key={thread.id} type="button">
                <Avatar name={thread.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-extrabold text-[#20253a]">{thread.name}</p>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#9aa4bb]">{thread.role}</p>
                    </div>
                    <span className="text-xs font-bold text-[#9aa4bb]">{thread.time}</span>
                  </div>
                  <p className="mt-3 truncate text-sm font-semibold text-[#6f7b96]">{thread.subject}</p>
                </div>
                {thread.unread ? <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#4f80ff]" /> : null}
              </button>
            ))}
          </div>
        </ShellCard>
        <ShellCard>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar name={activeThread.name} size="lg" />
              <div>
                <p className="text-xl font-black tracking-[-0.03em] text-[#20253a]">{activeThread.name}</p>
                <p className="text-sm font-semibold text-[#8b93a8]">{activeThread.role}</p>
              </div>
            </div>
            <GhostPill><BellDot className="h-4 w-4" />Notify</GhostPill>
          </div>
          <div className="mt-6 rounded-[24px] bg-[#f8fafe] p-5">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#9aa4bb]">Latest message</p>
            <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-[#20253a]">{activeThread.subject}</h2>
            <div className="mt-5 space-y-4 text-sm font-semibold leading-7 text-[#6f7b96]">
              <p>I pushed a cleaner version of the order layout so it sits more closely against the Figma reference: softer card edges, thinner dividers, and reduced contrast in the table headers.</p>
              <p>Please verify the October figures and the badge colors before we ship the next pass to QA. The Products and Favorites pages are already using the same visual tokens.</p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <SmallStat detail="Average response in 11 mins" icon={LifeBuoy} label="Response" tone="success" value="98%" />
            <SmallStat detail="Shared across 4 teams" icon={FolderKanban} label="Projects" tone="brand" value="12" />
          </div>
        </ShellCard>
      </div>
    </div>
  );
}

function OrderListsSection() {
  return (
    <div className="space-y-7">
      <PageHeader title="Order Lists" description="A fuller orders surface with the same crisp table treatments shown in the dashboard frame." />
      <div className="grid gap-5 md:grid-cols-3">
        {orderPipeline.map((item) => <SmallStat detail={item.change} icon={Package} key={item.label} label={item.label} tone={item.tone} value={item.value} />)}
      </div>
      <ShellCard className="p-0">
        <div className="flex flex-col gap-4 border-b border-[color:var(--border)] px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-black tracking-[-0.03em] text-[#20253a]">Recent Orders</h2>
            <p className="mt-1 text-sm font-semibold text-[#8b93a8]">Every order entry uses the same compact white table rhythm.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <GhostPill active>Delivered</GhostPill>
            <GhostPill>Processing</GhostPill>
            <GhostPill>Pending</GhostPill>
          </div>
        </div>
        <div className="overflow-x-auto px-6 py-5">
          <table className="min-w-full">
            <thead><tr className="bg-[#f5f7fb] text-left">{['Order ID', 'Product', 'Customer', 'Amount', 'Payment', 'Status'].map((label) => <th className="px-4 py-3 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#8d98b1]" key={label}>{label}</th>)}</tr></thead>
            <tbody>{tableRows.map((row) => <tr className="border-b border-[color:var(--border)] last:border-b-0" key={row.id}><td className="px-4 py-4 text-sm font-extrabold text-[#20253a]">{row.id}</td><td className="px-4 py-4 text-sm font-extrabold text-[#20253a]">{row.product}</td><td className="px-4 py-4 text-sm font-semibold text-[#6f7b96]">{row.customer}</td><td className="px-4 py-4 text-sm font-extrabold text-[#20253a]">{formatCurrency(row.amount)}</td><td className="px-4 py-4 text-sm font-semibold text-[#6f7b96]">{row.method}</td><td className="px-4 py-4"><StatusBadge>{row.status}</StatusBadge></td></tr>)}</tbody>
          </table>
        </div>
      </ShellCard>
    </div>
  );
}

function ProductStockSection() {
  return (
    <div className="space-y-7">
      <PageHeader title="Product Stock" description="Stock ratios, warehouse cues, and critical alerts built as clean admin dashboard widgets." />
      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <ShellCard>
          <h2 className="text-xl font-black tracking-[-0.03em] text-[#20253a]">Inventory Groups</h2>
          <div className="mt-6 space-y-5">
            {stockRows.map((row) => (
              <div key={row.name}>
                <div className="mb-2 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-base font-black text-[#20253a]">{row.name}</p>
                    <p className="text-sm font-semibold text-[#8b93a8]">{row.amount} units available</p>
                  </div>
                  <StatusBadge>{row.status}</StatusBadge>
                </div>
                <ProgressBar color={row.status === 'Healthy' ? '#16c098' : row.status === 'Restock' ? '#ffb648' : '#ff6b6b'} value={row.progress} />
              </div>
            ))}
          </div>
        </ShellCard>
        <ShellCard>
          <h2 className="text-xl font-black tracking-[-0.03em] text-[#20253a]">Restock Checklist</h2>
          <div className="mt-6 space-y-4">
            {[
              'Confirm audio shipment with west warehouse',
              'Update fallback quantities for camera accessories',
              'Tag gaming consoles for weekend promotion',
              'Archive obsolete serial number batches',
            ].map((task) => (
              <div className="flex items-center gap-3 rounded-[18px] border border-[color:var(--border)] bg-[#fbfcff] px-4 py-3.5" key={task}>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#4f80ff] text-white"><Check className="h-3.5 w-3.5" /></span>
                <span className="text-sm font-semibold text-[#5f6a85]">{task}</span>
              </div>
            ))}
          </div>
        </ShellCard>
      </div>
    </div>
  );
}

function PricingSection() {
  return (
    <div className="space-y-7">
      <PageHeader title="Pricing" description="Pricing cards, add-ons, and plan choices based on the same bright kit styling." />
      <div className="grid gap-5 xl:grid-cols-3">
        {pricingPlans.map((plan) => (
          <ShellCard className={cx('flex h-full flex-col', plan.featured && 'border-transparent bg-[linear-gradient(180deg,#4f80ff_0%,#3d69ea_100%)] text-white shadow-[0_28px_70px_-36px_rgba(79,128,255,0.55)]')} key={plan.name}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className={cx('text-sm font-extrabold uppercase tracking-[0.14em]', plan.featured ? 'text-white/75' : 'text-[#9aa4bb]')}>{plan.name}</p>
                <h2 className={cx('mt-4 text-[40px] font-black tracking-[-0.04em]', plan.featured ? 'text-white' : 'text-[#20253a]')}>{plan.price}</h2>
              </div>
              <div className={cx('rounded-full px-3 py-1 text-xs font-extrabold', plan.featured ? 'bg-white/18 text-white' : 'bg-[#eef3ff] text-[#4f80ff]')}>Monthly</div>
            </div>
            <p className={cx('mt-4 text-sm font-semibold leading-7', plan.featured ? 'text-white/80' : 'text-[#7d88a3]')}>{plan.description}</p>
            <div className="mt-6 space-y-3">
              {plan.features.map((feature) => (
                <div className="flex items-center gap-3" key={feature}>
                  <span className={cx('flex h-6 w-6 items-center justify-center rounded-full', plan.featured ? 'bg-white/16 text-white' : 'bg-[#eef3ff] text-[#4f80ff]')}>
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className={cx('text-sm font-semibold', plan.featured ? 'text-white' : 'text-[#5f6a85]')}>{feature}</span>
                </div>
              ))}
            </div>
            <button className={cx('mt-8 inline-flex h-12 items-center justify-center rounded-[16px] px-5 text-sm font-extrabold transition', plan.featured ? 'bg-white text-[#3d69ea] hover:bg-white/90' : 'bg-[#4f80ff] text-white hover:bg-[#3d69ea]')} type="button">
              {plan.button}
            </button>
          </ShellCard>
        ))}
      </div>
    </div>
  );
}

function CalenderSection() {
  return (
    <div className="space-y-7">
      <PageHeader title="Calender" description="A calendar board and day schedule that continue the exact rounded dashboard tone." />
      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <ShellCard>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black tracking-[-0.03em] text-[#20253a]">October 2026</h2>
              <p className="mt-1 text-sm font-semibold text-[#8b93a8]">Meetings, syncs, and billing moments.</p>
            </div>
            <GhostPill active>Month View</GhostPill>
          </div>
          <div className="mt-6 grid grid-cols-7 gap-3 text-center text-xs font-extrabold uppercase tracking-[0.14em] text-[#9aa4bb]">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <span key={day}>{day}</span>)}
          </div>
          <div className="mt-4 space-y-3">
            {calendarWeeks.map((week, index) => (
              <div className="grid grid-cols-7 gap-3" key={index}>
                {week.map((day) => (
                  <div className={cx('flex aspect-square items-start justify-end rounded-[18px] border p-3 text-sm font-extrabold', day.active ? 'border-[#4f80ff] bg-[#4f80ff] text-white' : day.highlight ? 'border-[#dfe7fb] bg-[#f6f8ff] text-[#20253a]' : 'border-[color:var(--border)] bg-white text-[#20253a]', day.muted && !day.active && 'text-[#c5cbda]')} key={day.day}>
                    {day.day}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </ShellCard>
        <ShellCard>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black tracking-[-0.03em] text-[#20253a]">Today Schedule</h2>
              <p className="mt-1 text-sm font-semibold text-[#8b93a8]">Tuesday, October 8</p>
            </div>
            <GhostPill><CalendarClock className="h-4 w-4" />Add Event</GhostPill>
          </div>
          <div className="mt-6 space-y-4">
            {calendarSchedule.map((item) => (
              <div className="rounded-[22px] border border-[color:var(--border)] bg-[#fbfcff] p-4" key={item.title}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-base font-black text-[#20253a]">{item.title}</p>
                    <p className="mt-1 text-sm font-semibold text-[#7d88a3]">{item.detail}</p>
                  </div>
                  <span className="rounded-full bg-[#eef3ff] px-3 py-1 text-xs font-extrabold text-[#4f80ff]">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </ShellCard>
      </div>
    </div>
  );
}

function TodoSection() {
  return (
    <div className="space-y-7">
      <PageHeader title="To-Do" description="A kanban-flavored to-do board that still looks like a natural page in the same kit." />
      <div className="grid gap-5 md:grid-cols-3">
        <SmallStat detail="Focus this morning" icon={Target} label="Priority" tone="brand" value="06" />
        <SmallStat detail="Currently moving" icon={PlayCircle} label="In Progress" tone="warning" value="08" />
        <SmallStat detail="Completed today" icon={ShieldCheck} label="Done" tone="success" value="14" />
      </div>
      <div className="grid gap-5 xl:grid-cols-3">
        {todoColumns.map((column, index) => (
          <ShellCard key={column.title}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black tracking-[-0.03em] text-[#20253a]">{column.title}</h2>
              <span className={cx('rounded-full px-3 py-1 text-xs font-extrabold', index === 0 ? 'bg-[#eef3ff] text-[#4f80ff]' : index === 1 ? 'bg-[#fff5e5] text-[#ffb648]' : 'bg-[#eaf9f3] text-[#16c098]')}>{column.items.length}</span>
            </div>
            <div className="mt-6 space-y-4">
              {column.items.map((item) => <div className="rounded-[22px] border border-[color:var(--border)] bg-[#fbfcff] p-4" key={item}><p className="text-sm font-extrabold leading-7 text-[#20253a]">{item}</p></div>)}
            </div>
          </ShellCard>
        ))}
      </div>
    </div>
  );
}

function ContactSection() {
  return (
    <div className="space-y-7">
      <PageHeader title="Contact" description="Team contacts and internal stakeholders with the same calm spacing and white-card rhythm." actions={<GhostPill active><UserPlus className="h-4 w-4" />Add Contact</GhostPill>} />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {contactCards.map((person) => (
          <ShellCard className="text-center" key={person.email}>
            <div className="flex justify-center"><Avatar name={person.name} size="xl" /></div>
            <h2 className="mt-4 text-xl font-black tracking-[-0.03em] text-[#20253a]">{person.name}</h2>
            <p className="mt-1 text-sm font-semibold text-[#8b93a8]">{person.title}</p>
            <div className="mt-5 space-y-2 text-sm font-semibold text-[#6f7b96]">
              <p>{person.email}</p>
              <p>{person.phone}</p>
            </div>
          </ShellCard>
        ))}
      </div>
    </div>
  );
}

function InvoiceSection() {
  const subtotal = invoiceRows.reduce((sum, item) => sum + item.qty * item.rate, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="space-y-7">
      <PageHeader title="Invoice" description="A billing surface styled like the rest of the kit: generous radius, quiet separators, bright canvas." actions={<><GhostPill active>Send Invoice</GhostPill><GhostPill>Download PDF</GhostPill></>} />
      <div className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
        <ShellCard>
          <div className="flex flex-col gap-5 border-b border-[color:var(--border)] pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#9aa4bb]">Invoice #3208</p>
              <h2 className="mt-3 text-[34px] font-black tracking-[-0.03em] text-[#20253a]">Controllusion</h2>
            </div>
            <div className="text-sm font-semibold text-[#6f7b96]">
              <p>Issued: October 08, 2026</p>
              <p className="mt-1">Due: October 15, 2026</p>
            </div>
          </div>
          <div className="mt-6 overflow-hidden rounded-[22px] border border-[color:var(--border)]">
            <table className="min-w-full">
              <thead><tr className="bg-[#f5f7fb] text-left">{['Item', 'Qty', 'Rate', 'Amount'].map((label) => <th className="px-4 py-3 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#8d98b1]" key={label}>{label}</th>)}</tr></thead>
              <tbody>{invoiceRows.map((row) => <tr className="border-b border-[color:var(--border)] last:border-b-0" key={row.name}><td className="px-4 py-4 text-sm font-extrabold text-[#20253a]">{row.name}</td><td className="px-4 py-4 text-sm font-semibold text-[#6f7b96]">{row.qty}</td><td className="px-4 py-4 text-sm font-semibold text-[#6f7b96]">{formatCurrency(row.rate)}</td><td className="px-4 py-4 text-sm font-extrabold text-[#20253a]">{formatCurrency(row.qty * row.rate)}</td></tr>)}</tbody>
            </table>
          </div>
        </ShellCard>
        <ShellCard>
          <h2 className="text-xl font-black tracking-[-0.03em] text-[#20253a]">Summary</h2>
          <div className="mt-6 space-y-4">
            {[{ label: 'Subtotal', value: subtotal }, { label: 'Tax 10%', value: tax }, { label: 'Grand Total', value: total, strong: true }].map((item) => (
              <div className="flex items-center justify-between text-sm" key={item.label}>
                <span className={cx('font-semibold', item.strong ? 'text-[#20253a]' : 'text-[#7d88a3]')}>{item.label}</span>
                <span className={cx('font-extrabold', item.strong ? 'text-[18px] text-[#20253a]' : 'text-[#20253a]')}>{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-[24px] bg-[#f7faff] p-5">
            <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#4f80ff]">Payment Method</p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-white text-[#4f80ff] shadow-[0_16px_40px_-34px_rgba(79,128,255,0.55)]">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <p className="text-base font-black text-[#20253a]">Visa ending in 2048</p>
                <p className="text-sm font-semibold text-[#8b93a8]">Autopay enabled</p>
              </div>
            </div>
          </div>
        </ShellCard>
      </div>
    </div>
  );
}

function UiElementsSection() {
  return (
    <div className="space-y-7">
      <PageHeader title="UI Elements" description="The public thumbnail exposes button, color, and control studies; this page turns them into a living kit." />
      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <ShellCard>
          <h2 className="text-xl font-black tracking-[-0.03em] text-[#20253a]">Buttons</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <GhostPill active>Primary</GhostPill>
            <GhostPill>Secondary</GhostPill>
            <GhostPill>Ghost</GhostPill>
            <GhostPill>Rounded</GhostPill>
          </div>
          <div className="mt-8">
            <h3 className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#9aa4bb]">Color Scale</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {uiColors.map((item) => (
                <div className="rounded-[20px] border border-[color:var(--border)] bg-white p-4" key={item.label}>
                  <div className={cx('h-12 rounded-[14px]', item.className)} />
                  <p className="mt-3 text-sm font-extrabold text-[#20253a]">{item.label}</p>
                  <p className="text-sm font-semibold text-[#8b93a8]">{item.hex}</p>
                </div>
              ))}
            </div>
          </div>
        </ShellCard>
        <ShellCard>
          <h2 className="text-xl font-black tracking-[-0.03em] text-[#20253a]">Inputs & Status</h2>
          <div className="mt-6 space-y-4">
            <FieldInput placeholder="Search" />
            <FieldInput placeholder="Product name" />
            <div className="flex flex-wrap gap-3">
              <StatusBadge>Delivered</StatusBadge>
              <StatusBadge>Processing</StatusBadge>
              <StatusBadge>Pending</StatusBadge>
            </div>
            <div className="rounded-[22px] border border-[color:var(--border)] bg-[#fbfcff] p-4">
              <div className="flex items-center justify-between text-sm font-bold text-[#6f7b96]">
                <span>Upload Progress</span>
                <span>76%</span>
              </div>
              <div className="mt-3">
                <ProgressBar value={76} />
              </div>
            </div>
          </div>
        </ShellCard>
      </div>
    </div>
  );
}

function TeamSection() {
  return (
    <div className="space-y-7">
      <PageHeader title="Team" description="People cards and department summaries using the same palette and layout rules as the dashboard kit." actions={<GhostPill active><UserPlus className="h-4 w-4" />Invite Member</GhostPill>} />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {teamMembers.map((member) => (
          <ShellCard key={member.name}>
            <div className="flex items-center gap-4">
              <Avatar name={member.name} size="md" />
              <div>
                <p className="text-lg font-black tracking-[-0.03em] text-[#20253a]">{member.name}</p>
                <p className="text-sm font-semibold text-[#8b93a8]">{member.role} · {member.team}</p>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between">
              <StatusBadge>{member.status}</StatusBadge>
              <button className="text-[#b5bdcd]" type="button"><MoreHorizontal className="h-5 w-5" /></button>
            </div>
          </ShellCard>
        ))}
      </div>
    </div>
  );
}

function TableSection() {
  return (
    <div className="space-y-7">
      <PageHeader title="Table" description="A dedicated wide table page for the transactions and orders that need denser presentation." />
      <ShellCard className="p-0">
        <div className="flex flex-col gap-4 border-b border-[color:var(--border)] px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#aab4c8]" />
            <input className="h-12 w-full rounded-[18px] border border-[color:var(--border)] bg-[#fbfcff] pl-11 pr-4 text-sm font-semibold text-[#20253a] outline-none placeholder:text-[#b5bdcd]" placeholder="Search table data" type="text" />
          </div>
          <div className="flex flex-wrap gap-3">
            <GhostPill active>Paid</GhostPill>
            <GhostPill>Pending</GhostPill>
            <GhostPill>Refunded</GhostPill>
          </div>
        </div>
        <div className="overflow-x-auto px-6 py-5">
          <table className="min-w-full">
            <thead><tr className="bg-[#f5f7fb] text-left">{['Transaction', 'Product', 'Customer', 'Amount', 'Method', 'Status'].map((label) => <th className="px-4 py-3 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#8d98b1]" key={label}>{label}</th>)}</tr></thead>
            <tbody>{tableRows.map((row) => <tr className="border-b border-[color:var(--border)] last:border-b-0" key={row.id}><td className="px-4 py-4 text-sm font-extrabold text-[#20253a]">{row.id}</td><td className="px-4 py-4 text-sm font-extrabold text-[#20253a]">{row.product}</td><td className="px-4 py-4 text-sm font-semibold text-[#6f7b96]">{row.customer}</td><td className="px-4 py-4 text-sm font-extrabold text-[#20253a]">{formatCurrency(row.amount)}</td><td className="px-4 py-4 text-sm font-semibold text-[#6f7b96]">{row.method}</td><td className="px-4 py-4"><StatusBadge>{row.status}</StatusBadge></td></tr>)}</tbody>
          </table>
        </div>
      </ShellCard>
    </div>
  );
}

function SettingsSection() {
  const { user, saveProfile, updatePassword } = useAuth();
  const { showToast } = useContext(UIContext);
  const [profileValues, setProfileValues] = useState({ fullName: user?.fullName || '', email: user?.email || '', phone: user?.phone || '', title: user?.title || '', themePreference: 'light' });
  const [profileErrors, setProfileErrors] = useState({});
  const [profileError, setProfileError] = useState('');
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [passwordValues, setPasswordValues] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordError, setPasswordError] = useState('');
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  useEffect(() => {
    setProfileValues({ fullName: user?.fullName || '', email: user?.email || '', phone: user?.phone || '', title: user?.title || '', themePreference: 'light' });
  }, [user]);

  function handleProfileChange(event) {
    const { name, value } = event.target;
    setProfileValues((current) => ({ ...current, [name]: value }));
    setProfileErrors((current) => ({ ...current, [name]: '' }));
  }

  function handlePasswordChange(event) {
    const { name, value } = event.target;
    setPasswordValues((current) => ({ ...current, [name]: value }));
    setPasswordErrors((current) => ({ ...current, [name]: '' }));
  }

  async function submitProfile(event) {
    event.preventDefault();
    const errors = validateProfile(profileValues);
    if (Object.keys(errors).length) {
      setProfileErrors(errors);
      return;
    }
    setProfileSubmitting(true);
    setProfileError('');
    try {
      await saveProfile(profileValues);
      showToast({ title: 'Settings updated', description: 'The workspace profile was saved.' });
    } catch (error) {
      setProfileError(error.response?.data?.message || 'Unable to save your settings.');
    } finally {
      setProfileSubmitting(false);
    }
  }

  async function submitPassword(event) {
    event.preventDefault();
    const errors = validatePasswordChange(passwordValues);
    if (Object.keys(errors).length) {
      setPasswordErrors(errors);
      return;
    }
    setPasswordSubmitting(true);
    setPasswordError('');
    try {
      await updatePassword(passwordValues);
      showToast({ title: 'Password changed', description: 'Your credentials were updated successfully.' });
      setPasswordValues({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (error) {
      setPasswordError(error.response?.data?.message || 'Unable to update your password.');
    } finally {
      setPasswordSubmitting(false);
    }
  }

  return (
    <div className="space-y-7">
      <PageHeader title="Settings" description="Settings becomes the single account-management page inside the restyled admin shell." />
      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <ShellCard>
          <div className="flex items-center gap-4">
            <Avatar name={user?.fullName} size="xl" />
            <div>
              <h2 className="text-2xl font-black tracking-[-0.03em] text-[#20253a]">{user?.fullName}</h2>
              <p className="mt-1 text-sm font-semibold text-[#8b93a8]">{user?.email}</p>
            </div>
          </div>
          <div className="mt-6 space-y-4 rounded-[24px] bg-[#f8fafe] p-5">
            <div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-[#4f80ff]" /><div><p className="text-sm font-extrabold text-[#20253a]">Role</p><p className="text-sm font-semibold text-[#7d88a3]">{user?.role}</p></div></div>
            <div className="flex items-center gap-3"><CircleDollarSign className="h-5 w-5 text-[#16c098]" /><div><p className="text-sm font-extrabold text-[#20253a]">Title</p><p className="text-sm font-semibold text-[#7d88a3]">{user?.title || 'Team member'}</p></div></div>
            <div className="flex items-center gap-3"><MapPin className="h-5 w-5 text-[#ffb648]" /><div><p className="text-sm font-extrabold text-[#20253a]">Workspace</p><p className="text-sm font-semibold text-[#7d88a3]">Controllusion HQ</p></div></div>
          </div>
        </ShellCard>
        <div className="space-y-5">
          <ShellCard>
            <h2 className="text-xl font-black tracking-[-0.03em] text-[#20253a]">Profile</h2>
            <form className="mt-6 space-y-5" onSubmit={submitProfile}>
              <div className="grid gap-5 md:grid-cols-2">
                <SettingsField error={profileErrors.fullName} label="Full name"><FieldInput name="fullName" onChange={handleProfileChange} value={profileValues.fullName} /></SettingsField>
                <SettingsField error={profileErrors.email} label="Email"><FieldInput name="email" onChange={handleProfileChange} type="email" value={profileValues.email} /></SettingsField>
                <SettingsField label="Phone"><FieldInput name="phone" onChange={handleProfileChange} value={profileValues.phone} /></SettingsField>
                <SettingsField label="Job title"><FieldInput name="title" onChange={handleProfileChange} value={profileValues.title} /></SettingsField>
              </div>
              {profileError ? <div className="rounded-[18px] bg-[#fff1f1] px-4 py-3 text-sm font-semibold text-[#ff6b6b]">{profileError}</div> : null}
              <button className="inline-flex h-12 items-center justify-center rounded-[16px] bg-[#4f80ff] px-5 text-sm font-extrabold text-white transition hover:bg-[#3d69ea]" disabled={profileSubmitting} type="submit">{profileSubmitting ? 'Saving...' : 'Save changes'}</button>
            </form>
          </ShellCard>
          <ShellCard>
            <h2 className="text-xl font-black tracking-[-0.03em] text-[#20253a]">Change password</h2>
            <form className="mt-6 space-y-5" onSubmit={submitPassword}>
              <SettingsField error={passwordErrors.currentPassword} label="Current password"><FieldInput name="currentPassword" onChange={handlePasswordChange} type="password" value={passwordValues.currentPassword} /></SettingsField>
              <div className="grid gap-5 md:grid-cols-2">
                <SettingsField error={passwordErrors.newPassword} label="New password"><FieldInput name="newPassword" onChange={handlePasswordChange} type="password" value={passwordValues.newPassword} /></SettingsField>
                <SettingsField error={passwordErrors.confirmNewPassword} label="Confirm password"><FieldInput name="confirmNewPassword" onChange={handlePasswordChange} type="password" value={passwordValues.confirmNewPassword} /></SettingsField>
              </div>
              {passwordError ? <div className="rounded-[18px] bg-[#fff1f1] px-4 py-3 text-sm font-semibold text-[#ff6b6b]">{passwordError}</div> : null}
              <button className="inline-flex h-12 items-center justify-center rounded-[16px] border border-[color:var(--border)] bg-white px-5 text-sm font-extrabold text-[#20253a] transition hover:border-[#cfd7e9] hover:bg-[#fafcff]" disabled={passwordSubmitting} type="submit">{passwordSubmitting ? 'Updating...' : 'Update password'}</button>
            </form>
          </ShellCard>
        </div>
      </div>
    </div>
  );
}

function WorkspacePage({ sectionKey }) {
  const section = useMemo(() => WORKSPACE_BY_KEY[sectionKey], [sectionKey]);
  if (!section) return null;
  if (sectionKey === 'dashboard') return <DashboardSection />;
  if (sectionKey === 'products') return <ProductsSection />;
  if (sectionKey === 'favorites') return <FavoritesSection />;
  if (sectionKey === 'inbox') return <InboxSection />;
  if (sectionKey === 'order-lists') return <OrderListsSection />;
  if (sectionKey === 'product-stock') return <ProductStockSection />;
  if (sectionKey === 'pricing') return <PricingSection />;
  if (sectionKey === 'calender') return <CalenderSection />;
  if (sectionKey === 'to-do') return <TodoSection />;
  if (sectionKey === 'contact') return <ContactSection />;
  if (sectionKey === 'invoice') return <InvoiceSection />;
  if (sectionKey === 'ui-elements') return <UiElementsSection />;
  if (sectionKey === 'team') return <TeamSection />;
  if (sectionKey === 'table') return <TableSection />;
  if (sectionKey === 'settings') return <SettingsSection />;
  return null;
}

export default WorkspacePage;
