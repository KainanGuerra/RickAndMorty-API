import { describe, expect, it } from 'vitest';
import { translations, type Locale, type TranslationKeys } from '@/i18n/translations';
import type { TFunction } from '@/i18n/LocaleProvider';
import { translateApiError } from './apiErrors';

function makeT(locale: Locale): TFunction {
  return ((key: keyof TranslationKeys, ...args: unknown[]) => {
    const entry = translations[locale][key];
    return typeof entry === 'function'
      ? (entry as (params: unknown) => string)(args[0])
      : (entry as string);
  }) as TFunction;
}

describe('translateApiError', () => {
  const t = makeT('en');
  const tPt = makeT('pt');

  it('translates a known single-string message', () => {
    expect(translateApiError('Invalid credentials', t, 'fallback')).toBe('Invalid credentials');
    expect(translateApiError('Invalid credentials', tPt, 'fallback')).toBe('Credenciais inválidas');
  });

  it('translates the episode-not-found message with its number substituted', () => {
    expect(translateApiError('Episode 999 was not found', t, 'fallback')).toBe(
      'Episode 999 was not found',
    );
    expect(translateApiError('Episode 999 was not found', tPt, 'fallback')).toBe(
      'Episódio 999 não foi encontrado',
    );
  });

  it('joins an array of distinct known messages with a separator instead of mashing them together', () => {
    const result = translateApiError(
      ['email must be an email', 'Invalid credentials'],
      t,
      'fallback',
    );
    expect(result).toBe('Enter a valid email address Invalid credentials');
    // the bug this guards against: no separator at all between the two messages
    expect(result).not.toContain('addressInvalid');
  });

  it('falls back to the raw backend text for an unrecognized message', () => {
    expect(translateApiError('Something the backend invented', t, 'fallback')).toBe(
      'Something the backend invented',
    );
  });

  it('uses the fallback for an empty or missing message', () => {
    expect(translateApiError(undefined, t, 'fallback')).toBe('fallback');
    expect(translateApiError([], t, 'fallback')).toBe('fallback');
    expect(translateApiError('', t, 'fallback')).toBe('fallback');
  });
});
