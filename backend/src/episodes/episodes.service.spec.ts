import { NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { of, throwError } from 'rxjs';
import { AxiosError, AxiosHeaders } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EpisodesService } from './episodes.service';
import { EpisodeCache } from './entities/episode-cache.entity';

function axiosResponse<T>(data: T) {
  return {
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: { headers: new AxiosHeaders() },
  };
}

describe('EpisodesService', () => {
  let service: EpisodesService;
  let cache: { findOne: ReturnType<typeof vi.fn>; save: ReturnType<typeof vi.fn>; create: ReturnType<typeof vi.fn> };
  let http: { get: ReturnType<typeof vi.fn> };

  const rawCharacters = [
    { id: 1, name: 'Rick Sanchez', status: 'Alive', species: 'Human', image: 'rick.png' },
    { id: 2, name: 'Morty Smith', status: 'Alive', species: 'Human', image: 'morty.png' },
    { id: 3, name: 'Summer Smith', status: 'Alive', species: 'Human', image: 'summer.png' },
  ];

  beforeEach(() => {
    cache = {
      findOne: vi.fn(),
      save: vi.fn().mockResolvedValue(undefined),
      create: vi.fn((entity) => entity as EpisodeCache),
    };
    http = { get: vi.fn() };

    const config = { get: vi.fn().mockReturnValue('https://rickandmortyapi.com/api') };

    service = new EpisodesService(
      cache as unknown as Repository<EpisodeCache>,
      http as unknown as HttpService,
      config as unknown as ConfigService,
    );
  });

  it('fetches, caches and returns sorted characters on a cache miss', async () => {
    (cache.findOne as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    (http.get as ReturnType<typeof vi.fn>)
      .mockReturnValueOnce(
        of(axiosResponse({ id: 1, characters: ['/character/1', '/character/2', '/character/3'] })),
      )
      .mockReturnValueOnce(of(axiosResponse(rawCharacters)));

    const result = await service.getCharacters(1, { sort: 'asc' });

    expect(result.data.map((c) => c.name)).toEqual([
      'Morty Smith',
      'Rick Sanchez',
      'Summer Smith',
    ]);
    expect(cache.save).toHaveBeenCalledOnce();
  });

  it('reuses cached characters without calling the external API', async () => {
    (cache.findOne as ReturnType<typeof vi.fn>).mockResolvedValue({
      episodeNumber: 1,
      characters: rawCharacters,
    } as EpisodeCache);

    const result = await service.getCharacters(1, { sort: 'desc' });

    expect(http.get).not.toHaveBeenCalled();
    expect(result.data.map((c) => c.name)).toEqual([
      'Summer Smith',
      'Rick Sanchez',
      'Morty Smith',
    ]);
  });

  it('filters by name and paginates the result', async () => {
    (cache.findOne as ReturnType<typeof vi.fn>).mockResolvedValue({
      episodeNumber: 1,
      characters: rawCharacters,
    } as EpisodeCache);

    const result = await service.getCharacters(1, {
      sort: 'asc',
      name: 'sm',
      page: 1,
      limit: 1,
    });

    expect(result.total).toBe(2); // Morty Smith, Summer Smith
    expect(result.data).toHaveLength(1);
    expect(result.data[0].name).toBe('Morty Smith');
  });

  it('throws NotFoundException when the episode does not exist', async () => {
    (cache.findOne as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    const error = new AxiosError('Not Found');
    error.response = axiosResponse({ error: 'not found' }) as never;
    (error.response as { status: number }).status = 404;
    (http.get as ReturnType<typeof vi.fn>).mockReturnValueOnce(throwError(() => error));

    await expect(service.getCharacters(9999, { sort: 'asc' })).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
