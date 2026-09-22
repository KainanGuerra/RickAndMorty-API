'use client';

import { useLocale } from '@/i18n/LocaleProvider';

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
}

interface EpisodeResultsProps {
  characters: Character[] | null;
  error: string | null;
  loading: boolean;
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function EpisodeResults({
  characters,
  error,
  loading,
  page,
  limit,
  total,
  onPageChange,
}: EpisodeResultsProps) {
  const { t } = useLocale();
  const totalPages = limit > 0 ? Math.max(1, Math.ceil(total / limit)) : 1;
  const hasResults = characters !== null;

  return (
    <section className="results">
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      {!error && loading && <p className="results-status">{t('loading')}</p>}

      {!error && !loading && hasResults && characters!.length === 0 && (
        <p className="results-status">{t('noCharactersFound')}</p>
      )}

      {!error && hasResults && characters!.length > 0 && (
        <>
          <p className="results-count">{t('resultsCount', { total })}</p>
          <ul className="character-grid">
            {characters!.map((character) => (
              <li key={character.id} className="character-card">
                <img src={character.image} alt={character.name} />
                <div>
                  <strong>{character.name}</strong>
                  <div className="character-meta">
                    {character.species} · {character.status}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <nav className="pagination" aria-label={t('pagination')}>
              <button type="button" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
                {t('previous')}
              </button>
              <span className="pagination-status">{t('pageStatus', { page, totalPages })}</span>
              <button
                type="button"
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
              >
                {t('next')}
              </button>
            </nav>
          )}
        </>
      )}

      {!error && !hasResults && !loading && (
        <p className="results-status">{t('enterEpisodePrompt')}</p>
      )}
    </section>
  );
}
