import { forwardRef } from 'react';
import { cx } from '../../utils/formatters';

const Input = forwardRef(function Input(
  { as = 'input', className, error = false, rows = 4, ...props },
  ref,
) {
  const sharedClassName = cx(
    'field-shell w-full px-3 py-2 text-xs font-medium text-[var(--text)] placeholder:text-[#a4afc4]',
    'transition focus:border-[#cfd7ff] focus:ring-4 focus:ring-[#eef2ff]',
    error ? 'border-rose-300 focus:ring-rose-100' : 'border-[color:var(--border)]',
    as === 'textarea' ? 'min-h-[120px] resize-y py-3' : 'h-[36px]',
    className,
  );

  if (as === 'textarea') {
    return <textarea className={sharedClassName} ref={ref} rows={rows} {...props} />;
  }

  return <input className={sharedClassName} ref={ref} {...props} />;
});

export default Input;
