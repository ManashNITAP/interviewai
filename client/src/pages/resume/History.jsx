import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { resumeApi } from '../../api/resume.api.js';
import Card from '../../components/common/Card.jsx';
import Spinner from '../../components/common/Spinner.jsx';

export default function ResumeHistory() {
  const [resumes, setResumes] = useState(null);
  useEffect(() => { resumeApi.list().then((r) => setResumes(r.data.data.resumes)); }, []);
  if (!resumes) return <div className="flex h-96 items-center justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Resume history</h1>
      <Card className="p-0">
        {resumes.length === 0 ? (
          <p className="p-6 text-sm text-zinc-500">No resumes analyzed yet.</p>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {resumes.map((r) => (
              <Link key={r._id} to={`/resume/${r._id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                <div>
                  <p className="font-medium">{r.fileName}</p>
                  <p className="text-xs text-zinc-500">{new Date(r.createdAt).toLocaleString()}</p>
                </div>
                <span className="font-mono text-sm">{r.atsScore}/100</span>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
