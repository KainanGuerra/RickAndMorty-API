'use client';

import { useTheme } from '@/theme/ThemeProvider';
import { useLocale } from '@/i18n/LocaleProvider';
import { MoonIcon, SunIcon } from './Icons';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLocale();

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? t('switchToLightMode') : t('switchToDarkMode')}
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
