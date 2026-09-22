import type { TFunction } from '@/i18n/LocaleProvider';

interface KnownMessage {
  pattern: RegExp;
  translate: (t: TFunction, match: RegExpMatchArray) => string;
}

const KNOWN_MESSAGES: KnownMessage[] = [
  { pattern: /^Invalid credentials$/, translate: (t) => t('invalidCredentials') },
  { pattern: /^Email is already registered$/, translate: (t) => t('emailAlreadyRegistered') },
  { pattern: /^email must be an email$/, translate: (t) => t('invalidEmailFormat') },
  {
    pattern: /^password must contain at least one uppercase letter/,
    translate: (t) => t('passwordPolicyError'),
  },
  {
    pattern: /^password must be longer than or equal to \d+ characters$/,
    translate: (t) => t('passwordPolicyError'),
  },
  {
    pattern: /^Episode (\d+) was not found$/,
    translate: (t, match) => t('episodeNotFoundError', { number: match[1] }),
  },
];

function translateOne(message: string, t: TFunction): string {
  const known = KNOWN_MESSAGES.find(({ pattern }) => pattern.test(message));
  return known ? known.translate(t, message.match(known.pattern)!) : message;
}

/**
 * Translates a NestJS error response's `message` (a plain string, or an
 * array when class-validator reports multiple constraint violations at
 * once) into user-facing text. Known messages are mapped to the current
 * locale; anything unrecognized falls back to the backend's raw text
 * rather than throwing, since the backend has no i18n of its own.
 */
export function translateApiError(message: unknown, t: TFunction, fallback: string): string {
  if (Array.isArray(message)) {
    const parts = message.filter((m): m is string => typeof m === 'string' && m.length > 0);
    if (parts.length === 0) return fallback;
    return parts.map((part) => translateOne(part, t)).join(' ');
  }
  if (typeof message === 'string' && message) {
    return translateOne(message, t);
  }
  return fallback;
}
