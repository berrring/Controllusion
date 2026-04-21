import { cx } from '../../utils/formatters';

const variants = {
  default: 'bg-[#eef2ff] text-[#707b94]',
  success: 'bg-[#edf8f1] text-[#2e8a5f]',
  warning: 'bg-[#fff1e8] text-[#ef7c47]',
  danger: 'bg-[#ffeceb] text-[#ec6a60]',
  brand: 'bg-[#eef2ff] text-[#5b50e9]',
  violet: 'bg-[#efeaff] text-[#7152e8]',
};

function Badge({ children, className, variant = 'default' }) {
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

export default Badge;
