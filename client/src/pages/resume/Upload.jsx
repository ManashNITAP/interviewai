import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud } from 'lucide-react';
import toast from 'react-hot-toast';
import { resumeApi } from '../../api/resume.api.js';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [drag, setDrag] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onDrop = (e) => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f?.type === 'application/pdf') setFile(f);
    else toast.error('Please drop a PDF');
  };

  const upload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const { data } = await resumeApi.upload(file);
      toast.success('Resume analyzed');
      navigate(`/resume/${data.data.resume._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Resume Analyzer</h1>
        <p className="text-sm text-zinc-500">Upload your PDF resume. We will score it against ATS criteria and suggest improvements.</p>
      </div>

      <Card>
        <div
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
          className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center transition ${drag ? 'border-brand-500 bg-brand-50 dark:bg-brand-600/5' : 'border-zinc-300 dark:border-zinc-700'}`}
        >
          <UploadCloud className="mb-3 h-10 w-10 text-zinc-400" />
          <p className="font-medium">Drop your PDF here, or browse</p>
          <p className="mt-1 text-xs text-zinc-500">Max 5 MB · text-based PDFs only</p>
          <input type="file" accept="application/pdf" className="hidden" id="resume-file"
            onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <label htmlFor="resume-file" className="mt-4 cursor-pointer rounded-lg bg-zinc-100 px-3 py-1.5 text-sm hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700">
            Choose file
          </label>
          {file && <p className="mt-4 text-sm text-emerald-500">Selected: {file.name}</p>}
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={upload} loading={loading} disabled={!file}>Analyze resume</Button>
        </div>
      </Card>
    </div>
  );
}
