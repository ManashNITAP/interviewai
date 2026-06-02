import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { interviewApi } from '../../api/interview.api.js';
import { ROLES, DIFFICULTIES, TYPES } from '../../utils/constants.js';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';

const Pick = ({ value, options, onChange }) => (
  <div className="flex flex-wrap gap-2">
    {options.map((o) => (
      <button key={o} type="button" onClick={() => onChange(o)}
        className={`rounded-full border px-3 py-1.5 text-sm transition ${value === o ? 'border-brand-600 bg-brand-600 text-white' : 'border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900'}`}>
        {o}
      </button>
    ))}
  </div>
);

export default function InterviewSetup() {
  const [cfg, setCfg] = useState({ role: 'Full Stack', difficulty: 'Medium', type: 'Mixed', numQuestions: 8 });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const start = async () => {
    setLoading(true);
    try {
      const { data } = await interviewApi.create(cfg);
      navigate(`/interview/${data.data.interview._id}/session`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not start interview');
    } finally { setLoading(false); }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">New mock interview</h1>
        <p className="text-sm text-zinc-500">Configure your session, then start.</p>
      </div>
      <Card className="space-y-6">
        <div>
          <h3 className="mb-2 text-sm font-medium">Role</h3>
          <Pick value={cfg.role} options={ROLES} onChange={(role) => setCfg({ ...cfg, role })} />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-medium">Difficulty</h3>
          <Pick value={cfg.difficulty} options={DIFFICULTIES} onChange={(difficulty) => setCfg({ ...cfg, difficulty })} />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-medium">Type</h3>
          <Pick value={cfg.type} options={TYPES} onChange={(type) => setCfg({ ...cfg, type })} />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-medium">Number of questions: {cfg.numQuestions}</h3>
          <input type="range" min={3} max={15} value={cfg.numQuestions}
            onChange={(e) => setCfg({ ...cfg, numQuestions: Number(e.target.value) })}
            className="w-full accent-brand-600" />
        </div>
        <div className="flex justify-end">
          <Button onClick={start} loading={loading}>Start interview</Button>
        </div>
      </Card>
    </div>
  );
}
