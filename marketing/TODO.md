# Marketing site: todo and decisions

## Before launch

- [ ] **Retake the app screenshots.** The hero and "How it works" images in
      `src/assets/screens/` are snapshots of the app as it looked in October 2026,
      showing placeholder content. Retake them after any app redesign and once the
      app has realistic seed data. See "How the screenshots were made" below.
- [ ] Replace placeholder stats, testimonials, results cards and the "1,800
      trainees" figure in `src/content.ts` with real, verifiable data.
- [ ] Replace the four "Advisor Name, FANZCA" placeholders with real advisors
      and photos, or remove the section.
- [ ] Confirm prices ($39/mo, $29/mo annual) and the resit exam fee ($3,500 is
      a guess; check ANZCA's current fees).
- [ ] Decide whether to offer the pass guarantee and money-back wording. Remove
      it everywhere if not, and publish terms if so.
- [ ] Have the ChatGPT / Claude comparison table checked before naming real
      products.
- [ ] Make a proper Open Graph image (1200×630). It is currently the favicon.
- [ ] Set `SITE_URL` (real domain) and `PUBLIC_APP_URL` (deployed app) at build
      time. "Log in" and "Get started" point at the local app until then.
- [ ] Fill in the footer links (About, Security and privacy, Terms, socials).
      They render as plain text until they have an `href`.
- [ ] Choose a static host (Netlify, Vercel or Cloudflare Pages) and deploy
      `marketing/`. The Dockerfile and `fly.toml` only cover the app.

## How the screenshots were made

A Playwright script launched a headless copy of the installed Chrome and opened
the app dev server at `http://127.0.0.1:5190`. The viewport was 1280×800 at 2x
pixel density. Each page loaded, waited about a second, and was saved as a PNG
in `src/assets/screens/`:

| File | Page | Setup before the shot |
| --- | --- | --- |
| `exams.png` | `/exams` | None |
| `materials.png` | `/materials` | None |
| `quiz.png` | First quiz linked from `/quizzes` | Selected the second answer and clicked Check |
| `viva.png` | `/viva/demo/live?station=preeclampsia&mode=voice&minutes=12` | Clicked "Begin viva", waited for "Listening to you" plus 3 seconds |

`HowItWorks.astro` crops each image to its top-left corner, so keep the
important content near the top left of the page. Astro converts the PNGs to WebP
at build time.

## Decision log

- **2026-10-20. The landing page is a separate Astro site in `marketing/`, in
  the same repo as the app.** It ships as static HTML for SEO and fast loads,
  and deploys independently of the app.
- **2026-10-20. The site shares the app's brand tokens.** They live in
  `frontend/src/theme.css`, which both the app and the site import, so colours
  and fonts stay in sync.
- **2026-10-20. The homepage uses its own copy, logo and anaesthesia
  content throughout.**
- **2026-10-20. A "blind evaluation vs ChatGPT" chart was replaced with
  an examiner-style marking sample.** A benchmark claim needs real test data,
  which doesn't exist yet.
- **2026-10-20. All marketing copy lives in `src/content.ts`.** Text can change
  without touching layout components.
- **2026-10-20. The "How it works" images are real app screenshots, not
  mock-ups.** The trade-off is that they must be retaken when the app changes.
