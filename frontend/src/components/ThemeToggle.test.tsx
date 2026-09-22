import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { THEME_STORAGE_KEY } from '@/theme/theme-init-script';
import { renderWithProviders } from '@/test/render';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  beforeEach(() => {
    document.documentElement.dataset.theme = 'dark';
    localStorage.clear();
  });

  afterEach(() => {
    delete document.documentElement.dataset.theme;
    localStorage.clear();
  });

  it('toggles the document theme and persists the choice', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ThemeToggle />);

    expect(document.documentElement.dataset.theme).toBe('dark');

    await user.click(screen.getByRole('button', { name: /switch to light mode/i }));

    expect(document.documentElement.dataset.theme).toBe('light');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');

    await user.click(screen.getByRole('button', { name: /switch to dark mode/i }));

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
  });
});
