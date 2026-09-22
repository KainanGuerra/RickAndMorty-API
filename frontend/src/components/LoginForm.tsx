'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/i18n/LocaleProvider';

type Mode = 'login' | 'register';

export function LoginForm() {
  const router = useRouter();
  const { t } = useLocale();
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
        setError(data.message ?? t('somethingWentWrong'));
        return;
      }

      if (mode === 'register') {
        setMode('login');
        setError(t('registerSuccess'));
        return;
      }

      router.push('/');
      router.refresh();
    } catch {
      setError(t('couldNotReachServer'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="login-form"
      onSubmit={handleSubmit}
      aria-label={mode === 'login' ? t('logIn') : t('register')}
    >
      <input
        type="email"
        placeholder={t('emailPlaceholder')}
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder={t('passwordPlaceholder')}
        autoComplete={
          mode === 'login'
            ? 'current-password'
            : 'new-password'
        }
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={8}
      />
      <button type="submit" className="btn-primary" disabled={loading}>
        {mode === 'login' ? t('logIn') : t('register')}
      </button>
      <button
        type="button"
        className="btn-link"
        onClick={() => {
          setError(null);
          setMode(mode === 'login' ? 'register' : 'login');
        }}
      >
        {mode === 'login' ? t('needAnAccount') : t('haveAnAccount')}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
