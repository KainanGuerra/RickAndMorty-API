# ZRP Test

Look up every character that appears in a given Rick and Morty episode,
sorted alphabetically. NestJS API + Next.js frontend, Postgres-backed,
JWT-protected, Dockerized.

See [`docs/architecture.md`](docs/architecture.md) for how it fits together
and [`docs/test-coverage/README.md`](docs/test-coverage/README.md) for how
coverage is generated.

## Run it (Docker Compose)

```bash
cp .env.example .env   # adjust JWT_SECRET etc. if you like
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:3001/api/v1
- Postgres: localhost:5432

The backend runs its database migrations automatically on startup. Open the
frontend, register an account, log in, then search an episode number (e.g.
`1`).

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

## API

- `POST /api/v1/auth/register` — `{ email, password }`
- `POST /api/v1/auth/login` — `{ email, password }` → `{ accessToken }`
- `GET /api/v1/episodes/:number/characters` — requires
  `Authorization: Bearer <accessToken>`. Query params: `sort` (`asc`|`desc`),
  `name` (filter), `page`, `limit`.

## CI / images

`.github/workflows/docker-publish.yml` runs both test suites and, on push to
`main`, builds and publishes `backend` and `frontend` images to GHCR
(`ghcr.io/<owner>/<repo>-backend`, `ghcr.io/<owner>/<repo>-frontend`).
