'use client';

import { useLocale } from '@/i18n/LocaleProvider';
import { ExternalLinkIcon, GitHubIcon, LinkedInIcon } from './Icons';

export function Footer() {
  const { t } = useLocale();

  return (
    <footer className="app-footer">
      <span>Made by Kainan Guerra</span>
      <a
        href="https://www.linkedin.com/in/kainan-guerra"
        target="_blank"
        rel="noopener noreferrer"
      >
        <LinkedInIcon size={14} /> LinkedIn <ExternalLinkIcon size={11} />
      </a>
      <a
        href="https://github.com/KainanGuerra/RickAndMorty-API"
        target="_blank"
        rel="noopener noreferrer"
      >
        <GitHubIcon size={14} /> {t('footerGitHub')} <ExternalLinkIcon size={11} />
      </a>
      <a href="https://rickandmortyapi.com" target="_blank" rel="noopener noreferrer">
        {t('footerRickAndMortyApi')} <ExternalLinkIcon size={11} />
      </a>
    </footer>
  );
}
