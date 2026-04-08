import { forwardRef } from 'react';
import { cx } from '../../utils/formatters';

const Select = forwardRef(function Select({ className, error = false, children, ...props }, ref) {
  return (
    <select
      className={cx(
        'field-shell h-12 w-full appearance-none px-4 py-3 text-sm font-semibold text-[var(--text)]',
        'transition focus:border-brand-300 focus:ring-4 focus:ring-brand-100',
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
