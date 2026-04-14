import { useEffect, useState } from 'react';
import { Activity, CircleDollarSign, ListTodo, RefreshCw, Target, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getDashboardSummary } from '../../services/dashboardService';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { formatCurrency, formatRelativeTime } from '../../utils/formatters';

function getTaskStatusVariant(status) {
  switch ((status || '').toLowerCase()) {
    case 'done':
    case 'completed':
      return 'success';
    case 'blocked':
    case 'overdue':
      return 'danger';
    case 'in progress':
    case 'active':
      return 'brand';
    default:
      return 'warning';
  }
}

function DashboardPage() {
  const navigate = useNavigate();
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

  return (
    <div className="space-y-7">
      <PageHeader
        actions={
          <Button isLoading={refreshing} onClick={() => loadSummary({ silent: true })} variant="secondary">
            <RefreshCw className="h-4 w-4" />
            Refresh data
          </Button>
        }
        description="Review live CRM metrics, revenue trends, team activity, and follow-up work from one overview."
        title="Dashboard"
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Total customers" tone="violet" value={summary?.totalCustomers || 0} />
        <StatCard icon={Target} label="Active deals" tone="warning" value={summary?.activeDeals || 0} />
        <StatCard icon={CircleDollarSign} isCurrency label="Pipeline value" tone="success" value={summary?.pipelineValue || 0} />
        <StatCard
          icon={Activity}
          label="Conversion rate"
          suffix="%"
          tone="brand"
          trend={`${summary?.activeDeals || 0} deals currently in progress`}
          value={summary?.conversionRate || 0}
        />
      </div>

      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-[color:var(--border)] px-6 py-5">
            <div>
              <h2 className="text-[18px] font-black text-[var(--text)] sm:text-[20px]">Revenue trend</h2>
              <p className="mt-1 text-sm text-muted">Track revenue growth as you add and update customers in your CRM workspace.</p>
            </div>
          </div>

        <div className="h-[390px] px-4 py-6 sm:px-6">
          {revenueSeries.length ? (
            <ResponsiveContainer height="100%" width="100%">
              <AreaChart data={revenueSeries} margin={{ top: 12, right: 10, left: -4, bottom: 0 }}>
                <defs>
                  <linearGradient id="crmRevenueGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#4F80FF" stopOpacity={0.22} />
                    <stop offset="100%" stopColor="#4F80FF" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#eef1f7" vertical={false} />
                <XAxis axisLine={false} dataKey="name" tick={{ fill: '#b3bbc9', fontSize: 11 }} tickLine={false} />
                <YAxis
                  axisLine={false}
                  tick={{ fill: '#b3bbc9', fontSize: 11 }}
                  tickFormatter={(value) => `$${Math.round(value / 1000)}k`}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 18,
                    border: '1px solid #eceff6',
                    boxShadow: '0 24px 45px -34px rgba(17,24,39,0.18)',
                  }}
                  formatter={(value, name) =>
                    name === 'revenue' ? [formatCurrency(value), 'Revenue'] : [value, 'Deals']
                  }
                />
                <Area
                  activeDot={{ fill: '#4F80FF', r: 5, stroke: '#fff', strokeWidth: 2 }}
                  dataKey="revenue"
                  dot={{ fill: '#4F80FF', r: 2.8, strokeWidth: 0 }}
                  fill="url(#crmRevenueGradient)"
                  isAnimationActive={false}
                  stroke="#4F80FF"
                  strokeWidth={2}
                  type="monotone"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center">
              <EmptyState
                actionLabel="Add first customer"
                description="New accounts start with an empty pipeline. Create your first customer and deal value to unlock dashboard analytics."
                onAction={() => navigate('/customers/create')}
                title="No revenue data yet"
              />
            </div>
          )}
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-[var(--text)]">Recent activity</h2>
              <p className="mt-1 text-sm text-muted">Recent CRM changes appear here after you create or edit customer records.</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {activityItems.length ? (
              activityItems.map((item) => (
                <div className="rounded-3xl border border-slate-200 p-5" key={item.id || `${item.title}-${item.date}`}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-[var(--text)]">{item.title || 'Activity update'}</p>
                      <p className="mt-2 text-sm text-muted">{item.description || 'No details provided.'}</p>
                      {item.customerId ? (
                        <Link className="mt-3 inline-flex text-sm font-bold text-brand-600 transition hover:text-brand-700" to={`/customers/${item.customerId}`}>
                          Open {item.customerName || 'customer'} record
                        </Link>
                      ) : null}
                    </div>
                    <Badge variant="default">{formatRelativeTime(item.date || item.createdAt)}</Badge>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                actionLabel="Create customer"
                description="Your activity feed is still empty. Add a customer or update a record to start building a visible history."
                onAction={() => navigate('/customers/create')}
                title="No recent activity"
              />
            )}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-brand-50 text-brand-600">
              <ListTodo className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[var(--text)]">Open tasks</h2>
              <p className="mt-1 text-sm text-muted">Suggested follow-ups appear here as your pipeline becomes active.</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {taskItems.length ? (
              taskItems.map((task) => (
                <div className="rounded-3xl bg-[color:var(--surface-muted)] p-5" key={task.id || `${task.title}-${task.dueDate}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-base font-black text-[var(--text)]">{task.title || task.name || 'Open task'}</p>
                      <p className="mt-2 text-sm leading-7 text-muted">{task.description || 'No description provided.'}</p>
                    </div>
                    <Badge variant={getTaskStatusVariant(task.status)}>{task.status || 'Pending'}</Badge>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold text-muted">
                    {task.owner ? <span>Owner: {task.owner}</span> : null}
                    {task.dueDate ? <span>Due {formatRelativeTime(task.dueDate)}</span> : null}
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                actionLabel="Build pipeline"
                description="There are no follow-up tasks yet. Once you add customers and move them past lead stage, reminders will appear here."
                onAction={() => navigate('/customers/create')}
                title="No open tasks"
              />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default DashboardPage;
