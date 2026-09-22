'use client';

import type { FormEvent } from 'react';
import { useLocale } from '@/i18n/LocaleProvider';

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
  const { t } = useLocale();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <aside className="sidebar">
      <form className="sidebar-form" onSubmit={handleSubmit}>
        <h2 className="sidebar-title">{t('sidebarTitle')}</h2>

        <label className="field">
          <span className="field-label">{t('episodeNumberLabel')}</span>
          <input
            aria-label={t('episodeNumberAriaLabel')}
            type="number"
            min={1}
            placeholder={t('episodeNumberPlaceholder')}
            value={episode}
            onChange={(e) => onEpisodeChange(e.target.value)}
          />
        </label>

        <label className="field">
          <span className="field-label">{t('nameFilterLabel')}</span>
          <input
            aria-label={t('nameFilterAriaLabel')}
            type="text"
            placeholder={t('nameFilterPlaceholder')}
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
          />
        </label>

        <label className="field">
          <span className="field-label">{t('sortLabel')}</span>
          <select
            aria-label={t('sortAriaLabel')}
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOrder)}
          >
            <option value="asc">{t('sortAsc')}</option>
            <option value="desc">{t('sortDesc')}</option>
          </select>
        </label>

        <label className="field">
          <span className="field-label">{t('perPageLabel')}</span>
          <select
            aria-label={t('perPageAriaLabel')}
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
          {loading ? t('searching') : t('search')}
        </button>
      </form>
    </aside>
  );
}
