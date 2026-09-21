# Architecture

## Modules

**backend/** — NestJS modular monolith, prefixed `/api`, URI-versioned
(`/api/v1/...`).

- `auth` — registration, login, password hashing (bcryptjs), JWT issuance
  (`@nestjs/jwt`), a Passport JWT strategy, and the `JwtAuthGuard` used to
  protect other modules' routes.
- `episodes` — the core feature. `GET /api/v1/episodes/:number/characters`
  is guarded by `JwtAuthGuard`. Query params: `sort` (`asc`|`desc`), `name`
  (substring filter), `page`/`limit` (pagination).
- `database` — TypeORM + Postgres wiring and checked-in migrations
  (`src/database/migrations`), run automatically on backend startup.

**frontend/** — Next.js (App Router).

- `/login` — email/password form (`LoginForm`), toggles between login and
  register, posts to Route Handlers that proxy the backend.
- `/` — episode search (`EpisodeSearch`), protected by `middleware.ts`
  (redirects to `/login` when no session cookie is present).
- `app/api/*` — Route Handlers that hold the backend URL and JWT server-side:
  `auth/login` sets an httpOnly session cookie, `auth/register` and
  `auth/logout` proxy directly, `episodes/[number]` attaches the
  `Authorization: Bearer` header from the cookie before calling the backend.
  The JWT never reaches client-side JavaScript.

## Request flow

1. User registers/logs in on `/login` → Route Handler calls the backend →
   backend returns a JWT → Route Handler stores it in an httpOnly cookie.
2. User submits an episode number on `/` → client calls
   `/api/episodes/:number` → Route Handler reads the cookie, calls the
   backend with `Authorization: Bearer <jwt>`.
3. Backend `EpisodesService` checks `episode_cache` in Postgres for that
   episode number. On a miss, it calls the Rick and Morty API for the
   episode's character URLs, fetches each character, and persists the
   result to `episode_cache` before returning it.
4. The service applies the `name` filter, sorts by `name` (`sort`),
   paginates (`page`/`limit`), and returns the page. The frontend renders
   the character list.

## Why Postgres backs both concerns

A single Postgres instance holds two unrelated tables rather than two
databases, since both are small and owned by the same monolith:

- `users` — auth module's source of truth for credentials.
- `episode_cache` — a cache of episode → character-list lookups, so a
  repeated request for the same episode doesn't re-hit the external API.

## Docker images

Each project has its own multi-stage `Dockerfile`. `docker-compose.yml` at
the repo root builds both locally by default. `.github/workflows/docker-publish.yml`
additionally builds and pushes both images to GHCR
(`ghcr.io/<owner>/<repo>-backend` and `-frontend`) on every push to `main`,
after the test suite passes.
