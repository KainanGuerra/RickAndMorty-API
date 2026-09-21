'use client';

import { useTheme } from '@/theme/ThemeProvider';
import { MoonIcon, SunIcon } from './Icons';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <span className={`theme-toggle-option${theme === 'dark' ? ' active' : ''}`}>
        <MoonIcon size={12} />
      </span>
      <span className={`theme-toggle-option${theme === 'light' ? ' active' : ''}`}>
        <SunIcon size={12} />
      </span>
    </button>
  );
}
