import clsx from 'clsx';
export default function Card({ className, children, ...rest }) {
  return (
    <div {...rest} className={clsx(
      'rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm',
      'dark:border-zinc-800 dark:bg-zinc-900',
      className,
    )}>
      {children}
    </div>
  );
}
