import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { LoginForm } from './LoginForm';

const push = vi.fn();
const refresh = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, refresh }),
}));

function jsonResponse(body: unknown, ok = true) {
  return { ok, json: async () => body } as Response;
}

describe('LoginForm', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    push.mockClear();
    refresh.mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('logs in and redirects home on success', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(jsonResponse({ ok: true }));
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);

    await user.type(screen.getByPlaceholderText('email'), 'person@example.com');
    await user.type(screen.getByPlaceholderText('password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Log in' }));

    await waitFor(() => expect(push).toHaveBeenCalledWith('/'));
    expect(fetch).toHaveBeenCalledWith(
      '/api/auth/login',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('shows the backend error message on invalid credentials', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      jsonResponse({ message: 'Invalid credentials' }, false),
    );
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);

    await user.type(screen.getByPlaceholderText('email'), 'person@example.com');
    await user.type(screen.getByPlaceholderText('password'), 'wrong-password');
    await user.click(screen.getByRole('button', { name: 'Log in' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
    expect(push).not.toHaveBeenCalled();
  });

  it('switches to register mode — heading and submit button update, and posts to /api/auth/register', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(jsonResponse({ id: '1' }));
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);

    expect(screen.getByRole('heading', { name: 'Log in' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: "Don't have an account? Register" }));

    expect(screen.getByRole('heading', { name: 'Register' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Already have an account? Log in' })).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText('email'), 'new@example.com');
    await user.type(screen.getByPlaceholderText('password'), 'Password123!');
    await user.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/auth/register',
        expect.objectContaining({ method: 'POST' }),
      );
    });
    expect(screen.getByText(/Account created/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Log in' })).toBeInTheDocument();
  });

  it('toggles the password field between hidden and visible', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);

    const passwordInput = screen.getByPlaceholderText('password');
    expect(passwordInput).toHaveAttribute('type', 'password');

    await user.click(screen.getByRole('button', { name: 'Show password' }));
    expect(passwordInput).toHaveAttribute('type', 'text');

    await user.click(screen.getByRole('button', { name: 'Hide password' }));
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('shows a live password-requirements checklist in register mode and blocks a weak submit', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);

    await user.click(screen.getByRole('button', { name: "Don't have an account? Register" }));

    expect(screen.getByText('At least 8 characters')).toBeInTheDocument();
    expect(screen.getByText('One uppercase letter')).toBeInTheDocument();
    const submit = screen.getByRole('button', { name: 'Register' });
    expect(submit).toBeDisabled();

    await user.type(screen.getByPlaceholderText('email'), 'weak@example.com');
    await user.type(screen.getByPlaceholderText('password'), 'weakpassword');
    expect(submit).toBeDisabled();
    expect(fetch).not.toHaveBeenCalled();

    await user.type(screen.getByPlaceholderText('password'), 'W1!');
    expect(submit).not.toBeDisabled();
  });

  it('translates a known backend error (email already registered)', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      jsonResponse({ message: 'Email is already registered' }, false),
    );
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);

    await user.click(screen.getByRole('button', { name: "Don't have an account? Register" }));
    await user.type(screen.getByPlaceholderText('email'), 'taken@example.com');
    await user.type(screen.getByPlaceholderText('password'), 'Password123!');
    await user.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(screen.getByText('Email is already registered')).toBeInTheDocument();
    });
  });
});
