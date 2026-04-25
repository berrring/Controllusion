import { useEffect, useState } from 'react';
import { BarChart3, CircleDollarSign, Target, TrendingUp } from 'lucide-react';
import { getDashboardSummary } from '../../services/dashboardService';
import Card from '../../components/ui/Card';
import ErrorState from '../../components/common/ErrorState';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { formatCurrency } from '../../utils/formatters';

const bars = [42, 58, 48, 72, 68, 86, 74, 96];

function AnalyticsPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadSummary() {
    setLoading(true);
    setError('');
    try {
      setSummary(await getDashboardSummary());
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load analytics.');
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-black tracking-[-0.05em] text-[#14213d]">Analytics</h1>
        <p className="mt-1 text-[12px] font-medium text-[#52627b]">Forecast revenue, conversion, and pipeline velocity.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          ['Pipeline Value', formatCurrency(summary?.pipelineValue || 0), CircleDollarSign],
          ['Win Rate', `${summary?.conversionRate || 0}%`, Target],
          ['Active Deals', Number(summary?.activeDeals || 0).toLocaleString(), TrendingUp],
        ].map(([label, value, Icon]) => (
          <Card className="rounded-[9px] p-5" key={label}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.08em] text-[#52627b]">{label}</p>
                <p className="mt-4 text-[28px] font-black tracking-[-0.06em] text-[#14213d]">{value}</p>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-[7px] bg-[#eef2ff] text-[#4c42e8]">
                <Icon className="h-4 w-4" />
              </span>
            </div>
          </Card>
        ))}
      </div>

      <Card className="rounded-[9px] p-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-[16px] font-black text-[#14213d]">Revenue Forecast</h2>
            <p className="mt-1 text-[11px] text-[#70809a]">Projected growth based on active pipeline data.</p>
          </div>
          <BarChart3 className="h-5 w-5 text-[#4c42e8]" />
        </div>
        <div className="flex h-[340px] items-end gap-4">
          {bars.map((height, index) => (
            <div className="flex h-full flex-1 flex-col justify-end gap-3" key={index}>
              <div className="rounded-t-[4px] bg-[#4c42e8]" style={{ height: `${height}%`, opacity: 0.45 + index / 16 }} />
              <p className="text-center text-[10px] font-bold text-[#70809a]">Q{(index % 4) + 1}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default AnalyticsPage;
