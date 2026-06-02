import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, MessageSquareText, Sparkles, TrendingUp } from 'lucide-react';
import { resumeApi } from '../api/resume.api.js';
import { interviewApi } from '../api/interview.api.js';
import { analyticsApi } from '../api/analytics.api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Card from '../components/common/Card.jsx';
import Spinner from '../components/common/Spinner.jsx';
import Button from '../components/common/Button.jsx';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const Stat = ({ icon: Icon, label, value, hint }) => (
  <Card className="flex items-center gap-4">
    <div className="rounded-xl bg-brand-50 p-3 text-brand-600 dark:bg-brand-600/10">
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
      {hint && <p className="text-xs text-zinc-500">{hint}</p>}
    </div>
  </Card>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [recentResume, setRecentResume] = useState(null);
  const [recentInterviews, setRecentInterviews] = useState([]);

  useEffect(() => {
    Promise.all([analyticsApi.me(), resumeApi.list(), interviewApi.list()])
      .then(([a, r, i]) => {
        setData(a.data.data);
        setRecentResume(r.data.data.resumes[0]);
        setRecentInterviews(i.data.data.interviews.slice(0, 5));
      });
  }, []);

  if (!data) return <div className="flex h-96 items-center justify-center"><Spinner size="lg" /></div>;

  const chartData = data.interviewTrend.map((d) => ({
    date: new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    score: d.score,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Welcome back, {user?.name?.split(' ')[0]}</h1>
          <p className="text-sm text-zinc-500">Here is where you stand today.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/resume/upload"><Button variant="secondary">Upload resume</Button></Link>
          <Link to="/interview"><Button>Start interview</Button></Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={FileText} label="Resumes analyzed" value={data.counts.resumes} />
        <Stat icon={MessageSquareText} label="Interviews done" value={data.counts.interviews} />
        <Stat icon={TrendingUp} label="Avg interview" value={Math.round(data.avgInterviewScore)} hint="out of 100" />
        <Stat icon={Sparkles} label="Latest ATS" value={recentResume ? recentResume.atsScore : '-'} hint={recentResume?.fileName} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="mb-4 font-medium">Interview score over time</h2>
          {chartData.length ? (
            <div className="h-64">
              <ResponsiveContainer>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
                  <XAxis dataKey="date" fontSize={12} stroke="currentColor" />
                  <YAxis domain={[0, 100]} fontSize={12} stroke="currentColor" />
                  <Tooltip contentStyle={{ background: '#18181b', border: 'none', borderRadius: 8, color: '#fff' }} />
                  <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="py-12 text-center text-sm text-zinc-500">No completed interviews yet - start one to see your trend.</p>
          )}
        </Card>

        <Card>
          <h2 className="mb-4 font-medium">Recommended improvements</h2>
          {data.weakAreas.length ? (
            <ul className="space-y-3">
              {data.weakAreas.slice(0, 3).map((w) => (
                <li key={w.dimension}>
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{w.dimension.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="font-mono text-zinc-500">{w.avg.toFixed(1)}/10</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded bg-zinc-100 dark:bg-zinc-800">
                    <div className="h-full bg-brand-600" style={{ width: `${(w.avg / 10) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-zinc-500">Complete a few interviews to unlock insights.</p>}
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-medium">Recent interviews</h2>
          <Link to="/interview/history" className="text-sm text-brand-600 hover:underline">View all</Link>
        </div>
        {recentInterviews.length === 0
          ? <p className="text-sm text-zinc-500">No interviews yet.</p>
          : (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {recentInterviews.map((i) => (
                <Link key={i._id} to={`/interview/${i._id}/result`}
                  className="-mx-2 flex items-center justify-between rounded-lg px-2 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                  <div>
                    <p className="font-medium">{i.role} <span className="text-xs text-zinc-500">· {i.type} · {i.difficulty}</span></p>
                    <p className="text-xs text-zinc-500">{new Date(i.createdAt).toLocaleString()}</p>
                  </div>
                  <span className={`font-mono text-sm ${i.status === 'completed' ? 'text-emerald-500' : 'text-zinc-500'}`}>
                    {i.overallScore ?? '-'}/100
                  </span>
                </Link>
              ))}
            </div>
          )}
      </Card>
    </div>
  );
}
