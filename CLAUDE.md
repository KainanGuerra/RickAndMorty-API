# ZRP Test

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

- Modules: `auth`, `api` (episodes/characters), plus shared/core modules as needed.
- Route versioning (e.g. `/api/v1/...`).
- List endpoints accept query parameters for pagination and filters — no
  pagination/filtering logic embedded in the URL path.
- PostgreSQL as the datastore.

### Frontend (Next.js)

- Single-page flow: episode input → submit → sorted character list.

## Development

Each project (`/backend`, `/frontend`) has its own `Dockerfile`; the root
`docker-compose.yml` runs the full stack locally. Prefer running services via
Docker Compose over ad hoc local processes so the delivered setup matches
what's documented.

## Testing

- Test runner: Vitest.
- Coverage reports live under `/docs/test-coverage`.

## Documentation

`/docs` holds architecture notes and test-coverage output — keep both current
as the modules and endpoints take shape.
