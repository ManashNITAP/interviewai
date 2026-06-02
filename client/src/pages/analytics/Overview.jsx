import { useEffect, useState } from 'react';
import { analyticsApi } from '../../api/analytics.api.js';
import Card from '../../components/common/Card.jsx';
import Spinner from '../../components/common/Spinner.jsx';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer,
} from 'recharts';

const fmt = (d) => new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

export default function Analytics() {
  const [data, setData] = useState(null);
  useEffect(() => { analyticsApi.me().then((r) => setData(r.data.data)); }, []);
  if (!data) return <div className="flex h-96 items-center justify-center"><Spinner size="lg" /></div>;

  const interviewTrend = data.interviewTrend.map((d) => ({ date: fmt(d.date), score: d.score }));
  const resumeTrend = data.resumeTrend.map((d) => ({ date: fmt(d.date), score: d.score }));
  const weak = data.weakAreas.map((w) => ({
    dimension: w.dimension.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()),
    avg: Number(w.avg.toFixed(1)),
  }));

  const tooltip = { contentStyle: { background: '#18181b', border: 'none', borderRadius: 8, color: '#fff' } };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Your analytics</h1>
        <p className="text-sm text-zinc-500">Trends across {data.counts.interviews} interviews and {data.counts.resumes} resumes.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-medium">Interview scores over time</h2>
          {interviewTrend.length ? (
            <div className="h-64">
              <ResponsiveContainer>
                <LineChart data={interviewTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
                  <XAxis dataKey="date" fontSize={12} stroke="currentColor" />
                  <YAxis domain={[0, 100]} fontSize={12} stroke="currentColor" />
                  <Tooltip {...tooltip} />
                  <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : <p className="py-12 text-center text-sm text-zinc-500">No interview data yet.</p>}
        </Card>

        <Card>
          <h2 className="mb-4 font-medium">Resume ATS over time</h2>
          {resumeTrend.length ? (
            <div className="h-64">
              <ResponsiveContainer>
                <LineChart data={resumeTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
                  <XAxis dataKey="date" fontSize={12} stroke="currentColor" />
                  <YAxis domain={[0, 100]} fontSize={12} stroke="currentColor" />
                  <Tooltip {...tooltip} />
                  <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : <p className="py-12 text-center text-sm text-zinc-500">No resume data yet.</p>}
        </Card>
      </div>

      <Card>
        <h2 className="mb-4 font-medium">Average score by dimension</h2>
        {weak.length ? (
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={weak} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
                <XAxis type="number" domain={[0, 10]} fontSize={12} stroke="currentColor" />
                <YAxis type="category" dataKey="dimension" fontSize={12} stroke="currentColor" width={120} />
                <Tooltip {...tooltip} />
                <Bar dataKey="avg" fill="#6366f1" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : <p className="py-12 text-center text-sm text-zinc-500">Complete interviews to see dimension data.</p>}
      </Card>
    </div>
  );
}
