import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { LOCALE_STORAGE_KEY } from '@/i18n/LocaleProvider';
import { LocaleToggle } from './LocaleToggle';
import { Sidebar } from './Sidebar';

describe('LocaleToggle', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('toggles the active segment and persists the choice', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LocaleToggle />);

    expect(screen.getByRole('button', { name: /switch to portuguese/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /switch to portuguese/i }));

    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('pt');
    expect(screen.getByRole('button', { name: /switch to english/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /switch to english/i }));

    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('en');
  });

  it('actually changes translated text elsewhere in the tree', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <>
        <LocaleToggle />
        <Sidebar
          episode=""
          onEpisodeChange={() => {}}
          name=""
          onNameChange={() => {}}
          sort="asc"
          onSortChange={() => {}}
          limit={10}
          onLimitChange={() => {}}
          loading={false}
          onSubmit={() => {}}
        />
      </>,
    );

    expect(screen.getByRole('heading', { name: 'Search' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /switch to portuguese/i }));

    expect(screen.getByRole('heading', { name: 'Buscar' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Search' })).not.toBeInTheDocument();
  });
});
