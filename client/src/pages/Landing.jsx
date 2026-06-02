import { Link } from 'react-router-dom';
import { Sparkles, FileSearch, MessagesSquare, BarChart3 } from 'lucide-react';

const Feature = ({ icon: Icon, title, desc }) => (
  <div className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
    <Icon className="h-6 w-6 text-brand-600" />
    <h3 className="mt-3 font-semibold">{title}</h3>
    <p className="mt-1 text-sm text-zinc-500">{desc}</p>
  </div>
);

export default function Landing() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
        <span className="flex items-center gap-2 font-semibold"><Sparkles className="h-5 w-5 text-brand-600" />InterviewAI</span>
        <div className="flex gap-2">
          <Link to="/login" className="rounded-md px-3 py-1.5 text-sm">Sign in</Link>
          <Link to="/register" className="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white">Get started</Link>
        </div>
      </header>
      <section className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Land the role with <span className="text-brand-600">AI-powered</span> practice.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-zinc-500">
          Resume ATS scoring, realistic mock interviews, instant feedback. Track every rep, watch yourself improve.
        </p>
        <Link to="/register" className="mt-8 inline-block rounded-lg bg-brand-600 px-6 py-3 font-medium text-white hover:bg-brand-700">
          Start free
        </Link>
      </section>
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 pb-20 md:grid-cols-3">
        <Feature icon={FileSearch} title="Resume Analyzer" desc="ATS score, missing keywords, section-by-section feedback." />
        <Feature icon={MessagesSquare} title="Mock Interviews" desc="Realtime AI interviewer for every role and difficulty." />
        <Feature icon={BarChart3} title="Track Progress" desc="See your trend lines and weak areas across every session." />
      </section>
    </div>
  );
}
