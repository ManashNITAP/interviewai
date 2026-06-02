import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { interviewApi } from '../../api/interview.api.js';
import Card from '../../components/common/Card.jsx';
import Spinner from '../../components/common/Spinner.jsx';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export default function InterviewResult() {
  const { id } = useParams();
  const [interview, setInterview] = useState(null);
  const [regenId, setRegenId] = useState(null);

  useEffect(() => { interviewApi.get(id).then((r) => setInterview(r.data.data.interview)); }, [id]);

  if (!interview) return <div className="flex h-96 items-center justify-center"><Spinner size="lg" /></div>;

  const dims = ['technicalQuality', 'communication', 'confidence', 'structure'];
  const avg = (d) => {
    const xs = interview.questions.map((q) => q.evaluation?.[d]).filter((n) => typeof n === 'number');
    return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
  };
  const radar = dims.map((d) => ({
    dim: d.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()),
    score: Number(avg(d).toFixed(1)),
  }));

  const regenerate = async (qid) => {
    setRegenId(qid);
    try {
      const { data } = await interviewApi.regenerate(id, qid);
      setInterview((prev) => ({
        ...prev,
        questions: prev.questions.map((q) => (q._id === qid ? { ...q, evaluation: data.data.evaluation } : q)),
      }));
      toast.success('Feedback regenerated');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to regenerate');
    } finally { setRegenId(null); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Interview results</h1>
        <p className="text-sm text-zinc-500">{interview.role} · {interview.type} · {interview.difficulty}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="flex flex-col items-center justify-center">
          <p className="text-6xl font-bold text-brand-600">{interview.overallScore}</p>
          <p className="text-xs uppercase tracking-wide text-zinc-500">Overall score</p>
        </Card>
        <Card className="lg:col-span-2">
          <h2 className="mb-2 font-medium">Summary</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{interview.summary}</p>
          <h3 className="mb-2 mt-4 text-sm font-medium">Next steps</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
            {interview.nextSteps?.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </Card>
      </div>

      <Card>
        <h2 className="mb-4 font-medium">Dimension breakdown</h2>
        <div className="h-72">
          <ResponsiveContainer>
            <RadarChart data={radar}>
              <PolarGrid />
              <PolarAngleAxis dataKey="dim" fontSize={12} />
              <PolarRadiusAxis domain={[0, 10]} />
              <Radar dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 font-medium">Question-by-question</h2>
        <div className="space-y-4">
          {interview.questions.map((q, i) => (
            <details key={q._id || i} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
              <summary className="cursor-pointer font-medium">Q{i + 1}. {q.question}</summary>
              <div className="mt-3 space-y-2 text-sm">
                <p><span className="text-zinc-500">Your answer:</span> {q.answer || <em>not answered</em>}</p>
                {q.evaluation && (
                  <>
                    <p className="text-zinc-600 dark:text-zinc-400"><strong>Feedback:</strong> {q.evaluation.feedback}</p>
                    <p className="text-zinc-600 dark:text-zinc-400"><strong>Model answer:</strong> {q.evaluation.improvedAnswer}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-zinc-500">
                      {dims.map((d) => <span key={d}>{d}: <span className="font-mono">{q.evaluation[d]}/10</span></span>)}
                    </div>
                    <button onClick={() => regenerate(q._id)} disabled={regenId === q._id}
                      className="mt-2 inline-flex items-center gap-1 text-xs text-brand-600 hover:underline disabled:opacity-50">
                      {regenId === q._id ? 'Regenerating...' : 'Regenerate feedback'}
                    </button>
                  </>
                )}
              </div>
            </details>
          ))}
        </div>
      </Card>
    </div>
  );
}
