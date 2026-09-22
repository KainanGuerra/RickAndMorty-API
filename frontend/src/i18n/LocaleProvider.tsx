'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { translations, type Locale, type TranslationKeys } from './translations';

const LOCALE_STORAGE_KEY = 'zrp-locale';

type TFunction = <K extends keyof TranslationKeys>(
  key: K,
  ...args: TranslationKeys[K] extends (params: infer P) => string ? [params: P] : []
) => string;

interface LocaleContextValue {
  locale: Locale;
  toggleLocale: () => void;
  t: TFunction;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function translate<K extends keyof TranslationKeys>(
  locale: Locale,
  key: K,
  args: unknown[],
): string {
  const entry = translations[locale][key];
  if (typeof entry === 'function') {
    return (entry as (params: unknown) => string)(args[0]);
  }
  return entry as string;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
      if (stored === 'en' || stored === 'pt') {
        setLocale(stored);
      }
    } catch {
      // ignore — storage may be unavailable
    }
  }, []);

  function toggleLocale() {
    const next: Locale = locale === 'en' ? 'pt' : 'en';
    setLocale(next);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      // ignore — storage may be unavailable
    }
  }

  const t: TFunction = (key, ...args) => translate(locale, key, args);

  return (
    <LocaleContext.Provider value={{ locale, toggleLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return ctx;
}
