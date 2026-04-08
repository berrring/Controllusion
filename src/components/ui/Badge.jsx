import { cx } from '../../utils/formatters';

const variants = {
  default: 'bg-slate-100 text-slate-600',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-rose-100 text-rose-700',
  brand: 'bg-brand-50 text-brand-700',
  violet: 'bg-violet-100 text-violet-700',
};

function Badge({ children, className, variant = 'default' }) {
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.08em]',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

export default Badge;
