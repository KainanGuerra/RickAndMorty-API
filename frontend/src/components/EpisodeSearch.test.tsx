import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EpisodeSearch } from './EpisodeSearch';

const ascCharacters = [
  { id: 2, name: 'Morty Smith', status: 'Alive', species: 'Human', image: 'morty.png' },
  { id: 1, name: 'Rick Sanchez', status: 'Alive', species: 'Human', image: 'rick.png' },
];
const descCharacters = [...ascCharacters].reverse();

function jsonResponse(body: unknown, ok = true) {
  return { ok, json: async () => body } as Response;
}

describe('EpisodeSearch', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fetches and renders characters for the entered episode, sorted A→Z by default', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      jsonResponse({ data: ascCharacters, total: 2 }),
    );

    const user = userEvent.setup();
    render(<EpisodeSearch />);

    await user.type(screen.getByLabelText('episode number'), '1');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(screen.getByText('Morty Smith')).toBeInTheDocument();
    });
    expect(fetch).toHaveBeenCalledWith('/api/episodes/1?sort=asc');

    const names = screen.getAllByRole('listitem').map((item) => item.textContent);
    expect(names[0]).toContain('Morty Smith');
    expect(names[1]).toContain('Rick Sanchez');
  });

  it('re-fetches in the new order when the sort toggle changes', async () => {
    (fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce(jsonResponse({ data: ascCharacters, total: 2 }))
      .mockResolvedValueOnce(jsonResponse({ data: descCharacters, total: 2 }));

    const user = userEvent.setup();
    render(<EpisodeSearch />);

    await user.type(screen.getByLabelText('episode number'), '1');
    await user.click(screen.getByRole('button', { name: 'Search' }));
    await waitFor(() => expect(screen.getByText('Morty Smith')).toBeInTheDocument());

    await user.selectOptions(screen.getByLabelText('sort order'), 'desc');

    await waitFor(() => {
      expect(fetch).toHaveBeenLastCalledWith('/api/episodes/1?sort=desc');
    });
    const names = screen.getAllByRole('listitem').map((item) => item.textContent);
    expect(names[0]).toContain('Rick Sanchez');
  });

  it('shows an error message when the lookup fails', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      jsonResponse({ message: 'Episode 999 was not found' }, false),
    );

    const user = userEvent.setup();
    render(<EpisodeSearch />);

    await user.type(screen.getByLabelText('episode number'), '999');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(screen.getByText('Episode 999 was not found')).toBeInTheDocument();
    });
  });
});
