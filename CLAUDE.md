# Rick and Morty API

## Overview

A small full-stack app that looks up Rick and Morty episode characters. A user
enters an episode number; the app calls the [Rick and Morty
API](https://rickandmortyapi.com/documentation#rest) and displays every
character present in that episode, sorted alphabetically (ascending or
descending).

## Requirements

- A page with a single input for an episode number.
- On submit, fetch all characters present in that episode via the API.
- Display the results sorted alphabetically by name (ASC/DESC toggle).
- Deliverable: a public repo plus the app running locally via Docker.

## Architecture

Modular monolith split into two top-level projects, each with its own
Dockerfile, orchestrated by a root `docker-compose.yml`:

```
/backend    NestJS API (modular monolith)
/frontend   Next.js app
/docs       architecture notes, test-coverage reports
docker-compose.yml
```

### Backend (NestJS)

- Modules: `auth` (register/login, JWT, strong-password policy), `episodes`
  (the `api` module — JWT-guarded), `database` (TypeORM + Postgres).
- Route versioning (`/api/v1/...`), global prefix `/api`.
- List endpoints accept query parameters for pagination and filters — no
  pagination/filtering logic embedded in the URL path.
- PostgreSQL as the datastore, backing both `users` and an `episode_cache`
  table (repeat episode lookups skip the external API).
- Swagger/OpenAPI docs for every route at `/docs`.

### Frontend (Next.js)

- Single-page flow: episode input → submit → sorted character list, plus a
  filter/sort/pagination sidebar and a login/register page.
- Light/dark theme and EN/PT i18n, both as React contexts persisted to
  `localStorage` (`src/theme/`, `src/i18n/`).
- Route Handlers under `app/api/*` hold the JWT server-side (httpOnly
  cookie) — it never reaches client-side JS.

See [`docs/architecture.md`](docs/architecture.md) for the full picture and
[`docs/requirements.md`](docs/requirements.md) for what was required vs.
delivered.

## Development

Each project (`/backend`, `/frontend`) has its own `Dockerfile`; the root
`docker-compose.yml` runs the full stack locally. Prefer running services via
Docker Compose over ad hoc local processes so the delivered setup matches
what's documented.

## Testing

- Test runner: Vitest.
- Coverage reports live under `/docs/test-coverage`.

## Documentation

`/docs` holds architecture notes, the requirements traceability matrix, and
test-coverage output — keep all three current as the modules and endpoints
take shape.
