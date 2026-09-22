import { cookies } from 'next/headers';
import Link from 'next/link';
import { decodeSessionEmail, SESSION_COOKIE } from '@/lib/session';
import { PortalIcon } from './Icons';
import { ThemeToggle } from './ThemeToggle';
import { LocaleToggle } from './LocaleToggle';
import { HeaderMenu } from './HeaderMenu';

export function Header() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const email = token ? decodeSessionEmail(token) : null;

  return (
    <header className="app-header">
      <Link href="/" className="brand">
        <span className="brand-mark" aria-hidden>
          <PortalIcon size={22} />
        </span>
        <span className="brand-word">
          Rick<span className="brand-accent">&amp;</span>Morty{' '}
          <span className="brand-sub">API</span>
        </span>
      </Link>

      <div className="header-actions">
        <LocaleToggle />
        <ThemeToggle />
        {email && <HeaderMenu email={email} />}
      </div>
    </header>
  );
}
