# Rapid Sequence business strategy

Last updated 24 October 2026. Prices are in AUD unless stated. Figures marked
*estimate* come from rough modelling, not measured usage. Replace them with real
numbers from PostHog and the ElevenLabs and Anthropic bills as they come in.

## The plan

1. **Launch and prove the product on ANZCA.** The niche is small and has little
   competition, so it is a good place to show that AI vivas and examiner-style
   marking win customers.
2. **Expand to the UK FRCA.** It is the same specialty and the same
   written-plus-viva format, in a market about twice the size. This is the
   clearest path to A$100k a year in profit.
3. **Add CICM later as a small add-on.** Its content overlaps heavily with
   ANZCA, but it has only about 100 to 130 candidates a year.

## Pricing

| Plan | Price | Vivas included |
|---|---|---|
| Monthly | A$59 a month | 7 a month |
| Annual | A$49 a month, billed as A$588 a year (16% saving) | 7 a month |
| Viva top-up (planned) | 5 vivas for A$25 | Needs Stripe before it can be sold |

- Unused vivas do not roll over.
- The app enforces the 7-viva monthly limit (`VIVAS_PER_MONTH` in
  `server/viva.ts`). The marketing site shows the same number from
  `vivasPerMonth` in `marketing/src/content.ts`. Change both together.

### Pass guarantee

If a subscriber does not pass the exam they studied for, they keep full access
free until their next sitting, for up to 6 months. It is not a cash refund.

Draft conditions, which are not yet published in full:

- It covers the first attempt at the exam chosen when subscribing, at a
  sitting within 12 months of joining.
- The subscriber must have been subscribed for at least the 3 months before the sitting.
- The official result must be sent within 30 days of its release.
- It applies once per exam.

The pricing card carries a short footnote. The full terms need a lawyer's review
before launch, because the guarantee is an Australian consumer-facing promise.

## Unit economics

### Cost per viva (*estimate*)

| Item | Cost |
|---|---|
| ElevenLabs agent, 12 minutes at US$0.08 a minute | US$0.96 |
| Agent LLM | about US$0.10 to US$0.50 |
| Opus 5.5 marking (about 6k tokens in, 8k out, at US$4 and US$20 per million) | about US$0.18 |
| **Total** | **about US$1.25 to US$1.65, or about A$2.20** |

### Profit per subscriber (*estimate*, at 4 vivas a month)

| | Monthly | Annual |
|---|---|---|
| Net after GST and Stripe, per month | about A$52.30 | about A$43.70 |
| Viva costs, per month | about A$9 | about A$9 |
| **Profit per month** | **about A$43.50** | **about A$35** |
| Profit per year | about A$520 | about A$420 |

A half-monthly, half-annual mix earns about **A$470 per subscriber per year**.
Fixed running costs are about A$2,000 a year: hosting, Neon, the domain and
PostHog beyond its free tier.

Not yet counted:

- LLM costs for AI quiz generation and the AI tutor
- the revenue given up on pass-guarantee extensions, possibly about A$100 per
  subscriber per year
- income tax, which is 25% for a base-rate entity

## Target: A$100k profit a year

You need about **220 paying subscribers, averaged across the year**. The range is 180 to 300:

| Scenario | Profit per subscriber per year | Subscribers needed |
|---|---|---|
| All monthly, light viva use (2 a month) | about A$575 | about 180 |
| Even mix, 4 vivas a month | about A$470 | about 220 |
| All annual, every viva used (7 a month) | about A$340 | about 300 |

These are subscribers paying all year round. Monthly subscribers come and go
around their sittings, so a monthly-heavy mix may take 400 to 600 different
customers a year.

## Market size

### ANZCA

- **Final:** 258 candidates attempted the 2026.1 sitting. With two sittings a
  year, that is about 400 different people a year.
- **Primary:** the candidate number is not yet checked. Its results page
  should show it.
- **Both exams:** about 700 to 900 different candidates a year. That is about
  400 full-year subscriptions if every candidate subscribed for their roughly 6
  months of study (*estimate*).

Reaching A$100k from ANZCA alone would mean about 50 to 60% of all candidates.
A realistic 15 to 30% share is worth about A$25k to A$55k a year.

### UK FRCA

Figures for 2024/25 come from the RCoA annual report:

| Exam | Sittings in the year | Pass rate |
|---|---|---|
| Primary MCQ | 1,080 | about 60 to 67% |
| Primary OSCE and SOE | 1,173 | not yet checked |
| Final SOE | 907 | about 67 to 70% |
| Final written | not yet checked | 70 to 86% depending on the sitting |

- **Different candidates:** about 1,600 to 2,000 a year, which is about 800 to
  1,000 full-year subscriptions (*estimate*).
- **Combined with ANZCA:** about 1,200 to 1,400 full-year subscriptions. At
  that size, 220 subscribers is about **15 to 20%** of the combined market.

### Before moving into the FRCA

- **Competition is much heavier.** Pastest, Primex, MedCourse, Mdster and
  iatrox all sell FRCA prep. Rapid Sequence would compete on the AI examiner
  and on marking that matches RCoA standards.
- **The content needs a UK version.** That means NICE and AAGBI guidelines,
  British drug names and doses, and the RCoA curriculum. The SOE is marked out
  of 48. Ideally a UK anaesthetist reviews it.
- **The Primary written exam is reported to change to the "AKT" from 2027.**
  Confirm the current format before building content for it.
- **UK VAT** of 20% probably applies from the first sale to UK consumers.
  Confirm with an accountant before setting GBP prices.

## Infrastructure decisions

### ElevenLabs

- **Use the agent rather than building a voice pipeline yourself.** Building
  on the raw APIs saves little per minute and means maintaining turn-taking,
  interruptions, streaming and echo cancellation yourself.
- **Start on the Creator plan.** It costs US$22 a month for 275 minutes, which
  is about 22 vivas. Every tier costs the same US$0.08 a minute, so move up
  only when usage needs it:

  | Plan | Price | Minutes | Concurrent calls | Suits roughly |
  |---|---|---|---|---|
  | Creator | US$22 | 275 | 10 | 5 subscribers |
  | Pro | US$99 | 1,238 | 20 | 25 subscribers |
  | Scale | US$299 | 3,738 | 30 | 75 subscribers |
  | Business | US$990 | 12,375 | 40 | 250 subscribers |

- **Turn on overage billing.** Without it, a viva cuts off when the included
  minutes run out.
- **Turn on burst pricing**, under Advanced, then Call Limits. It lets you run
  up to 3 times the concurrency limit, with the extra calls billed at double
  the rate.
- **Upgrade before exam sittings**, when usage peaks.

### Analytics

PostHog in the EU region tracks:

- the signup funnel, from the marketing site to sign-up click, account and
  first quiz
- daily, weekly and monthly active users
- feature use: quizzes, exams and vivas
- how often subscribers hit the viva limit

See the **Rapid Sequence overview** dashboard. The viva-limit count shows
whether top-ups would sell.

## Open items

- [ ] Confirm the Primary candidate numbers and the current pass rates.
- [ ] Replace the cost estimates with measured cost per viva after the first
      few weeks of real use.
- [ ] Get the full pass-guarantee terms reviewed by a lawyer.
- [ ] Add Stripe billing, then sell viva top-ups.
- [ ] Replace or remove the placeholder survey stats, testimonials and the
      "Advisor Name" before launch.
- [ ] Check what competing ANZCA courses and mock-viva coaching charge.
- [ ] Before starting the FRCA: research competitor pricing, plan the UK
      content review and confirm VAT.
