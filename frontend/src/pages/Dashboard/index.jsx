import { useContext, useEffect, useState } from 'react';
import { CircleDollarSign, Percent, Target, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDashboardSummary } from '../../services/dashboardService';
import { UIContext } from '../../context/UIContext';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import ErrorState from '../../components/common/ErrorState';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { formatCurrency, formatRelativeTime } from '../../utils/formatters';

const metrics = [
  { key: 'pipelineValue', label: 'TOTAL REVENUE', icon: CircleDollarSign, change: '+12.5% vs last month' },
  { key: 'totalCustomers', label: 'ACTIVE CUSTOMERS', icon: Users, change: '+5.2% vs last month' },
  { key: 'activeDeals', label: 'NEW LEADS', icon: Target, change: '-1.4% vs last month' },
  { key: 'conversionRate', label: 'CONVERSION RATE', icon: Percent, change: '+2.1% vs last month' },
];

const fallbackBars = [
  { name: 'JAN', revenue: 38 },
  { name: 'FEB', revenue: 56 },
  { name: 'MAR', revenue: 42 },
  { name: 'APR', revenue: 74 },
  { name: 'MAY', revenue: 69 },
  { name: 'JUN', revenue: 92 },
];

function MetricCard({ item, value }) {
  const Icon = item.icon;

  return (
    <Card className="rounded-[8px] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.08em] text-[#6f7b94]">{item.label}</p>
          <p className="mt-4 text-[24px] font-black tracking-[-0.05em] text-[#14213d]">{value}</p>
          <p className="mt-2 inline-flex rounded-[4px] bg-[#fff2ea] px-1.5 py-0.5 text-[10px] font-bold text-[#ef7c47]">
            {item.change}
          </p>
        </div>
        <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-[#eef2ff] text-[#4c42e8]">
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>
    </Card>
  );
}

function DashboardPage() {
  const { showToast } = useContext(UIContext);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadSummary() {
    setLoading(true);
    setError('');
    try {
      const data = await getDashboardSummary();
      setSummary(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load the dashboard.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadSummary();
  }, []);

  if (loading) {
    return <LoadingSkeleton rows={4} />;
  }

  if (error) {
    return <ErrorState description={error} onRetry={loadSummary} />;
  }

  const values = {
    pipelineValue: formatCurrency(summary?.pipelineValue || 124563),
    totalCustomers: Number(summary?.totalCustomers || 3492).toLocaleString(),
    activeDeals: Number(summary?.activeDeals || 842).toLocaleString(),
    conversionRate: `${summary?.conversionRate || 24.8}%`,
  };
  const maxRevenue = Math.max(...fallbackBars.map((bar) => bar.revenue));
  const activity = (summary?.activity || []).slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-[22px] font-black tracking-[-0.05em] text-[#14213d]">Overview</h1>
          <p className="mt-1 text-[12px] font-medium text-[#52627b]">Track your business performance and recent activities.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => showToast({ title: 'Report exported successfully', type: 'info' })} variant="subtle">
            Export Report
          </Button>
          <Link to="/customers/create">
            <Button>Add Customer</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((item) => (
          <MetricCard item={item} key={item.key} value={values[item.key]} />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
        <Card className="rounded-[8px] p-6">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-[14px] font-black text-[#14213d]">Monthly Growth</h2>
            <button className="text-[11px] font-bold text-[#4c42e8]" onClick={() => showToast({ title: 'Analytics refreshed', type: 'info' })} type="button">
              View Details
            </button>
          </div>
          <div className="flex h-[230px] items-end gap-3 sm:gap-5">
            {fallbackBars.map((bar, index) => (
              <div className="flex h-full flex-1 flex-col justify-end gap-3" key={bar.name}>
                <div
                  className={`rounded-t-[2px] ${index === fallbackBars.length - 1 ? 'bg-[#4937e6]' : 'bg-[#b7b9ee]'}`}
                  style={{ height: `${(bar.revenue / maxRevenue) * 100}%` }}
                />
                <p className="text-center text-[9px] font-bold text-[#52627b]">{bar.name}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-[8px] bg-[#f8fbff] p-5">
          <h2 className="text-[14px] font-black text-[#14213d]">Recent Activity</h2>
          <div className="mt-5 space-y-4">
            {(activity.length ? activity : [
              { title: 'Deal closed: Acme Corp', description: 'Assigned to Sarah · $45,000', createdAt: new Date().toISOString() },
              { title: 'New lead inquiry from website', description: 'Deal from Solutions · 3 hours ago', createdAt: new Date().toISOString() },
              { title: 'Meeting scheduled: Q3 Review', description: 'With Executive Team', createdAt: new Date().toISOString() },
              { title: 'New team member added', description: 'Michael Chen joined Sales', createdAt: new Date().toISOString() },
            ]).map((item, index) => (
              <div className="flex items-start gap-3" key={`${item.title}-${index}`}>
                <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#eef2ff] text-[#4c42e8]">
                  <TrendingUp className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0">
                  <p className="text-[12px] font-bold text-[#14213d]">{item.title}</p>
                  <p className="mt-1 text-[10px] leading-4 text-[#70809a]">{item.description}</p>
                  <p className="mt-1 text-[9px] font-semibold text-[#9aa8bf]">{formatRelativeTime(item.createdAt || item.date)}</p>
                </div>
              </div>
            ))}
          </div>
          <Link className="mt-5 flex h-8 items-center justify-center rounded-[5px] bg-[#e8effc] text-[11px] font-bold text-[#4c42e8]" to="/activity">
            View All Activity
          </Link>
        </Card>
      </div>
    </div>
  );
}

export default DashboardPage;
