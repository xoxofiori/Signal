# Signal

**ChatPRD helps you write the PRD. Signal tells you if it worked — and what the next one should be.**

Signal is a post-launch PRD evaluation tool for product and program managers. You paste the original PRD's goals and the raw feedback users sent after launch. Signal maps each piece of feedback to a goal, shows which goals are working, at risk, or failing, surfaces issues the PRD never planned for, ranks what to fix next, and writes an evidence-backed engineering pitch for v2.

### The problem it solves

After a tool ships, feedback arrives through Slack DMs, weekly sync notes, in-tool widgets, and side-by-side observation. PMs triage it by hand for work stoppage risk, user impact, and urgency. There's no easy way to tell whether the tool actually met the goals in its PRD. Then, to get the top issues onto the next engineering roadmap, PMs have to hand-build a business case that competes with other teams at quarterly intake. Signal turns the scattered feedback into a scorecard and a ready-to-present pitch.

## Prerequisites

- **Node.js 20 or newer** (an `.nvmrc` is included, so `nvm use` works)
- **npm** (bundled with Node)

## Setup

```bash
git clone https://github.com/xoxofiori/SEP-mvp.git
cd SEP-mvp
npm install
npm run dev
```

Then open **http://localhost:3000**.

> **Runs in demo mode with no API key.** Without an `ANTHROPIC_API_KEY`, Signal shows a "Demo mode" badge and uses a bundled, precomputed analysis of the sample dataset. The full flow works: sample data, then scorecard, then an engineering pitch for every fix-next item, then both copy buttons.

### Optional: live AI analysis

To analyze your own data, add an Anthropic API key:

```bash
cp .env.example .env.local
# then edit .env.local:
# ANTHROPIC_API_KEY=sk-ant-...
```

Restart `npm run dev`. The badge switches to "Live AI analysis", and both analysis and pitches run on Claude (`claude-sonnet-5`, set in `lib/anthropic.ts`) from server routes. The key never reaches the browser. `.env.local` is git-ignored.

## How to use

1. **Input.** Enter a project name, the PRD's goals and success criteria (one per line), and the post-launch feedback (one item per line). Each feedback line can start with a source tag: `[Slack]`, `[Sync]`, `[Widget]`, or `[Observation]`. Untagged lines count as "Other". Or click **Load sample data**. Then click **Analyze**.
2. **Scorecard.** See the summary bar (feedback count; goals working, at risk, and failing; unplanned issues). Below it are the goal cards, failing first, each with a verdict, source breakdown, verbatim quotes, and all linked feedback. Next come the unplanned issue themes, then the **Fix next** list, which scores each item 1–5 on work stoppage risk, user impact, and urgency and sorts by total.
3. **Pitch.** Click **Generate eng pitch** on any fix-next item to get a one-page pitch: problem, evidence with verbatim quotes, the PRD goal affected, who's affected, impact if unsolved, proposed v2 direction, and the ask. Use **Copy as Markdown** to paste it into a doc, or **Copy as ChatPRD prompt** to have ChatPRD draft the v2 PRD from it.

## How the AI works

- `POST /api/analyze` takes `{ projectName, goals: string[], feedback: {source, text}[] }` and returns the scorecard JSON.
- `POST /api/pitch` takes one fix-next item plus its linked feedback and returns the pitch JSON.
- The model is told to return only JSON. The server strips any code fences, validates the result with zod, and retries once before showing a friendly error.
- Quotes must be verbatim. The server drops any quote that isn't an exact substring of the submitted feedback and recomputes counts, source breakdowns, and totals, so the numbers on screen always match the input.

## Tech stack

- [Next.js 15](https://nextjs.org/) (App Router) + TypeScript
- Tailwind CSS v4, Inter via `next/font`
- [`@anthropic-ai/sdk`](https://github.com/anthropics/anthropic-sdk-typescript) (server-side only)
- [zod](https://zod.dev/) for request and response validation
- No database and no auth. State lives in React, and nothing is persisted.

## Project structure

```
app/page.tsx                 Single-page flow (reads demo vs. live mode at request time)
app/api/analyze/route.ts     Scorecard endpoint (demo + live)
app/api/pitch/route.ts       Engineering pitch endpoint (demo + live)
components/                  SignalApp, InputForm, SummaryBar, GoalCard, UnplannedSection,
                             FixNextList, PitchView, StatusBadge, DemoBadge, skeletons, …
lib/types.ts, lib/schemas.ts Types and zod schemas
lib/prompts.ts               Prompts for analysis and pitches
lib/anthropic.ts             Model constant, Claude call, JSON extraction, retry
lib/normalize.ts             Verbatim-quote enforcement and recomputed counts
data/sample.ts               Demo dataset (Moderation Queue Tool v1)
data/demo-scorecard.json     Precomputed scorecard for the sample
data/demo-pitches.json       Precomputed pitch for every fix-next item
```

## Scripts

| Command             | What it does                    |
| ------------------- | ------------------------------- |
| `npm run dev`       | Start the dev server on :3000   |
| `npm run build`     | Production build                |
| `npm start`         | Serve the production build      |
| `npm run lint`      | ESLint                          |
| `npm run typecheck` | TypeScript type check           |
