import clsx from 'clsx';

const variants = {
  primary: 'bg-brand-600 hover:bg-brand-700 text-white',
  secondary: 'bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100',
  ghost: 'hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
};

export default function Button({ variant = 'primary', loading, className, children, ...props }) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium',
        'transition disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant], className,
      )}
    >
      {loading && <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />}
      {children}
    </button>
  );
}
