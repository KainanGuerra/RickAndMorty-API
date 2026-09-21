export const SESSION_COOKIE = 'zrp_session';

export function backendUrl(path: string): string {
  const base = process.env.BACKEND_URL ?? 'http://localhost:3001';
  return `${base}${path}`;
}

/**
 * Display-only decode of the JWT payload (no signature verification —
 * the backend re-validates the token on every real API call; this is
 * only used to show the signed-in user's email in the header).
 */
export function decodeSessionEmail(token: string): string | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const json = Buffer.from(payload, 'base64url').toString('utf8');
    const data = JSON.parse(json) as { email?: string };
    return data.email ?? null;
  } catch {
    return null;
  }
}
