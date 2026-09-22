# Test coverage

Both projects use Vitest with the v8 coverage provider. Numbers below are
from the most recent `npm run test:cov` run in each project.

## Summary

| Project | Tests | Statements | Branches | Functions | Lines |
|---|---|---|---|---|---|
| `backend/` | 19 passing (5 files) | 72.0% | 74.4% | 57.1% | 72.0% |
| `frontend/` | 20 passing (6 files) | 77.5% | 83.6% | 71.7% | 77.5% |

The headline percentages are pulled down by files with zero test-worthy
logic — NestJS module-wiring classes (`*.module.ts`), the TypeORM
migration, Next.js Route Handlers (thin proxies, exercised manually
end-to-end rather than unit-tested), and `middleware.ts`. Every file that
actually contains branching logic — services, controllers, DTO validation,
guards, strategies, and every interactive frontend component — sits at
90–100%. Full per-file breakdowns are in `backend/index.html` and
`frontend/index.html` in this folder.

## What's covered

- **`backend/`**:
  - `AuthService` — registration (hashing, duplicate-email rejection),
    login (valid/invalid/unknown credentials).
  - `EpisodesService` — cache hit vs. miss, sort (asc/desc), name filter,
    pagination, 404 on an unknown episode.
  - `RegisterDto` — the strong-password rule (`register.dto.spec.ts`),
    parametrized over weak and strong passwords.
  - A controller-level e2e test verifying the versioned/prefixed route and
    that the JWT guard rejects unauthenticated requests.
  - `test/swagger.e2e.spec.ts` — the generated OpenAPI document contains
    every route and marks the episodes route as requiring `JWT-auth`.
- **`frontend/`**:
  - `EpisodeSearch` — search, name filter, sort re-fetch, pagination
    (Previous/Next, boundary disabling), error state — all against a
    mocked `fetch`.
  - `EpisodeResults` — every render state (prompt, empty, results,
    pagination) in isolation.
  - `LoginForm` — login, register, mode switching (heading + button text),
    show/hide password, backend error passthrough.
  - `HeaderMenu` — dropdown open/close (including outside-click), logout.
  - `ThemeToggle` / `LocaleToggle` — state toggling, `localStorage`
    persistence, and (for locale) that toggling actually changes rendered
    text elsewhere in the tree.

## Regenerating

```bash
cd backend && npm run test:cov
cd frontend && npm run test:cov
```

Each run writes an HTML report to `test-coverage/backend/` and
`test-coverage/frontend/` respectively. Open `index.html` from either
folder directly in a browser (no server needed) and drill into any file for
line-by-line covered/uncovered highlighting. Re-run after changing code —
the reports aren't regenerated automatically.
