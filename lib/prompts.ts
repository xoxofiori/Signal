import type { FeedbackItem, FixNextItem, PitchRequest } from "./types";

export const ANALYZE_SYSTEM = `You are Signal, an analyst that evaluates whether a shipped internal tool or feature met the goals in its original PRD, using raw post-launch feedback.

You return ONLY a single valid JSON object. No markdown, no code fences, no commentary before or after.

Rules:
- Map each feedback item to at most one PRD goal it is evidence for (positive or negative). Feedback that fits no goal becomes an "unplanned" issue.
- Status rules:
  - "failing": multiple items show the goal is not met or is blocking users.
  - "at_risk": mixed or some negative signals.
  - "working": mostly positive signals or no complaints.
- Quotes MUST be copied verbatim from the feedback text provided (exact substrings; whole items are best). Never invent, paraphrase, merge, or clean up quotes. Do not include the [id] or source prefix in a quote.
- Cluster unplanned feedback into a small number of clear themes (skip a theme only if it has no negative signal).
- "fixNext" must include EVERY goal with status "failing" or "at_risk" and EVERY unplanned theme. Score each 1–5:
  - stoppage (Work Stoppage Risk): does this block users from doing their job?
  - impact (User Impact): how many users, how severe?
  - urgency (Urgency): compliance, safety, or time-sensitive consequences?
  Give each score a one-line rationale grounded in the feedback. total = stoppage + impact + urgency. Sort fixNext by total descending.
- Be concise and specific. Verdicts are one sentence. Write for a product manager presenting to engineering.`;

export function analyzePrompt(projectName: string, goals: string[], feedback: FeedbackItem[]): string {
  const goalLines = goals.map((g, i) => `g${i + 1}: ${g}`).join("\n");
  const fbLines = feedback.map((f, i) => `[${i}] (${f.source}) ${f.text}`).join("\n");
  return `Project: ${projectName || "Untitled project"}

PRD goals (id: goal):
${goalLines}

Post-launch feedback ([feedbackId] (source) text):
${fbLines}

Return JSON with exactly this shape:
{
  "summary": { "totalFeedback": number, "working": number, "atRisk": number, "failing": number, "unplannedCount": number },
  "goals": [
    { "id": "g1", "goal": "<goal text exactly as given>", "status": "working" | "at_risk" | "failing",
      "verdict": "<one sentence explaining the status>",
      "feedbackIds": [<feedbackId numbers linked to this goal>],
      "sourceBreakdown": { "<source>": <count> },
      "quotes": ["<2-3 verbatim quotes from the linked feedback>"] }
  ],
  "unplanned": [
    { "id": "u1", "title": "<short theme title>", "summary": "<1-2 sentences>",
      "feedbackIds": [<numbers>], "quotes": ["<1-3 verbatim quotes>"] }
  ],
  "fixNext": [
    { "id": "f1", "refType": "goal" | "unplanned", "refId": "<g# or u#>", "title": "<problem-framed title>",
      "scores": {
        "stoppage": { "value": 1-5, "rationale": "<one line>" },
        "impact":   { "value": 1-5, "rationale": "<one line>" },
        "urgency":  { "value": 1-5, "rationale": "<one line>" } },
      "total": <sum> }
  ]
}

Include one entry in "goals" for each of the ${goals.length} goals, in the same order, using ids g1..g${goals.length}. feedbackIds are the bracketed numbers (0 to ${feedback.length - 1}).`;
}

export const PITCH_SYSTEM = `You are Signal, helping a product manager win quarterly engineering intake. You write a concise, evidence-backed one-page engineering pitch for a v2 fix.

You return ONLY a single valid JSON object. No markdown, no code fences, no commentary.

Rules:
- Ground every claim in the provided feedback. Do not invent metrics, users, or incidents that are not supported by it.
- Quotes MUST be copied verbatim from the provided feedback text (exact substrings). Never invent or paraphrase quotes.
- "Proposed direction" is a direction, not a full spec: 3–5 concrete bullets.
- "The ask" states what the PM needs from engineering this quarter (people, rough time, decisions), sized realistically.
- Tone: calm, confident, specific. Written for engineering leads.`;

export function pitchPrompt(req: PitchRequest): string {
  const { item, context, linkedFeedback, projectName } = req;
  const fb = linkedFeedback.map((f, i) => `[${i}] (${f.source}) ${f.text}`).join("\n");
  const ref =
    item.refType === "goal"
      ? `PRD goal affected: ${context.goal ?? item.title}\nScorecard verdict: ${context.verdict ?? "n/a"}`
      : `Unplanned issue (not in the PRD). Theme summary: ${context.summary ?? "n/a"}`;
  return `Project: ${projectName || "Untitled project"}
Fix-next item: ${item.title}
${ref}
Scores: ${scoreLine(item)}

Linked feedback (${linkedFeedback.length} items):
${fb}

Return JSON with exactly this shape:
{
  "title": "<action-oriented pitch title>",
  "problem": "<2-3 sentences>",
  "evidence": { "feedbackCount": ${linkedFeedback.length}, "sources": { "<source>": <count> }, "quotes": ["<3-4 verbatim quotes>"] },
  "prdGoal": "${item.refType === "goal" ? "<the PRD goal text>" : "Unplanned issue"}",
  "whoAffected": "<who and roughly how many>",
  "impactIfUnsolved": "<1-2 sentences>",
  "proposedDirection": ["<3-5 bullets>"],
  "ask": "<what the PM needs from engineering this quarter>"
}`;
}

function scoreLine(item: FixNextItem): string {
  const s = item.scores;
  return `Work stoppage ${s.stoppage.value}/5 (${s.stoppage.rationale}); User impact ${s.impact.value}/5 (${s.impact.rationale}); Urgency ${s.urgency.value}/5 (${s.urgency.rationale}); Total ${item.total}/15`;
}
