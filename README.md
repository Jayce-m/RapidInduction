# Rapid Sequence

Exam prep for the ANZCA Primary and Final.

- `frontend/` is the app (Vite and React), served at `app.rapidsequence.com`.
- `server/` is the API (Hono on Bun) with Drizzle and Neon Postgres. In
  production it also serves the built app.
- `marketing/` is the landing page (Astro), deployed separately as a static site.

## Local development

1. Copy `server/.env.example` to `server/.env` and fill in `DATABASE_URL` and
   `BETTER_AUTH_SECRET`.
2. Start the API: `cd server && bun run dev` (listens on port 8080).
3. Start the app: `cd frontend && bun run dev`. Vite proxies `/api` to the API.

`BETTER_AUTH_URL` must match the origin you open the app on, because Better
Auth rejects requests from any other origin. Outside production,
`localhost:5190` and `127.0.0.1:5190` are both trusted.

## Accounts

Sign-in uses [Better Auth](https://www.better-auth.com) with email and
password. The auth tables (`user`, `session`, `account`, `verification`) are
defined in `server/db/auth-schema.ts`, and their migration is
`server/db/migrations/0002_auth.sql`. All app routes require a session;
`/login` and `/signup` are public.

## Deploying the app subdomain on Fly

```sh
fly secrets set DATABASE_URL=... BETTER_AUTH_SECRET=... BETTER_AUTH_URL=https://app.rapidsequence.com
fly certs add app.rapidsequence.com
```

Then add the DNS records that `fly certs add` prints.
