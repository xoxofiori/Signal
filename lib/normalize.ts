import type { FeedbackItem, Pitch, Scorecard, Status } from "./types";

const squash = (s: string) =>
  s.toLowerCase().replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/\s+/g, " ").trim();

/** Keep only quotes that appear verbatim in `sources`; fall back to the source texts. */
export function verbatimQuotes(quotes: string[], sources: string[], max: number): string[] {
  const pool = sources.map(squash);
  const kept = quotes
    .map((q) => q.trim().replace(/^["“']|["”']$/g, ""))
    .filter((q) => q.length > 0 && pool.some((p) => p.includes(squash(q))));
  const unique = [...new Set(kept)];
  for (const s of sources) {
    if (unique.length >= Math.min(max, sources.length)) break;
    if (!unique.some((q) => squash(s).includes(squash(q)))) unique.push(s);
  }
  return unique.slice(0, max);
}

export function sourceBreakdown(ids: number[], feedback: FeedbackItem[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const i of ids) out[feedback[i].source] = (out[feedback[i].source] ?? 0) + 1;
  return out;
}

/** Structural problems worth a retry. Returns null when usable. */
export function checkScorecard(sc: Scorecard, goalCount: number): string | null {
  if (sc.goals.length !== goalCount) {
    return `expected ${goalCount} goals but got ${sc.goals.length}`;
  }
  return null;
}

/**
 * Make model output internally consistent: clamp ids to the input, enforce
 * verbatim quotes, recompute counts/totals, and sort fix-next by total.
 */
export function normalizeScorecard(sc: Scorecard, goals: string[], feedback: FeedbackItem[]): Scorecard {
  const valid = (ids: number[]) =>
    [...new Set(ids)].filter((i) => Number.isInteger(i) && i >= 0 && i < feedback.length).sort((a, b) => a - b);
  const texts = (ids: number[]) => ids.map((i) => feedback[i].text);

  const goalResults = sc.goals.map((g, i) => {
    const ids = valid(g.feedbackIds);
    return {
      ...g,
      id: `g${i + 1}`,
      goal: goals[i] ?? g.goal,
      feedbackIds: ids,
      sourceBreakdown: sourceBreakdown(ids, feedback),
      quotes: verbatimQuotes(g.quotes, texts(ids), 3),
    };
  });

  const unplanned = sc.unplanned
    .map((u, i) => {
      const ids = valid(u.feedbackIds);
      return { ...u, id: u.id || `u${i + 1}`, feedbackIds: ids, quotes: verbatimQuotes(u.quotes, texts(ids), 3) };
    })
    .filter((u) => u.feedbackIds.length > 0);

  const refs = new Set([...goalResults.map((g) => g.id), ...unplanned.map((u) => u.id)]);
  const seen = new Set<string>();
  const fixNext = sc.fixNext
    .filter((f) => refs.has(f.refId) && !seen.has(f.refId) && seen.add(f.refId))
    .map((f) => ({
      ...f,
      refType: f.refId.startsWith("u") ? ("unplanned" as const) : ("goal" as const),
      total: f.scores.stoppage.value + f.scores.impact.value + f.scores.urgency.value,
    }))
    .sort((a, b) => b.total - a.total)
    .map((f, i) => ({ ...f, id: `f${i + 1}` }));

  const count = (s: Status) => goalResults.filter((g) => g.status === s).length;
  return {
    summary: {
      totalFeedback: feedback.length,
      working: count("working"),
      atRisk: count("at_risk"),
      failing: count("failing"),
      unplannedCount: unplanned.length,
    },
    goals: goalResults,
    unplanned,
    fixNext,
  };
}

export function normalizePitch(p: Pitch, linked: FeedbackItem[], prdGoal: string): Pitch {
  return {
    ...p,
    prdGoal,
    evidence: {
      feedbackCount: linked.length,
      sources: sourceBreakdown(linked.map((_, i) => i), linked),
      quotes: verbatimQuotes(p.evidence.quotes, linked.map((f) => f.text), 4),
    },
    proposedDirection: p.proposedDirection.slice(0, 5),
  };
}
