# Rick and Morty API

Look up every character that appears in a given Rick and Morty episode,
sorted alphabetically. NestJS API + Next.js frontend, Postgres-backed,
JWT-protected, Dockerized.

See [`docs/architecture.md`](docs/architecture.md) for how it fits together,
[`docs/requirements.md`](docs/requirements.md) for what was required vs.
delivered, and [`docs/test-coverage/README.md`](docs/test-coverage/README.md)
for current coverage numbers.

## Highlights

Beyond the core episode-lookup flow: JWT authentication (with a
strong-password policy), Postgres-backed episode caching, pagination and
name filtering, interactive Swagger/OpenAPI docs, a themed (light/dark)
and bilingual (EN/PT) frontend, and CI that tests every push and publishes
versioned Docker images to GHCR. Full breakdown in
[`docs/requirements.md`](docs/requirements.md).

## Prerequisites

- **Either Docker option below**: Docker Engine + the `docker compose`
  plugin (Docker Desktop on Mac/Windows already includes it). Nothing else —
  no Node, no cloning the repo for Option 1.
- **Local (no Docker) path**: Node.js 22+, npm, and a local Postgres 16
  instance (or run just `docker compose up postgres` for that piece).
  Nothing else needs installing globally — no NestJS CLI, no Next CLI;
  everything runs through each project's `npm` scripts.

## Run it

Two ways to run the full stack with Docker. Both expose the same ports:

- Frontend: http://localhost:3000
- Backend: http://localhost:3001/api/v1
- Swagger UI: http://localhost:3001/docs
- Postgres: localhost:5432

The backend runs its database migrations automatically on startup. Once
it's up, open the frontend, register an account, log in, then search an
episode number (e.g. `1`).

### Option 1 — prebuilt images from GHCR (no build, no clone required)

Pulls the images built by CI (`.github/workflows/docker-publish.yml`) from
`ghcr.io/kainanguerra/rickandmorty-api-{backend,frontend}`. Just grab
[`docker-compose.ghcr.yml`](docker-compose.ghcr.yml) and an `.env` — you
don't need the rest of the source:

```bash
curl -O https://raw.githubusercontent.com/KainanGuerra/RickAndMorty-API/master/docker-compose.ghcr.yml
curl -O https://raw.githubusercontent.com/KainanGuerra/RickAndMorty-API/master/.env.example
cp .env.example .env   # adjust JWT_SECRET etc. if you like
docker compose -f docker-compose.ghcr.yml up -d
```

(Or, with the repo cloned, just `docker compose -f docker-compose.ghcr.yml up -d`
from the repo root.) Pin a specific build instead of `latest` with
`IMAGE_TAG=<git-sha> docker compose -f docker-compose.ghcr.yml up -d`.

### Option 2 — build locally with Docker Compose

```bash
cp .env.example .env   # adjust JWT_SECRET etc. if you like
docker compose up --build
```

## Run it locally without Docker

Requires a local Postgres instance (or `docker compose up postgres`).

```bash
# backend
cd backend
cp .env.example .env   # point DATABASE_* at your Postgres
npm install
npm run migration:run
npm run start:dev       # http://localhost:3001

# frontend, in another shell
cd frontend
cp .env.example .env
npm install
npm run dev              # http://localhost:3000
```

## Tests

```bash
cd backend && npm run test:cov
cd frontend && npm run test:cov
```

Each run writes an HTML coverage report to `docs/test-coverage/backend/` and
`docs/test-coverage/frontend/`. Open `index.html` from either folder directly
in a browser to view it (double-click it, or e.g. `open docs/test-coverage/backend/index.html`
on macOS, `xdg-open ...` on Linux) — it's static HTML, no server needed. From
there you can drill into any file to see line-by-line covered/uncovered
highlighting.

## API

Interactive Swagger UI: http://localhost:3001/docs (raw OpenAPI JSON at
`/docs-json`). Use "Authorize" with a token from `/api/v1/auth/login` to try
the protected endpoint from the browser.

- `POST /api/v1/auth/register` — `{ email, password }`. Password must be 8+
  characters with at least one uppercase letter, one lowercase letter, one
  digit, and one special character.
- `POST /api/v1/auth/login` — `{ email, password }` → `{ accessToken }`
- `GET /api/v1/episodes/:number/characters` — requires
  `Authorization: Bearer <accessToken>`. Query params: `sort` (`asc`|`desc`),
  `name` (filter), `page`, `limit`.

## CI / images

`.github/workflows/docker-publish.yml` runs both test suites and, on push to
`master`, builds and publishes `backend` and `frontend` images to GHCR
(`ghcr.io/kainanguerra/rickandmorty-api-backend`,
`ghcr.io/kainanguerra/rickandmorty-api-frontend`), tagged `:latest` and
`:<commit-sha>`. Both packages are public, so Option 1 above pulls without
`docker login`.
