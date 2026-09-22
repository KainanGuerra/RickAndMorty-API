'use client';

import { useState } from 'react';
import { useLocale } from '@/i18n/LocaleProvider';
import { translateApiError } from '@/lib/apiErrors';
import { Sidebar, type SortOrder } from './Sidebar';
import { EpisodeResults } from './EpisodeResults';

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
}

interface CharactersResponse {
  data: Character[];
  total: number;
  page: number;
  limit: number;
}

interface SearchParams {
  episode: string;
  name: string;
  sort: SortOrder;
  limit: number;
  page: number;
}

export function EpisodeSearch() {
  const { t } = useLocale();
  const [episode, setEpisode] = useState('');
  const [name, setName] = useState('');
  const [sort, setSort] = useState<SortOrder>('asc');
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const [characters, setCharacters] = useState<Character[] | null>(null);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function runSearch(params: SearchParams) {
    if (!params.episode) return;
    setLoading(true);
    setError(null);

    const query = new URLSearchParams({
      sort: params.sort,
      page: String(params.page),
      limit: String(params.limit),
    });
    if (params.name) query.set('name', params.name);

    try {
      const response = await fetch(`/api/episodes/${params.episode}?${query.toString()}`);
      const body: CharactersResponse | { message?: string } = await response.json();

      if (!response.ok) {
        const message = 'message' in body ? body.message : undefined;
        setError(translateApiError(message, t, t('couldNotLoadCharacters')));
        setCharacters(null);
        setTotal(0);
        return;
      }

      const success = body as CharactersResponse;
      setCharacters(success.data);
      setTotal(success.total);
      setPage(success.page);
    } catch {
      setError(t('couldNotReachServer'));
      setCharacters(null);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit() {
    setPage(1);
    void runSearch({ episode, name, sort, limit, page: 1 });
  }

  function handleSortChange(nextSort: SortOrder) {
    setSort(nextSort);
    if (episode && characters) {
      setPage(1);
      void runSearch({ episode, name, sort: nextSort, limit, page: 1 });
    }
  }

  function handleLimitChange(nextLimit: number) {
    setLimit(nextLimit);
    if (episode && characters) {
      setPage(1);
      void runSearch({ episode, name, sort, limit: nextLimit, page: 1 });
    }
  }

  function handlePageChange(nextPage: number) {
    setPage(nextPage);
    void runSearch({ episode, name, sort, limit, page: nextPage });
  }

  return (
    <div className="page-content">
      <h1 className="page-title">{t('pageTitle')}</h1>
      <div className="search-shell">
        <Sidebar
          episode={episode}
          onEpisodeChange={setEpisode}
          name={name}
          onNameChange={setName}
          sort={sort}
          onSortChange={handleSortChange}
          limit={limit}
          onLimitChange={handleLimitChange}
          loading={loading}
          onSubmit={handleSubmit}
        />
        <EpisodeResults
          characters={characters}
          error={error}
          loading={loading}
          page={page}
          limit={limit}
          total={total}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
