import type { FeedbackItem, UnplannedTheme } from "@/lib/types";
import { sourceBreakdown } from "@/lib/normalize";
import LinkedFeedback from "./LinkedFeedback";
import Quote from "./Quote";
import SourceBreakdown from "./SourceBreakdown";

export default function UnplannedSection({ themes, feedback }: { themes: UnplannedTheme[]; feedback: FeedbackItem[] }) {
  return (
    <section>
      <SectionTitle
        title="Unplanned issues"
        sub="Feedback that doesn't map to any PRD goal, clustered into themes."
      />
      {themes.length === 0 ? (
        <p className="rounded-[1.25rem] border border-dashed border-line bg-bg/60 px-5 py-6 text-sm text-muted">
          No unplanned issues. Every piece of feedback mapped to a PRD goal.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {themes.map((t) => (
            <article key={t.id} className="flex flex-col gap-3 card p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="eyebrow rounded-full bg-highlight-soft px-2.5 py-1 text-highlight">Unplanned</span>
                <span className="eyebrow text-muted">
                  {t.feedbackIds.length} item{t.feedbackIds.length === 1 ? "" : "s"}
                </span>
              </div>
              <h3 className="text-[15px] font-semibold leading-snug">{t.title}</h3>
              <p className="text-sm leading-relaxed text-[#5f574b]">{t.summary}</p>
              <SourceBreakdown breakdown={sourceBreakdown(t.feedbackIds.filter((i) => feedback[i]), feedback)} />
              <div className="space-y-2">
                {t.quotes.slice(0, 2).map((q) => (
                  <Quote key={q} text={q} />
                ))}
              </div>
              <div className="mt-auto pt-1">
                <LinkedFeedback ids={t.feedbackIds} feedback={feedback} />
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export function SectionTitle({ title, sub, right }: { title: string; sub?: string; right?: React.ReactNode }) {
  return (
    <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
      <div>
        <h2 className="font-display text-[28px] leading-tight">{title}</h2>
        {sub && <p className="mt-0.5 text-[13px] text-muted">{sub}</p>}
      </div>
      {right}
    </div>
  );
}
