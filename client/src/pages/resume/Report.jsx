import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, X, FileText, ExternalLink } from 'lucide-react';
import { resumeApi } from '../../api/resume.api.js';
import Card from '../../components/common/Card.jsx';
import Spinner from '../../components/common/Spinner.jsx';

const ScoreGauge = ({ score }) => {
  const tier = score >= 80 ? 'text-emerald-500' : score >= 60 ? 'text-amber-500' : 'text-red-500';
  return (
    <div className="flex flex-col items-center">
      <div className={`text-6xl font-bold ${tier}`}>{score}</div>
      <div className="text-xs uppercase tracking-wide text-zinc-500">ATS score</div>
    </div>
  );
};

const Section = ({ name, score, feedback }) => (
  <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
    <div className="flex items-center justify-between">
      <h4 className="font-medium capitalize">{name}</h4>
      <span className="font-mono text-sm">{score}/10</span>
    </div>
    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{feedback}</p>
  </div>
);

export default function ResumeReport() {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  useEffect(() => { resumeApi.get(id).then((r) => setResume(r.data.data.resume)); }, [id]);

  if (!resume) return <div className="flex h-96 items-center justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold">
            <FileText className="h-6 w-6" /> {resume.fileName}
          </h1>
          <p className="text-sm text-zinc-500">Analyzed {new Date(resume.analyzedAt).toLocaleString()}</p>
        </div>
        <a href={resume.fileUrl} target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm text-brand-600 hover:underline">
          View original <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="flex items-center justify-center"><ScoreGauge score={resume.atsScore || 0} /></Card>
        <Card className="lg:col-span-2">
          <h2 className="mb-3 font-medium">Strengths</h2>
          <ul className="space-y-1.5 text-sm">
            {resume.strengths?.map((s, i) => (
              <li key={i} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-emerald-500" />{s}</li>
            ))}
          </ul>
          <h2 className="mb-3 mt-6 font-medium">Weaknesses</h2>
          <ul className="space-y-1.5 text-sm">
            {resume.weaknesses?.map((w, i) => (
              <li key={i} className="flex items-start gap-2"><X className="mt-0.5 h-4 w-4 text-red-500" />{w}</li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <h2 className="mb-4 font-medium">Section analysis</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {resume.sectionAnalysis && Object.entries(resume.sectionAnalysis).map(([k, v]) =>
            <Section key={k} name={k} score={v.score} feedback={v.feedback} />)}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 font-medium">Missing keywords</h2>
          <div className="flex flex-wrap gap-2">
            {resume.missingKeywords?.map((k, i) => (
              <span key={i} className="rounded-full bg-amber-100 px-2.5 py-1 text-xs text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">{k}</span>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="mb-3 font-medium">Suggestions</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
            {resume.suggestions?.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </Card>
      </div>

      <div className="text-center">
        <Link to="/resume/history" className="text-sm text-brand-600 hover:underline">View all analyses</Link>
      </div>
    </div>
  );
}
