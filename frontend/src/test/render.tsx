import { render, type RenderOptions, type RenderResult } from '@testing-library/react';
import type { ReactElement } from 'react';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { LocaleProvider } from '@/i18n/LocaleProvider';

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
): RenderResult {
  return render(ui, {
    wrapper: ({ children }) => (
      <ThemeProvider>
        <LocaleProvider>{children}</LocaleProvider>
      </ThemeProvider>
    ),
    ...options,
  });
}
