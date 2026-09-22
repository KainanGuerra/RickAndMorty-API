import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { HeaderMenu } from './HeaderMenu';

const push = vi.fn();
const refresh = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, refresh }),
}));

describe('HeaderMenu', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) }));
    push.mockClear();
    refresh.mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('opens the dropdown on click and closes it on an outside click', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <div>
        <HeaderMenu email="person@example.com" />
        <button type="button">outside</button>
      </div>,
    );

    expect(screen.queryByText('API docs')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /person@example\.com/i }));
    expect(screen.getByText('API docs')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'outside' }));
    expect(screen.queryByText('API docs')).not.toBeInTheDocument();
  });

  it('logs out and redirects to /login', async () => {
    const user = userEvent.setup();
    renderWithProviders(<HeaderMenu email="person@example.com" />);

    await user.click(screen.getByRole('button', { name: /person@example\.com/i }));
    await user.click(screen.getByRole('button', { name: /logout/i }));

    expect(fetch).toHaveBeenCalledWith('/api/auth/logout', { method: 'POST' });
    expect(push).toHaveBeenCalledWith('/login');
    expect(refresh).toHaveBeenCalled();
  });
});
