import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../../api/auth.api.js';
import Card from '../../components/common/Card.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.forgot(email);
      setSent(true);
      toast.success('If that email exists, a reset link was sent');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Request failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-semibold">Reset password</h1>
        {sent ? (
          <p className="mt-4 text-sm text-zinc-500">
            Check your inbox for a reset link. In local dev (no SMTP configured), the link is printed to the backend console.
          </p>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={submit}>
            <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <Button type="submit" loading={loading} className="w-full">Send reset link</Button>
          </form>
        )}
        <p className="mt-4 text-sm">
          <Link to="/login" className="text-brand-600 hover:underline">Back to sign in</Link>
        </p>
      </Card>
    </div>
  );
}
