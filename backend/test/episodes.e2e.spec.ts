import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { ConfigService } from '@nestjs/config';
import { EpisodesController } from '../src/episodes/episodes.controller';
import { EpisodesService } from '../src/episodes/episodes.service';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { JwtStrategy } from '../src/auth/strategies/jwt.strategy';

describe('EpisodesController (e2e)', () => {
  let app: INestApplication;
  const episodesService = {
    getCharacters: vi.fn().mockResolvedValue({
      episodeNumber: 1,
      total: 1,
      page: 1,
      limit: 1,
      data: [{ id: 1, name: 'Rick Sanchez', status: 'Alive', species: 'Human', image: '' }],
    }),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [EpisodesController],
      providers: [{ provide: EpisodesService, useValue: episodesService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('serves the versioned, prefixed route when authenticated', async () => {
    const response = await request(app.getHttpServer()).get(
      '/api/v1/episodes/1/characters?sort=asc',
    );

    expect(response.status).toBe(200);
    expect(response.body.data[0].name).toBe('Rick Sanchez');
    expect(episodesService.getCharacters).toHaveBeenCalledWith(1, {
      sort: 'asc',
    });
  });
});

describe('EpisodesController (e2e) — unauthenticated', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [EpisodesController],
      providers: [
        {
          provide: EpisodesService,
          useValue: { getCharacters: vi.fn() },
        },
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: { get: vi.fn().mockReturnValue('test-secret') },
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('rejects requests without a valid JWT', async () => {
    const response = await request(app.getHttpServer()).get(
      '/api/v1/episodes/1/characters',
    );

    expect(response.status).toBe(401);
  });
});
