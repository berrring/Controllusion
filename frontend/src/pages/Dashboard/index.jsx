import { useContext, useEffect, useState } from 'react';
import {
  CircleDollarSign,
  FilePlus2,
  Percent,
  Plus,
  RefreshCw,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { getDashboardSummary } from '../../services/dashboardService';
import { UIContext } from '../../context/UIContext';
import { addActivityEntry, addNotification } from '../../services/storage';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { formatCurrency, formatRelativeTime } from '../../utils/formatters';

const CARD_META = [
  {
    key: 'pipelineValue',
    label: 'TOTAL REVENUE',
    change: '+12.5%',
    changeTone: 'text-[#ef7c47]',
    icon: CircleDollarSign,
  },
  {
    key: 'totalCustomers',
    label: 'ACTIVE CUSTOMERS',
    change: '+4.2%',
    changeTone: 'text-[#ef7c47]',
    icon: Users,
  },
  {
    key: 'activeDeals',
    label: 'NEW LEADS',
    change: '-1.8%',
    changeTone: 'text-[#ec6a60]',
    icon: Target,
  },
  {
    key: 'conversionRate',
    label: 'CONVERSION RATE',
    change: '+0.6%',
    changeTone: 'text-[#ef7c47]',
    icon: Percent,
    suffix: '%',
  },
];

function DashboardMetricCard({ label, value, change, changeTone, icon: Icon }) {
  return (
    <Card className="rounded-[16px] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8f99ae]">{label}</p>
          <p className="mt-3 text-[18px] font-black text-[#1f2a44] sm:text-[20px]">{value}</p>
          <div className="mt-3 flex items-center gap-2 text-xs font-medium text-[#7f889f]">
            <TrendingUp className={`h-3.5 w-3.5 ${changeTone}`} />
            <span className={changeTone}>{change}</span>
            <span>vs last month</span>
          </div>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#f4f6ff] text-[#5b50e9]">
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </Card>
  );
}

function DashboardPage() {
  const navigate = useNavigate();
  const { showToast } = useContext(UIContext);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  async function loadSummary({ silent = false } = {}) {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError('');

    try {
      const data = await getDashboardSummary();
      setSummary(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load the dashboard.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void loadSummary();
  }, []);

  function createInvoiceDraft() {
    addActivityEntry({
      title: 'Invoice draft created',
      description: 'A new invoice draft was created from the dashboard quick action.',
    });
    addNotification({
      title: 'Invoice draft ready',
      message: 'The invoice draft was added to your workspace queue.',
      path: '/dashboard',
    });
    showToast({
      title: 'Invoice draft created',
      description: 'The fake backend saved a draft invoice in the activity stream.',
    });
  }

  async function inspectAnalytics() {
    await loadSummary({ silent: true });
    showToast({
      title: 'Analytics refreshed',
      description: 'The monthly growth panel was refreshed with the latest mock data.',
      type: 'info',
    });
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton rows={4} />
        <LoadingSkeleton rows={8} />
      </div>
    );
  }

  if (error) {
    return <ErrorState description={error} onRetry={loadSummary} title="Dashboard unavailable" />;
  }

  const revenueSeries = summary?.revenue || [];
  const activityItems = summary?.activity || [];
  const taskItems = summary?.tasks || [];

  const metricValues = {
    pipelineValue: formatCurrency(summary?.pipelineValue || 0),
    totalCustomers: Number(summary?.totalCustomers || 0).toLocaleString(),
    activeDeals: Number(summary?.activeDeals || 0).toLocaleString(),
    conversionRate: `${summary?.conversionRate || 0}%`,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        mobileHidden
        actions={
          <>
            <Button isLoading={refreshing} onClick={() => loadSummary({ silent: true })} variant="secondary">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button onClick={createInvoiceDraft} variant="subtle">
              <FilePlus2 className="h-4 w-4" />
              Create Invoice
            </Button>
            <Link to="/customers/create">
              <Button>
                <Plus className="h-4 w-4" />
                Add Customer
              </Button>
            </Link>
          </>
        }
        description="Monitor your key metrics and recent activities."
        title="Overview"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {CARD_META.map((item) => (
          <DashboardMetricCard
            change={item.change}
            changeTone={item.changeTone}
            icon={item.icon}
            key={item.key}
            label={item.label}
            value={metricValues[item.key]}
          />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.45fr_0.55fr]">
        <Card className="rounded-[18px]">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-[24px] font-black text-[#1f2a44]">Monthly Growth</h2>
              <p className="mt-1 text-sm text-[#7b86a0]">Track pipeline revenue across the last six months.</p>
            </div>
            <button className="text-xl font-bold text-[#909ab0]" onClick={inspectAnalytics} type="button">
              ...
            </button>
          </div>

          <div className="h-[320px] rounded-[16px] bg-[linear-gradient(180deg,#fbfcff_0%,#f6f8ff_100%)] p-4">
            {revenueSeries.length ? (
              <ResponsiveContainer height="100%" width="100%">
                <BarChart data={revenueSeries} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="#edf1fb" vertical={false} />
                  <XAxis
                    axisLine={false}
                    dataKey="name"
                    tick={{ fill: '#8d97ad', fontSize: 12, fontWeight: 600 }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 16,
                      border: '1px solid #e5eaf6',
                      boxShadow: '0 18px 45px -28px rgba(31,42,68,0.18)',
                    }}
                    cursor={{ fill: 'rgba(76,66,232,0.06)' }}
                    formatter={(value) => [formatCurrency(value), 'Revenue']}
                  />
                  <Bar dataKey="revenue" fill="#4c42e8" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <EmptyState
                  actionLabel="Add first customer"
                  description="New accounts start with an empty pipeline. Add a customer to unlock the overview cards and growth chart."
                  onAction={() => navigate('/customers/create')}
                  title="No revenue data yet"
                />
              </div>
            )}
          </div>
        </Card>

        <Card className="rounded-[18px] bg-[linear-gradient(180deg,#f6f8ff_0%,#eef2ff_100%)]">
          <div className="mb-5">
            <h2 className="text-[22px] font-black text-[#1f2a44]">Recent Activity</h2>
            <p className="mt-1 text-sm text-[#7b86a0]">Live signals from the CRM workspace.</p>
          </div>

          <div className="space-y-4">
            {activityItems.length ? (
              activityItems.slice(0, 5).map((item, index) => (
                <div className="flex items-start gap-3" key={item.id || `${item.title}-${index}`}>
                  <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#eef2ff] text-[11px] font-bold text-[#5b50e9]">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-5 text-[#1f2a44]">{item.description || item.title}</p>
                    <p className="mt-1 text-xs text-[#7b86a0]">{formatRelativeTime(item.date || item.createdAt)}</p>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                actionLabel="Create customer"
                description="Create or edit a customer to start filling this activity stream."
                onAction={() => navigate('/customers/create')}
                title="No recent activity"
              />
            )}
          </div>
        </Card>
      </div>

      <Card className="rounded-[18px]">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-[22px] font-black text-[#1f2a44]">Open Tasks</h2>
            <p className="mt-1 text-sm text-[#7b86a0]">Follow-ups generated from your current pipeline.</p>
          </div>
        </div>

        {taskItems.length ? (
          <div className="grid gap-4 lg:grid-cols-3">
            {taskItems.map((task) => (
              <div className="rounded-[16px] border border-[var(--border)] bg-[#fbfcff] p-4" key={task.id || task.title}>
                <p className="text-base font-bold text-[#1f2a44]">{task.title || 'Open task'}</p>
                <p className="mt-2 text-sm leading-6 text-[#6d7890]">{task.description || 'No description provided.'}</p>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-medium text-[#8d97ad]">
                  {task.owner ? <span>{task.owner}</span> : null}
                  {task.dueDate ? <span>{formatRelativeTime(task.dueDate)}</span> : null}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            actionLabel="Build pipeline"
            description="There are no follow-up tasks yet. Once deals move past lead stage, they will appear here."
            onAction={() => navigate('/customers/create')}
            title="No open tasks"
          />
        )}
      </Card>
    </div>
  );
}

export default DashboardPage;
