import { cx } from '../../utils/formatters';

const variants = {
  primary:
    'border border-[#4c42e8] bg-[linear-gradient(135deg,#4c42e8_0%,#5a49f4_100%)] text-white shadow-[0_12px_24px_-14px_rgba(76,66,232,0.85)] hover:translate-y-[-1px] hover:shadow-[0_18px_30px_-16px_rgba(76,66,232,0.95)]',
  secondary:
    'border border-[#dfe6ff] bg-[#eef2ff] text-[#4c42e8] hover:border-[#d3dcff] hover:bg-[#e6ecff]',
  ghost: 'border border-transparent bg-transparent text-[#51607a] hover:bg-[#f3f6ff] hover:text-[#1f2a44]',
  danger: 'border border-[#ffd7d1] bg-[#fff4f1] text-[#f3704b] hover:border-[#ffc8be] hover:bg-[#ffede8]',
  subtle: 'border border-[#edf1ff] bg-white text-[#1f2a44] hover:bg-[#f8f9ff]',
};

const sizes = {
  sm: 'min-h-[36px] px-3.5 py-2 text-sm',
  md: 'min-h-[40px] px-4 py-2.5 text-sm',
  lg: 'min-h-[46px] px-5 py-3 text-base',
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
        'inline-flex items-center justify-center gap-2 rounded-[12px] font-semibold transition duration-200',
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
