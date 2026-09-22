# Requirements traceability

Maps every line item from the original spec ([`CLAUDE.md`](../CLAUDE.md)) to
what was actually delivered, then lists what went beyond it.

## Spec requirements

| # | Requirement | Status | Where |
|---|---|---|---|
| 1 | A page with a single input for an episode number | ✅ | `frontend/src/components/Sidebar.tsx` |
| 2 | On submit, fetch all characters present in that episode via the API | ✅ | `frontend/src/components/EpisodeSearch.tsx` → `POST/GET` chain → `backend/src/episodes/episodes.service.ts` |
| 3 | Display results sorted alphabetically, ASC/DESC toggle | ✅ | Sort select in `Sidebar.tsx`; sorting applied in `episodes.service.ts:getCharacters` |
| 4 | Deliverable: public repo + app running locally via Docker | ✅ | https://github.com/KainanGuerra/RickAndMorty-API (public), `docker-compose.yml` |
| 5 | Backend: `auth` + `api` (episodes) modules | ✅ | `backend/src/auth/`, `backend/src/episodes/` |
| 6 | Route versioning | ✅ | `VersioningType.URI`, default `v1` — `backend/src/main.ts`; routes are `/api/v1/...` |
| 7 | Query params for pagination and filters (not in the URL path) | ✅ | `GET /api/v1/episodes/:number/characters?sort=&name=&page=&limit=` — `episodes.controller.ts` + `dto/query-characters.dto.ts` |
| 8 | PostgreSQL as the datastore | ✅ | `backend/src/database/` (TypeORM), two tables: `users`, `episode_cache` |
| 9 | Frontend: single-page flow (input → submit → sorted list) | ✅ | `frontend/src/components/EpisodeSearch.tsx` |
| 10 | `docs/` with architecture notes + test-coverage, kept current | ✅ | this file, [`architecture.md`](architecture.md), [`test-coverage/`](test-coverage/) |

All ten line items from the spec are implemented and verified (unit/e2e
tests plus a live end-to-end pass over Docker Compose — register, log in,
search, sort, paginate, filter, log out).

## Beyond the spec

None of the following were asked for; they were added because they're what
a real deployment of this app would need, and because the spec's own stack
notes ("auth module", "PostgreSQL") implied more than a stateless lookup:

| Addition | Why |
|---|---|
| JWT authentication gating the episode endpoint | The spec listed an `auth` module but the core flow needed no login — rather than ship an unused module, auth actually protects the route, which is what an `auth` module implies in a real API. |
| Postgres-backed episode/character caching | Otherwise Postgres would have no real purpose (nothing in the spec needs persistence besides users). Repeat lookups for the same episode skip the external API. |
| Strong-password policy on registration | Registration existed but only checked length; added upper/lower/digit/special-character requirements, enforced by `class-validator` and documented in Swagger. |
| Swagger / OpenAPI docs for every route | `/docs` on the backend — interactive, with the JWT bearer flow wired up, so the API is self-documenting beyond this markdown. |
| Pagination + name filtering surfaced in the UI | The backend accepted `page`/`limit`/`name` from the start (spec requirement #7), but the first UI pass only sent `sort`. Closed that gap so the query params are actually usable, not just implemented. |
| Light/dark theme, EN/PT i18n | Neither asked for, both cheap given the CSS-variable/context patterns already needed for the rest of the UI — and it's the kind of polish that separates a finished product from a minimum-viable one. |
| CI (GitHub Actions): test gate + GHCR image publishing | `.github/workflows/docker-publish.yml` runs both test suites on every push/PR and publishes versioned images so the app can be run from prebuilt images, not just `docker compose up --build`. |

## Test coverage

See [`test-coverage/README.md`](test-coverage/README.md) for the current
numbers and how to regenerate them.
