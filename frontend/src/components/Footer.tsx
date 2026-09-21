import { ExternalLinkIcon, GitHubIcon } from './Icons';

export function Footer() {
  return (
    <footer className="app-footer">
      <span>ZRP Test — Rick and Morty episode lookup</span>
      <a
        href="https://github.com/KainanGuerra/RickAndMorty-API"
        target="_blank"
        rel="noopener noreferrer"
      >
        <GitHubIcon size={14} /> GitHub <ExternalLinkIcon size={11} />
      </a>
      <a href="https://rickandmortyapi.com" target="_blank" rel="noopener noreferrer">
        Rick and Morty API <ExternalLinkIcon size={11} />
      </a>
    </footer>
  );
}
