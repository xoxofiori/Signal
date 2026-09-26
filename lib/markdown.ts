import type { FixNextItem, Pitch } from "./types";

export function pitchToMarkdown(p: Pitch, projectName: string, item?: FixNextItem): string {
  const sources = Object.entries(p.evidence.sources)
    .map(([s, n]) => `${s} (${n})`)
    .join(", ");
  return [
    `# ${p.title}`,
    projectName ? `_Engineering pitch · ${projectName} · prepared with Signal_` : "_Engineering pitch · prepared with Signal_",
    "",
    ...(item
      ? [
          `**Priority score:** ${item.total}/15 (work stoppage ${item.scores.stoppage.value}/5, user impact ${item.scores.impact.value}/5, urgency ${item.scores.urgency.value}/5)`,
          "",
        ]
      : []),
    "## Problem",
    p.problem,
    "",
    "## Evidence",
    `**${p.evidence.feedbackCount} feedback item${p.evidence.feedbackCount === 1 ? "" : "s"}** from ${sources || "—"}.`,
    "",
    ...p.evidence.quotes.map((q) => `> "${q}"\n`),
    "## PRD goal affected",
    p.prdGoal,
    "",
    "## Who's affected",
    p.whoAffected,
    "",
    "## Impact if unsolved",
    p.impactIfUnsolved,
    "",
    "## Proposed direction for v2",
    ...p.proposedDirection.map((d) => `- ${d}`),
    "",
    "## The ask",
    p.ask,
    "",
  ].join("\n");
}

export function chatPrdPrompt(p: Pitch, projectName: string, item?: FixNextItem): string {
  return `You are helping me write a v2 PRD. Below is an evidence-backed engineering pitch generated from post-launch feedback on ${projectName || "our shipped tool"}. Using it, write a v2 PRD that includes: problem statement, goals and measurable success criteria, non-goals, target users, user stories, functional requirements, open questions, and a rollout/measurement plan. Keep the requirements grounded in the evidence below. Do not invent new user quotes or metrics; flag assumptions as open questions.

---

${pitchToMarkdown(p, projectName, item)}`;
}
