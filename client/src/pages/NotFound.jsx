import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-zinc-50 dark:bg-zinc-950">
      <h1 className="text-6xl font-bold text-brand-600">404</h1>
      <p className="text-zinc-500">This page does not exist.</p>
      <Link to="/dashboard" className="text-brand-600 hover:underline">Back to dashboard</Link>
    </div>
  );
}
