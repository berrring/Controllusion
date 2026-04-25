import { forwardRef } from 'react';
import { cx } from '../../utils/formatters';

const Select = forwardRef(function Select({ className, error = false, children, ...props }, ref) {
  return (
    <select
      className={cx(
        'field-shell h-[36px] w-full appearance-none px-3 py-2 text-xs font-medium text-[var(--text)]',
        'transition focus:border-[#cfd7ff] focus:ring-4 focus:ring-[#eef2ff]',
        error ? 'border-rose-300 focus:ring-rose-100' : 'border-[color:var(--border)]',
        className,
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  );
});

export default Select;
