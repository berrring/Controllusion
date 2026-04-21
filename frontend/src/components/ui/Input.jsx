import { forwardRef } from 'react';
import { cx } from '../../utils/formatters';

const Input = forwardRef(function Input(
  { as = 'input', className, error = false, rows = 4, ...props },
  ref,
) {
  const sharedClassName = cx(
    'field-shell w-full px-4 py-3 text-sm font-medium text-[var(--text)] placeholder:text-[color:var(--text-muted)]',
    'transition focus:border-[#cfd7ff] focus:ring-4 focus:ring-[#eef2ff]',
    error ? 'border-rose-300 focus:ring-rose-100' : 'border-[color:var(--border)]',
    as === 'textarea' ? 'min-h-[132px] resize-y py-3.5' : 'h-[42px]',
    className,
  );

  if (as === 'textarea') {
    return <textarea className={sharedClassName} ref={ref} rows={rows} {...props} />;
  }

  return <input className={sharedClassName} ref={ref} {...props} />;
});

export default Input;
