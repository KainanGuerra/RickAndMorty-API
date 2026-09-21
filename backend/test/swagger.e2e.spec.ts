import { INestApplication, VersioningType } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';
import { EpisodesController } from '../src/episodes/episodes.controller';
import { EpisodesService } from '../src/episodes/episodes.service';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';

describe('Swagger document', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController, EpisodesController],
      providers: [
        { provide: AuthService, useValue: { register: vi.fn(), login: vi.fn() } },
        { provide: EpisodesService, useValue: { getCharacters: vi.fn() } },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('documents every route under the JWT-auth bearer scheme where required', () => {
    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('ZRP API')
        .setVersion('1.0')
        .addBearerAuth(
          { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
          'JWT-auth',
        )
        .build(),
    );

    expect(Object.keys(document.paths)).toEqual(
      expect.arrayContaining([
        '/api/v1/auth/register',
        '/api/v1/auth/login',
        '/api/v1/episodes/{number}/characters',
      ]),
    );

    expect(document.components?.securitySchemes?.['JWT-auth']).toBeDefined();

    const episodesGet = document.paths['/api/v1/episodes/{number}/characters'].get;
    expect(episodesGet?.security).toEqual(
      expect.arrayContaining([{ 'JWT-auth': [] }]),
    );

    const registerPost = document.paths['/api/v1/auth/register'].post;
    expect(registerPost?.security ?? []).toEqual([]);
  });
});
