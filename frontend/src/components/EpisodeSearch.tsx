'use client';

import { useState, type FormEvent } from 'react';

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
}

export function EpisodeSearch() {
  const [episode, setEpisode] = useState('');
  const [sort, setSort] = useState<'asc' | 'desc'>('asc');
  const [characters, setCharacters] = useState<Character[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function search(episodeNumber: string, sortOrder: 'asc' | 'desc') {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/episodes/${episodeNumber}?sort=${sortOrder}`,
      );
      const body: CharactersResponse | { message?: string } = await response.json();

      if (!response.ok) {
        setError(('message' in body && body.message) || 'Could not load characters');
        setCharacters(null);
        return;
      }

      setCharacters((body as CharactersResponse).data);
    } catch {
      setError('Could not reach the server');
      setCharacters(null);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!episode) return;
    void search(episode, sort);
  }

  function handleSortChange(nextSort: 'asc' | 'desc') {
    setSort(nextSort);
    if (episode && characters) {
      void search(episode, nextSort);
    }
  }

  return (
    <main>
      <h1>Rick and Morty — episode characters</h1>
      <form onSubmit={handleSubmit}>
        <input
          aria-label="episode number"
          type="number"
          min={1}
          placeholder="episode number"
          value={episode}
          onChange={(e) => setEpisode(e.target.value)}
        />
        <select
          aria-label="sort order"
          value={sort}
          onChange={(e) => handleSortChange(e.target.value as 'asc' | 'desc')}
        >
          <option value="asc">A → Z</option>
          <option value="desc">Z → A</option>
        </select>
        <button type="submit" disabled={loading || !episode}>
          {loading ? 'Loading…' : 'Search'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {characters && (
        <ul>
          {characters.map((character) => (
            <li key={character.id}>
              <img src={character.image} alt={character.name} />
              <div>
                <strong>{character.name}</strong>
                <div>
                  {character.species} · {character.status}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {characters && characters.length === 0 && <p>No characters found.</p>}
    </main>
  );
}
