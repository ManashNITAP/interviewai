import { useEffect, useState, useCallback } from 'react';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminApi } from '../../api/admin.api.js';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Spinner from '../../components/common/Spinner.jsx';

const PER_PAGE = 20;

export default function AdminUsers() {
  const [state, setState] = useState({ users: null, total: 0, page: 1 });
  const [busy, setBusy] = useState(null);

  const load = useCallback((page) => {
    adminApi.users(page).then((r) => setState({ ...r.data.data, page }));
  }, []);

  useEffect(() => { load(1); }, [load]);

  const remove = async (id) => {
    if (!window.confirm('Delete this user and all their data? This cannot be undone.')) return;
    setBusy(id);
    try {
      await adminApi.deleteUser(id);
      toast.success('User deleted');
      load(state.page);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Delete failed');
    } finally { setBusy(null); }
  };

  if (!state.users) return <div className="flex h-96 items-center justify-center"><Spinner size="lg" /></div>;

  const totalPages = Math.max(1, Math.ceil(state.total / PER_PAGE));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">User management</h1>
        <p className="text-sm text-zinc-500">{state.total} total users</p>
      </div>

      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Joined</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {state.users.map((u) => (
                <tr key={u._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                  <td className="px-6 py-3 font-medium">{u.name}</td>
                  <td className="px-6 py-3 text-zinc-500">{u.email}</td>
                  <td className="px-6 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${u.role === 'admin' ? 'bg-brand-100 text-brand-700 dark:bg-brand-600/20 dark:text-brand-300' : 'bg-zinc-100 dark:bg-zinc-800'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-zinc-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-3 text-right">
                    {u.role !== 'admin' && (
                      <button onClick={() => remove(u._id)} disabled={busy === u._id}
                        className="inline-flex items-center gap-1 text-red-500 hover:text-red-600 disabled:opacity-50">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <Button variant="secondary" disabled={state.page <= 1} onClick={() => load(state.page - 1)}>Previous</Button>
        <span className="text-sm text-zinc-500">Page {state.page} of {totalPages}</span>
        <Button variant="secondary" disabled={state.page >= totalPages} onClick={() => load(state.page + 1)}>Next</Button>
      </div>
    </div>
  );
}
