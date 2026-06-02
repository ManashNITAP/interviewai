import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';

export default function Shell() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
