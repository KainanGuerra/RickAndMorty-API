import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EpisodeResults } from './EpisodeResults';

const characters = [
  { id: 1, name: 'Rick Sanchez', status: 'Alive', species: 'Human', image: 'rick.png' },
];

describe('EpisodeResults', () => {
  it('shows a prompt when no search has been made yet', () => {
    render(
      <EpisodeResults
        characters={null}
        error={null}
        loading={false}
        page={1}
        limit={10}
        total={0}
        onPageChange={vi.fn()}
      />,
    );
    expect(screen.getByText('Enter an episode number to see its characters.')).toBeInTheDocument();
  });

  it('shows an empty state when the search returns no characters', () => {
    render(
      <EpisodeResults
        characters={[]}
        error={null}
        loading={false}
        page={1}
        limit={10}
        total={0}
        onPageChange={vi.fn()}
      />,
    );
    expect(screen.getByText('No characters found.')).toBeInTheDocument();
  });

  it('does not render pagination when everything fits on one page', () => {
    render(
      <EpisodeResults
        characters={characters}
        error={null}
        loading={false}
        page={1}
        limit={10}
        total={1}
        onPageChange={vi.fn()}
      />,
    );
    expect(screen.queryByRole('navigation', { name: 'Pagination' })).not.toBeInTheDocument();
  });

  it('disables Previous on the first page and Next on the last page', () => {
    const { rerender } = render(
      <EpisodeResults
        characters={characters}
        error={null}
        loading={false}
        page={1}
        limit={10}
        total={25}
        onPageChange={vi.fn()}
      />,
    );
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next' })).not.toBeDisabled();

    rerender(
      <EpisodeResults
        characters={characters}
        error={null}
        loading={false}
        page={3}
        limit={10}
        total={25}
        onPageChange={vi.fn()}
      />,
    );
    expect(screen.getByRole('button', { name: 'Previous' })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });

  it('calls onPageChange with page + 1 / page - 1', async () => {
    const onPageChange = vi.fn();
    const user = userEvent.setup();
    render(
      <EpisodeResults
        characters={characters}
        error={null}
        loading={false}
        page={2}
        limit={10}
        total={25}
        onPageChange={onPageChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(onPageChange).toHaveBeenCalledWith(3);

    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('shows the error message instead of results when set', () => {
    render(
      <EpisodeResults
        characters={null}
        error="Episode 999 was not found"
        loading={false}
        page={1}
        limit={10}
        total={0}
        onPageChange={vi.fn()}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Episode 999 was not found');
  });
});
