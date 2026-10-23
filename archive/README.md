# Archive

The original past-paper question bank and the code that used it, kept for
reference until it's deleted. Nothing in the app imports from this folder.

- `server/` holds the past-paper data, its scraper, the old seed script and
  the old question schema. Those tables were dropped in migration
  `drop_old_question_bank`.
- `frontend/src/pages/PapersPage.tsx` and `generatePdf.ts` are the past-paper
  PDF builder that was at `/papers`.
- `frontend/src/study/seed/` holds the original hardcoded quiz chapters and
  MCQs. The chapters, topics and readings were copied to
  `server/db/seed/course.ts`; the MCQs were replaced by the generated set.
