import type { FixNextItem, Scorecard } from "@/lib/types";
import StatusBadge from "./StatusBadge";
import { SectionTitle } from "./UnplannedSection";

const DIMENSIONS = [
  { key: "stoppage", label: "Work stoppage" },
  { key: "impact", label: "User impact" },
  { key: "urgency", label: "Urgency" },
] as const;

export default function FixNextList({
  scorecard,
  onPitch,
  pitchReady,
}: {
  scorecard: Scorecard;
  onPitch: (item: FixNextItem) => void;
  pitchReady: Set<string>;
}) {
  const { fixNext, goals } = scorecard;
  return (
    <section>
      <SectionTitle
        title="Fix next"
        sub="Every failing or at-risk goal and unplanned theme, scored 1–5 on work stoppage risk, user impact, and urgency."
        right={<span className="text-xs text-muted">Sorted by total score (max 15)</span>}
      />
      {fixNext.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line bg-bg px-5 py-6 text-sm text-muted">
          Nothing to fix. All goals are working and no unplanned issues were found.
        </p>
      ) : (
        <ol className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-bg shadow-[0_1px_2px_rgba(28,25,23,0.04)]">
          {fixNext.map((item, i) => {
            const goalIdx = goals.findIndex((g) => g.id === item.refId);
            const goal = goals[goalIdx];
            return (
              <li key={item.id} className="grid grid-cols-[28px_1fr] gap-x-3 px-5 py-4 md:grid-cols-[28px_1fr_auto]">
                <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-surface text-xs font-semibold text-muted">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[15px] font-semibold leading-snug">{item.title}</h3>
                    {goal ? (
                      <span className="flex items-center gap-1.5 text-xs text-muted">
                        <StatusBadge status={goal.status} /> Goal {goalIdx + 1}
                      </span>
                    ) : (
                      <span className="rounded-full border border-line bg-surface px-2 py-0.5 text-xs font-semibold text-stone-700">
                        Unplanned
                      </span>
                    )}
                  </div>
                  <dl className="mt-2.5 grid gap-x-4 gap-y-2 lg:grid-cols-3">
                    {DIMENSIONS.map((d) => {
                      const s = item.scores[d.key];
                      return (
                        <div key={d.key} className="min-w-0">
                          <dt>
                            <span className="inline-flex items-center gap-1 rounded-md border border-line bg-surface px-1.5 py-0.5 text-xs text-stone-700">
                              {d.label}
                              <span className="font-semibold text-ink tabular-nums">{s.value}</span>
                              <span className="text-muted">/5</span>
                            </span>
                          </dt>
                          <dd className="mt-1 text-xs leading-snug text-muted">{s.rationale}</dd>
                        </div>
                      );
                    })}
                  </dl>
                </div>
                <div className="col-start-2 mt-3 flex items-center gap-4 md:col-start-3 md:mt-0 md:flex-col md:items-end md:justify-between">
                  <div className="text-right">
                    <span className="text-[26px] font-semibold leading-none tabular-nums">{item.total}</span>
                    <span className="text-xs text-muted"> /15</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onPitch(item)}
                    className="whitespace-nowrap rounded-lg border border-accent/30 bg-accent-soft px-3 py-1.5 text-[13px] font-semibold text-accent hover:bg-accent hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {pitchReady.has(item.id) ? "View eng pitch →" : "Generate eng pitch →"}
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
