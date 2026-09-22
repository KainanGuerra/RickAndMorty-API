'use client';

import { LoginForm } from '@/components/LoginForm';
import { useLocale } from '@/i18n/LocaleProvider';

export default function LoginPage() {
  const { t } = useLocale();

  return (
    <div className="login-shell">
      <h1>{t('loginHeading')}</h1>
      <LoginForm />
    </div>
  );
}
