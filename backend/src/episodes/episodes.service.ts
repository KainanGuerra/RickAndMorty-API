import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { CachedCharacter, EpisodeCache } from './entities/episode-cache.entity';
import { QueryCharactersDto } from './dto/query-characters.dto';

interface RickAndMortyEpisode {
  id: number;
  characters: string[];
}

interface RickAndMortyCharacter {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
}

export interface PaginatedCharacters {
  episodeNumber: number;
  total: number;
  page: number;
  limit: number;
  data: CachedCharacter[];
}

@Injectable()
export class EpisodesService {
  private readonly baseUrl: string;

  constructor(
    @InjectRepository(EpisodeCache)
    private readonly episodeCache: Repository<EpisodeCache>,
    private readonly http: HttpService,
    config: ConfigService,
  ) {
    this.baseUrl = config.get<string>('rickAndMortyApiUrl')!;
  }

  async getCharacters(
    episodeNumber: number,
    query: QueryCharactersDto,
  ): Promise<PaginatedCharacters> {
    const characters = await this.getCharactersForEpisode(episodeNumber);

    const filtered = query.name
      ? characters.filter((character) =>
          character.name.toLowerCase().includes(query.name!.toLowerCase()),
        )
      : characters;

    const sorted = [...filtered].sort((a, b) =>
      query.sort === 'desc'
        ? b.name.localeCompare(a.name)
        : a.name.localeCompare(b.name),
    );

    const page = query.page ?? 1;
    const limit = query.limit ?? (sorted.length || 1);
    const start = (page - 1) * limit;
    const data = sorted.slice(start, start + limit);

    return {
      episodeNumber,
      total: sorted.length,
      page,
      limit,
      data,
    };
  }

  private async getCharactersForEpisode(
    episodeNumber: number,
  ): Promise<CachedCharacter[]> {
    const cached = await this.episodeCache.findOne({
      where: { episodeNumber },
    });
    if (cached) {
      return cached.characters;
    }

    const episode = await this.fetchEpisode(episodeNumber);
    const characters = await this.fetchCharacters(episode.characters);

    await this.episodeCache.save(
      this.episodeCache.create({ episodeNumber, characters }),
    );

    return characters;
  }

  private async fetchEpisode(episodeNumber: number): Promise<RickAndMortyEpisode> {
    try {
      const { data } = await firstValueFrom(
        this.http.get<RickAndMortyEpisode>(`${this.baseUrl}/episode/${episodeNumber}`),
      );
      return data;
    } catch (error) {
      if ((error as AxiosError).response?.status === 404) {
        throw new NotFoundException(`Episode ${episodeNumber} was not found`);
      }
      throw error;
    }
  }

  private async fetchCharacters(urls: string[]): Promise<CachedCharacter[]> {
    if (urls.length === 0) {
      return [];
    }

    const { data } = await firstValueFrom(
      this.http.get<RickAndMortyCharacter[]>(
        `${this.baseUrl}/character/${urls.map((url) => url.split('/').pop()).join(',')}`,
      ),
    );

    const list = Array.isArray(data) ? data : [data];
    return list.map(({ id, name, status, species, image }) => ({
      id,
      name,
      status,
      species,
      image,
    }));
  }
}
