import { useEffect, useState } from 'react';
import { Activity, Clock3, Headphones, Laptop, Package, Smartphone, Users } from 'lucide-react';
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
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import { formatCurrency } from '../../utils/formatters';

const salesChartData = [
  { label: '5k', value: 22 },
  { label: '8k', value: 28 },
  { label: '10k', value: 29 },
  { label: '12k', value: 49 },
  { label: '15k', value: 39 },
  { label: '17k', value: 52 },
  { label: '20k', value: 36 },
  { label: '22k', value: 87 },
  { label: '25k', value: 35 },
  { label: '27k', value: 53 },
  { label: '30k', value: 42 },
  { label: '32k', value: 57 },
  { label: '35k', value: 25 },
  { label: '37k', value: 33 },
  { label: '40k', value: 28 },
  { label: '42k', value: 67 },
  { label: '45k', value: 58 },
  { label: '47k', value: 63 },
  { label: '50k', value: 54 },
  { label: '52k', value: 53 },
  { label: '55k', value: 52 },
  { label: '57k', value: 42 },
  { label: '60k', value: 57 },
  { label: '62k', value: 50 },
  { label: '65k', value: 58 },
];

const dashboardOrders = [
  {
    id: 'ord_1',
    product: 'Apple Watch',
    location: '6096 Marjolaine Landing',
    dateTime: '12.09.2026 - 12:53 PM',
    piece: 423,
    amount: 34295,
    status: 'Delivered',
    icon: Clock3,
    color: 'bg-rose-50 text-rose-500',
  },
  {
    id: 'ord_2',
    product: 'Macbook Pro 16',
    location: '3457 Mission Avenue',
    dateTime: '13.09.2026 - 09:12 AM',
    piece: 212,
    amount: 19840,
    status: 'Processing',
    icon: Laptop,
    color: 'bg-brand-50 text-brand-500',
  },
  {
    id: 'ord_3',
    product: 'iPhone 15 Pro',
    location: '82 Grand River Street',
    dateTime: '13.09.2026 - 03:42 PM',
    piece: 165,
    amount: 26780,
    status: 'Delivered',
    icon: Smartphone,
    color: 'bg-amber-50 text-amber-500',
  },
  {
    id: 'ord_4',
    product: 'Airpods Max',
    location: '2241 Harbor Boulevard',
    dateTime: '14.09.2026 - 10:18 AM',
    piece: 84,
    amount: 12760,
    status: 'Pending',
    icon: Headphones,
    color: 'bg-emerald-50 text-emerald-500',
  },
];

function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadSummary() {
    setLoading(true);
    setError('');
    try {
      await getDashboardSummary();
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

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-[34px] font-black tracking-tight text-[var(--text)] sm:text-[40px]">Dashboard</h1>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Total User" tone="violet" trend="8.5% Up from yesterday" value={40689} />
        <StatCard icon={Package} label="Total Order" tone="warning" trend="1.3% Up from past week" value={10293} />
        <StatCard
          icon={Activity}
          isCurrency
          label="Total Sales"
          tone="success"
          trend="4.3% Down from yesterday"
          trendDirection="down"
          value={89000}
        />
        <StatCard icon={Clock3} label="Total Pending" tone="brand" trend="1.8% Up from yesterday" value={2040} />
      </div>

      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-[color:var(--border)] px-6 py-5">
          <h2 className="text-[18px] font-black text-[var(--text)] sm:text-[20px]">Sales Details</h2>
          <div className="w-[116px]">
            <Select defaultValue="october">
              <option value="october">October</option>
            </Select>
          </div>
        </div>

        <div className="h-[390px] px-4 py-6 sm:px-6">
          <ResponsiveContainer height="100%" width="100%">
            <AreaChart data={salesChartData} margin={{ top: 12, right: 10, left: -4, bottom: 0 }}>
              <defs>
                <linearGradient id="salesGradientDashboard" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#4F80FF" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="#4F80FF" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#eef1f7" vertical={false} />
              <XAxis
                axisLine={false}
                dataKey="label"
                interval={2}
                tick={{ fill: '#b3bbc9', fontSize: 11 }}
                tickLine={false}
              />
              <YAxis
                axisLine={false}
                domain={[20, 100]}
                tick={{ fill: '#b3bbc9', fontSize: 11 }}
                tickFormatter={(value) => `${value}%`}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 18,
                  border: '1px solid #eceff6',
                  boxShadow: '0 24px 45px -34px rgba(17,24,39,0.18)',
                }}
                formatter={(value) => [`${value}%`, 'Sales']}
                labelFormatter={(value) => `Revenue ${value}`}
              />
              <Area
                activeDot={{ fill: '#4F80FF', r: 5, stroke: '#fff', strokeWidth: 2 }}
                dataKey="value"
                dot={{ fill: '#4F80FF', r: 2.8, strokeWidth: 0 }}
                fill="url(#salesGradientDashboard)"
                isAnimationActive={false}
                stroke="#4F80FF"
                strokeWidth={2}
                type="monotone"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-[color:var(--border)] px-6 py-5">
          <h2 className="text-[18px] font-black text-[var(--text)] sm:text-[20px]">Deals Details</h2>
          <div className="w-[116px]">
            <Select defaultValue="october">
              <option value="october">October</option>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto px-4 py-5 sm:px-6">
          <table className="min-w-full overflow-hidden rounded-[18px]">
            <thead>
              <tr className="bg-[#f8f9fc] text-left">
                {['Product Name', 'Location', 'Date - Time', 'Piece', 'Amount', 'Status'].map((label) => (
                  <th className="px-4 py-3 text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-500" key={label}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dashboardOrders.map((item) => (
                <tr className="border-b border-[color:var(--border)] last:border-b-0" key={item.id}>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-[14px] ${item.color}`}>
                        <item.icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-extrabold text-slate-700">{item.product}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-slate-500">{item.location}</td>
                  <td className="px-4 py-4 text-sm font-semibold text-slate-500">{item.dateTime}</td>
                  <td className="px-4 py-4 text-sm font-bold text-slate-700">{item.piece}</td>
                  <td className="px-4 py-4 text-sm font-extrabold text-slate-700">{formatCurrency(item.amount)}</td>
                  <td className="px-4 py-4">
                    <Badge variant={item.status === 'Delivered' ? 'success' : item.status === 'Processing' ? 'brand' : 'warning'}>
                      {item.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default DashboardPage;
