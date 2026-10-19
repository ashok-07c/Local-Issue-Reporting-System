# Local Issue Reporting System — Monorepo

A civic complaint / issue reporting web app: React (Vite) frontend + Express/MongoDB backend.

## Structure

```
.
├── backend/          Express API (auth, issues, users) + MongoDB via Mongoose
├── frontend/          React (Vite) SPA
├── package.json       Root orchestration scripts
├── .env.example        All environment variables, documented
└── .gitignore
```

## Setup

```bash
npm run install:all      # installs backend + frontend dependencies
```

Copy `.env.example` and split it into two real files (Vite and Node don't
share one `.env`):

```bash
cp .env.example backend/.env      # then trim to backend/frontend? keep only backend vars
cp .env.example frontend/.env     # then keep only VITE_API_URL
```

At minimum set `MONGODB_URI` and `JWT_SECRET` in `backend/.env`.

## Development

```bash
npm run dev     # runs backend (nodemon) and frontend (vite) together via concurrently
```

## Production build

```bash
npm run build   # installs deps and builds frontend/dist
npm start       # starts the backend (node backend/server.js)
```

Deploy `frontend/dist` to a static host (Vercel/Netlify) **or** set
`SERVE_FRONTEND=true` in `backend/.env` to have the Express server serve it
directly from the same process (single-service hosts like Render/Railway).

## Frontend ↔ backend wiring

The frontend is fully wired to the backend API — no `localStorage` is
used as a data store anymore (only the JWT/session cache, under the
`currentSession` key, which is normal). Specifically:

- `frontend/src/lib/api.js` — the API client: `authApi`, `issuesApi`,
  `usersApi`, plus `getSession`/`setSession`/`clearSession` and
  `resolvePhotoUrl()` for turning `/uploads/...` paths into full URLs.
- **Auth** — `LoginForm.jsx` / `RegisterForm.jsx` call
  `POST /api/auth/login` and `/register`; the returned JWT + user are
  cached in `localStorage.currentSession` and attached as a `Bearer`
  token on every subsequent request. Redirect after login is driven by
  the `role` the backend returns, not a hardcoded email check.
- **Reporting an issue** — `ReportIssueForm.jsx` now uploads photos as
  real files via `multipart/form-data` to `POST /api/issues` (previously
  they were base64-encoded into `localStorage`).
- **All list/detail views** — `MyReports`, `TrackProgress`, `Profile`,
  `UserDashboard`, and every admin page (`AdminComplaints`,
  `AdminDashboard`, `AdminAnalytics`, `AdminUsers`, both
  `ComplaintDetails` pages) fetch from the backend (`/api/issues*`,
  `/api/users`) instead of reading a `complaints`/`user` array out of
  `localStorage`.
- **Route protection** — added a `RequireAuth` guard in `src/App.jsx`
  so `/userdashboard/*` and `/admin/*` redirect to `/login` without a
  valid session, and redirect users/admins away from each other's
  section. This didn't exist before; the pages were reachable by URL
  even when "logged out" client-side.
- **Bug fix** — the `/admin/complaints/:id` route was importing the
  *user* `ComplaintDetails` page instead of the admin one; fixed to use
  `pages/admin/ComplaintDetails.jsx`.

One thing to know: the demo/seed data in `backend/scripts/seed.js`
(`npm run seed`) creates the admin account
(`admin@localissuereportingsystem.com` / `Admin123`) and a demo user —
this now matches what `LoginForm.jsx` actually authenticates against.

## Backend API reference

| Method | Route | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/auth/me` | user | Current user |
| POST | `/api/issues` | user | Report an issue (multipart, up to 3 photos) |
| GET | `/api/issues/my` | user | Current user's issues |
| GET | `/api/issues` | admin | All issues |
| GET | `/api/issues/:id` | user | Issue detail |
| PUT | `/api/issues/:id` | admin | Update issue status |
| DELETE | `/api/issues/:id` | admin | Delete issue |
| GET | `/api/users` | admin | List users |
| DELETE | `/api/users/:id` | admin | Delete user |
| GET | `/api/health` | — | Health check |
