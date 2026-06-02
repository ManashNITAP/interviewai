import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Moon, Sun, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import clsx from 'clsx';

const nav = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/resume/upload', label: 'Resume' },
  { to: '/interview', label: 'Interview' },
  { to: '/analytics', label: 'Analytics' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => { await logout(); navigate('/login'); };

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/70 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
          <Sparkles className="h-5 w-5 text-brand-600" />
          InterviewAI
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) => clsx(
              'rounded-md px-3 py-1.5 text-sm font-medium transition',
              isActive ? 'bg-zinc-200 dark:bg-zinc-800' : 'hover:bg-zinc-100 dark:hover:bg-zinc-900',
            )}>{n.label}</NavLink>
          ))}
          {user?.role === 'admin' && (
            <NavLink to="/admin/users" className="rounded-md px-3 py-1.5 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900">
              Admin
            </NavLink>
          )}
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={toggle} className="rounded-md p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <span className="hidden text-sm text-zinc-500 sm:block">{user?.name}</span>
          <button onClick={handleLogout} className="rounded-md p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900" aria-label="Logout">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
