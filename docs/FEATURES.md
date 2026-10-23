# Rapid Sequence: feature spec

The single list of what Rapid Sequence does and will do. Each feature has an
entry below. Change the entry before building the feature.

## Who it's for

ANZCA trainees preparing for the Primary and Final exams.

## What success looks like

- _TBD_
- _TBD_

## Release tiers

- **MVP**: must exist before anyone pays.
- **Next**: soon after launch.
- **Later**: ideas worth keeping, no commitment yet.

## Status values

Not started, Placeholder UI, Partial, Built, Cut.

## Feature index

| ID  | Feature                 | Area      | Exam          | Tier | Status         |
| --- | ----------------------- | --------- | ------------- | ---- | -------------- |
| F01 | Accounts and login      | Platform  | Both          | MVP  | Built          |
| F02 | Topic quizzes           | Study     | Primary/Final | MVP  | Partial        |
| F03 | Practice exams          | Exams     | Primary/Final | ?    | Placeholder UI |
| F04 | Viva simulator          | Viva      | Final         | ?    | Placeholder UI |
| F05 | Study materials         | Materials | Both          | ?    | Placeholder UI |
| F06 | Past paper PDF builder  | Papers    | ?             | ?    | Cut            |
| F07 | Tutor                   | Study     | Both          | ?    | Not started    |
| F08 | Progress tracking       | Study     | Both          | ?    | Partial        |
| F09 | Subscriptions           | Platform  | Both          | ?    | Not started    |
| F10 | Marketing site          | Marketing | Both          | MVP  | Partial        |

---

## Template

Copy this for each new feature.

```markdown
## Fxx · Feature name

**Why it exists.** One or two sentences on the trainee problem it solves.

**User stories**

- As a trainee, I want to …, so that …

**How it works.** The flow, step by step, from entry point to result.

**Rules and edge cases.** Timing, scoring, refresh, leaving midway, and so on.

**Content and data it needs.** Where the content comes from and what gets saved.

**Out of scope (this tier).** What is deliberately not included.

**Done when.**

- [ ] …

**Open questions.**

- …

**Today in the app.** What exists now and what is fake.
```

---

## F01 · Accounts and login

**Why it exists.** _TBD_

**User stories**

- As a trainee, I want to …, so that …

**How it works.** _TBD_

**Rules and edge cases.** _TBD_

**Content and data it needs.** _TBD_

**Out of scope (this tier).** _TBD_

**Done when.**

- [ ] …

**Open questions.**

- Password reset, email verification, Google sign-in?
- Can an account be deleted by its owner?

**Today in the app.** Email and password sign-up and login through Better
Auth, stored in Neon (`user`, `session`, `account`, `verification` tables).
Every app page requires a login. There's no password reset, email
verification or account settings page.

## F02 · Topic quizzes

**Why it exists.** _TBD_

**User stories**

- As a trainee, I want to …, so that …

**How it works.** _TBD_

**Rules and edge cases.** _TBD_

**Content and data it needs.** _TBD_

**Out of scope (this tier).** _TBD_

**Done when.**

- [ ] …

**Open questions.**

- Where does the real question bank come from, and who writes or checks it?
- Should attempts sync to the server so they follow the user across devices?

**Today in the app.** Working end to end for MCQs. `/quizzes` shows a course
outline of chapters and topics, each chapter has a reading page, and quizzes
run per chapter or per topic with a results page. The course and questions live
in Neon and load from `/api/course` when the app opens. The seed in
`server/db/seed/` has 3 Primary chapters (Pharmacology, Physiology, Physics and
Measurement) and 2 Final chapters (Airway, Obstetric anaesthesia), with one
generated MCQ and one SAQ per topic: 10 of each. SAQs are served by the API but
no page shows them yet. Attempts are saved in the browser (localStorage), not
on the server.

## F03 · Practice exams

**Why it exists.** _TBD_

**User stories**

- As a trainee, I want to …, so that …

**How it works.** _TBD_

**Rules and edge cases.** _TBD_

**Content and data it needs.** _TBD_

**Out of scope (this tier).** _TBD_

**Done when.**

- [ ] …

**Open questions.**

- How are SAQ answers marked: by AI, by a rubric, or self-marked?
- Practice versus graded mode: what actually differs?

**Today in the app.** All screens are placeholders over fake data in
`frontend/src/placeholder/exams.ts`. The list, create, take and feedback pages
exist and look finished. Create Exam drops every setting and always opens the
same demo paper. Answers are thrown away on submit, and feedback is a fixed
sample. Exam questions use a separate model from quizzes. See "Before real exam
work" in the code review for the restructuring needed first.

## F04 · Viva simulator

**Why it exists.** _TBD_

**User stories**

- As a trainee, I want to …, so that …

**How it works.** _TBD_

**Rules and edge cases.** _TBD_

**Content and data it needs.** _TBD_

**Out of scope (this tier).** _TBD_

**Done when.**

- [ ] …

**Open questions.**

- Which voice and speech services, and what does a session cost to run?
- How are viva answers marked, and against what rubric?

**Today in the app.** Placeholder over fake data in
`frontend/src/placeholder/viva.ts`. Setup offers 6 stations, 3 examiner styles
and voice or text mode, but the live page ignores the choices and always plays
a scripted pre-eclampsia viva with simulated typing. Feedback is a fixed
sample. There's no real audio or examiner.

## F05 · Study materials

**Why it exists.** _TBD_

**User stories**

- As a trainee, I want to …, so that …

**How it works.** _TBD_

**Rules and edge cases.** _TBD_

**Content and data it needs.** _TBD_

**Out of scope (this tier).** _TBD_

**Done when.**

- [ ] …

**Open questions.**

- What does uploading a file do for the user (feeds the tutor, generates
  questions, just storage)?

**Today in the app.** Placeholder. `/materials` has notes and papers shelves
with drag-and-drop upload of PDF, DOCX and PPTX, but uploads stay in the page
and vanish on reload. Listed files are fake (`frontend/src/placeholder/materials.ts`).

## F06 · Past paper PDF builder

**Why it exists.** _TBD_

**User stories**

- As a trainee, I want to …, so that …

**How it works.** _TBD_

**Rules and edge cases.** _TBD_

**Content and data it needs.** _TBD_

**Out of scope (this tier).** _TBD_

**Done when.**

- [ ] …

**Open questions.**

- Keep this as its own feature, or fold it into Practice exams?
- Are we allowed to reproduce past paper questions?

**Today in the app.** Cut. The original RapidInduction past-paper tool and
its question bank were moved to `archive/` and its database tables dropped.

## F07 · Tutor

**Why it exists.** _TBD_

**User stories**

- As a trainee, I want to …, so that …

**How it works.** _TBD_

**Rules and edge cases.** _TBD_

**Content and data it needs.** _TBD_

**Out of scope (this tier).** _TBD_

**Done when.**

- [ ] …

**Open questions.**

- What does it answer from: our readings only, uploaded materials, or anything?

**Today in the app.** Not started. `/tutor` is a "coming soon" page, and the
"Ask tutor" pill in the shell leads there.

## F08 · Progress tracking

**Why it exists.** _TBD_

**User stories**

- As a trainee, I want to …, so that …

**How it works.** _TBD_

**Rules and edge cases.** _TBD_

**Content and data it needs.** _TBD_

**Out of scope (this tier).** _TBD_

**Done when.**

- [ ] …

**Open questions.**

- Does progress cover exams and vivas too, or quizzes only?

**Today in the app.** Partial. The quiz outline shows best scores and recent
attempts, and results show accuracy per topic. It all comes from attempts in
browser storage, so it's per device and lost if storage is cleared.

## F09 · Subscriptions

**Why it exists.** _TBD_

**User stories**

- As a trainee, I want to …, so that …

**How it works.** _TBD_

**Rules and edge cases.** _TBD_

**Content and data it needs.** _TBD_

**Out of scope (this tier).** _TBD_

**Done when.**

- [ ] …

**Open questions.**

- Free tier or trial? What does an unpaid account see?
- Payment provider?
- Pass guarantee: offer it or drop it?

**Today in the app.** Not started. The marketing site shows prices ($39 a
month, or $29 a month billed annually), but there's no payment or plan
checking in the app.

## F10 · Marketing site

**Why it exists.** _TBD_

**User stories**

- As a trainee, I want to …, so that …

**How it works.** _TBD_

**Rules and edge cases.** _TBD_

**Content and data it needs.** _TBD_

**Out of scope (this tier).** _TBD_

**Done when.**

- [ ] …

**Open questions.**

- See the "Before launch" list in `marketing/TODO.md`.

**Today in the app.** A separate Astro site in `marketing/`. The page is built,
but stats, testimonials, advisors and screenshots are placeholders, and it
isn't deployed.
