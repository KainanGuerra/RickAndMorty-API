'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

type Mode = 'login' | 'register';

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message ?? 'Something went wrong');
        return;
      }

      if (mode === 'register') {
        setMode('login');
        setError('Account created — you can log in now.');
        return;
      }

      router.push('/');
      router.refresh();
    } catch {
      setError('Could not reach the server');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} aria-label={mode === 'login' ? 'Log in' : 'Register'}>
      <input
        type="email"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={8}
      />
      <button type="submit" disabled={loading}>
        {mode === 'login' ? 'Log in' : 'Register'}
      </button>
      <button
        type="button"
        onClick={() => {
          setError(null);
          setMode(mode === 'login' ? 'register' : 'login');
        }}
      >
        {mode === 'login' ? 'Need an account?' : 'Have an account?'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
