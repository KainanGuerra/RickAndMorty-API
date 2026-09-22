'use client';

import { useLocale } from '@/i18n/LocaleProvider';

export function LocaleToggle() {
  const { locale, toggleLocale, t } = useLocale();

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleLocale}
      aria-label={locale === 'en' ? t('switchToPortuguese') : t('switchToEnglish')}
    >
      <span className={`theme-toggle-option${locale === 'en' ? ' active' : ''}`}>EN</span>
      <span className={`theme-toggle-option${locale === 'pt' ? ' active' : ''}`}>PT</span>
    </button>
  );
}
