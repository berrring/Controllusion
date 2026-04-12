import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import Card from './Card';
import { formatCurrency, formatNumber } from '../../utils/formatters';

function StatCard({ label, value, icon: Icon, trend, trendDirection = 'up', tone = 'brand', isCurrency = false, suffix = '' }) {
  const toneClassName = {
    brand: 'bg-brand-50 text-brand-500',
    success: 'bg-emerald-50 text-emerald-500',
    warning: 'bg-amber-50 text-amber-500',
    violet: 'bg-violet-50 text-violet-400',
  }[tone];
  const trendAccentClassName = trendDirection === 'down' ? 'text-rose-500' : 'text-emerald-500';
  const TrendIcon = trendDirection === 'down' ? ArrowDownRight : ArrowUpRight;

  return (
    <Card className="flex h-full flex-col justify-between px-4 py-4 sm:px-5 sm:py-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[14px] font-extrabold text-slate-500">{label}</p>
          <p className="mt-4 text-[24px] font-black tracking-tight text-[var(--text)] sm:text-[28px]">
            {isCurrency ? formatCurrency(value) : `${formatNumber(value)}${suffix}`}
          </p>
        </div>
        <div className={`flex h-[56px] w-[56px] items-center justify-center rounded-[18px] ${toneClassName}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {trend ? (
        <p className="mt-7 text-[13px] text-slate-500 sm:text-sm">
          <span className={`inline-flex items-center gap-1 font-extrabold ${trendAccentClassName}`}>
            <TrendIcon className="h-4 w-4" />
            {trend}
          </span>
        </p>
      ) : null}
    </Card>
  );
}

export default StatCard;
