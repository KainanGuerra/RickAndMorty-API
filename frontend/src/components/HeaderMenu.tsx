'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/i18n/LocaleProvider';
import { ExternalLinkIcon, LogOutIcon } from './Icons';

export function HeaderMenu({ email }: { email: string }) {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { t } = useLocale();

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <div className="header-menu" ref={ref}>
      <button
        type="button"
        className="header-menu-trigger"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span className="header-menu-avatar" aria-hidden>
          {email.charAt(0).toUpperCase()}
        </span>
        <span className="header-menu-email">{email}</span>
      </button>

      {open && (
        <div className="header-dropdown card">
          <p className="header-dropdown-email">{email}</p>
          <a
            href="http://localhost:3001/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="header-dropdown-link"
          >
            {t('apiDocs')} <ExternalLinkIcon />
          </a>
          <button
            type="button"
            className="header-dropdown-logout"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            <LogOutIcon size={14} /> {loggingOut ? t('loggingOut') : t('logout')}
          </button>
        </div>
      )}
    </div>
  );
}
