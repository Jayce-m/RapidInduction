# Rapid Sequence

Exam prep for the ANZCA Primary and Final.

- `frontend/` is the app (Vite and React), served at `app.rapidsequence.com`.
- `server/` is the API (Hono on Bun) with Drizzle and Neon Postgres. In
  production it also serves the built app.
- `marketing/` is the landing page (Astro), deployed separately as a static site.

## Local development

1. Copy `server/.env.example` to `server/.env` and fill in `DATABASE_URL` and
   `BETTER_AUTH_SECRET`. Add the viva keys too if you're working on vivas.
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

## Vivas

A viva is a conversation with an [ElevenLabs](https://elevenlabs.io) agent,
marked afterwards by Claude. Starting or marking one needs
`ELEVENLABS_API_KEY`, `ELEVENLABS_AGENT_ID` and `ANTHROPIC_API_KEY`; the rest
of the app runs without them.

The agent is configured in the ElevenLabs dashboard, not in this repo:

- Its prompt uses these dynamic variables, which `server/vivaPrompt.ts`
  fills in: `viva_id`, `examiner_name`, `station_title`, `scenario`,
  `question_plan`, `exhibits`, `examiner_style`, `style_instructions` and
  `minutes`.
- It has a client tool named `show_exhibit` with one string parameter,
  `exhibit_id`, which puts that exhibit in front of the candidate.

## Deploying the app subdomain on Fly

```sh
fly secrets set DATABASE_URL=... BETTER_AUTH_SECRET=... BETTER_AUTH_URL=https://app.rapidsequence.com
fly secrets set ELEVENLABS_API_KEY=... ELEVENLABS_AGENT_ID=... ANTHROPIC_API_KEY=...
fly certs add app.rapidsequence.com
```

Then add the DNS records that `fly certs add` prints.
