# Test coverage

Both projects use Vitest with the v8 coverage provider.

- `backend/`: `npm run test:cov` — unit tests for `AuthService` and
  `EpisodesService` (mocked repositories/HTTP client), plus a controller-level
  test that verifies the versioned/prefixed route and that the JWT guard
  rejects unauthenticated requests. Report written to `test-coverage/backend/`.
- `frontend/`: `npm run test:cov` — component tests for `EpisodeSearch`
  (search, sort re-fetch, error state) and `LoginForm` (login, register,
  invalid credentials) with a mocked `fetch`. Report written to
  `test-coverage/frontend/`.

Reports are regenerated locally; re-run the commands above after changing
code to refresh `index.html` in each folder.
