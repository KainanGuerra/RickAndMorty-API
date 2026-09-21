'use client';

import type { FormEvent } from 'react';

export type SortOrder = 'asc' | 'desc';

interface SidebarProps {
  episode: string;
  onEpisodeChange: (value: string) => void;
  name: string;
  onNameChange: (value: string) => void;
  sort: SortOrder;
  onSortChange: (value: SortOrder) => void;
  limit: number;
  onLimitChange: (value: number) => void;
  loading: boolean;
  onSubmit: () => void;
}

export function Sidebar({
  episode,
  onEpisodeChange,
  name,
  onNameChange,
  sort,
  onSortChange,
  limit,
  onLimitChange,
  loading,
  onSubmit,
}: SidebarProps) {
  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <aside className="sidebar">
      <form className="sidebar-form" onSubmit={handleSubmit}>
        <h2 className="sidebar-title">Search</h2>

        <label className="field">
          <span className="field-label">Episode number</span>
          <input
            aria-label="episode number"
            type="number"
            min={1}
            placeholder="e.g. 1"
            value={episode}
            onChange={(e) => onEpisodeChange(e.target.value)}
          />
        </label>

        <label className="field">
          <span className="field-label">Filter by name (contains)</span>
          <input
            aria-label="name filter"
            type="text"
            placeholder="e.g. rick"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
          />
        </label>

        <label className="field">
          <span className="field-label">Sort</span>
          <select
            aria-label="sort order"
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOrder)}
          >
            <option value="asc">A → Z</option>
            <option value="desc">Z → A</option>
          </select>
        </label>

        <label className="field">
          <span className="field-label">Per page</span>
          <select
            aria-label="results per page"
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </label>

        <button type="submit" className="btn-primary" disabled={loading || !episode}>
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>
    </aside>
  );
}
