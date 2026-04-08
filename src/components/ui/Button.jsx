import { cx } from '../../utils/formatters';

const variants = {
  primary: 'border border-brand-600 bg-brand-600 text-white shadow-soft hover:border-brand-700 hover:bg-brand-700',
  secondary: 'border border-[color:var(--border)] bg-white text-[var(--text)] hover:border-[color:var(--border-strong)] hover:bg-slate-50',
  ghost: 'bg-transparent text-[var(--text)] hover:bg-white/80',
  danger: 'border border-[#ff6b6b] bg-[#ff6b6b] text-white hover:border-[#f05f5f] hover:bg-[#f05f5f]',
  subtle: 'bg-brand-50 text-brand-700 hover:bg-brand-100',
};

const sizes = {
  sm: 'px-3.5 py-2.5 text-sm',
  md: 'px-4.5 py-3 text-sm',
  lg: 'px-5.5 py-3.5 text-base',
};

function Button({
  children,
  className,
  fullWidth = false,
  isLoading = false,
  size = 'md',
  type = 'button',
  variant = 'primary',
  ...props
}) {
  return (
    <button
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-[16px] font-extrabold transition duration-200',
        'focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:opacity-60',
        sizes[size],
        variants[variant],
        fullWidth && 'w-full',
        className,
      )}
      disabled={isLoading || props.disabled}
      type={type}
      {...props}
    >
      {isLoading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" /> : null}
      {children}
    </button>
  );
}

export default Button;
