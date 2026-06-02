import clsx from 'clsx';
import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className, ...props }, ref) => (
  <label className="block">
    {label && <span className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</span>}
    <input
      ref={ref}
      {...props}
      className={clsx(
        'block w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm outline-none',
        'border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900',
        'focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30',
        error && 'border-red-500 focus:border-red-500 focus:ring-red-500/30',
        className,
      )}
    />
    {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
  </label>
));
export default Input;
