export const SESSION_COOKIE = 'zrp_session';

export function backendUrl(path: string): string {
  const base = process.env.BACKEND_URL ?? 'http://localhost:3001';
  return `${base}${path}`;
}
