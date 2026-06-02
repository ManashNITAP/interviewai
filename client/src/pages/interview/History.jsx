import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { interviewApi } from '../../api/interview.api.js';
import Card from '../../components/common/Card.jsx';
import Spinner from '../../components/common/Spinner.jsx';

export default function InterviewHistory() {
  const [items, setItems] = useState(null);
  useEffect(() => { interviewApi.list().then((r) => setItems(r.data.data.interviews)); }, []);
  if (!items) return <div className="flex h-96 items-center justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Interview history</h1>
      <Card className="p-0">
        {items.length === 0 ? (
          <p className="p-6 text-sm text-zinc-500">No interviews yet.</p>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {items.map((i) => {
              const to = i.status === 'completed' ? `/interview/${i._id}/result` : `/interview/${i._id}/session`;
              return (
                <Link key={i._id} to={to}
                  className="flex items-center justify-between px-6 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                  <div>
                    <p className="font-medium">{i.role} <span className="text-xs text-zinc-500">· {i.type} · {i.difficulty}</span></p>
                    <p className="text-xs text-zinc-500">{new Date(i.createdAt).toLocaleString()} · {i.status}</p>
                  </div>
                  <span className={`font-mono text-sm ${i.status === 'completed' ? 'text-emerald-500' : 'text-zinc-500'}`}>
                    {i.overallScore ?? '-'}/100
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
