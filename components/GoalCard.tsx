import type { FeedbackItem, GoalResult } from "@/lib/types";
import LinkedFeedback from "./LinkedFeedback";
import Quote from "./Quote";
import SourceBreakdown from "./SourceBreakdown";
import StatusBadge from "./StatusBadge";

export default function GoalCard({ goal, index, feedback }: { goal: GoalResult; index: number; feedback: FeedbackItem[] }) {
  const n = goal.feedbackIds.length;
  return (
    <article className="flex flex-col gap-3 card p-5">
      <div className="flex items-center justify-between gap-2">
        <StatusBadge status={goal.status} />
        <span className="eyebrow text-muted">Goal {String(index + 1).padStart(2, "0")}</span>
      </div>
      <h3 className="text-[15px] font-semibold leading-snug">{goal.goal}</h3>
      <p className="text-sm leading-relaxed text-[#5f574b]">{goal.verdict}</p>
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
        <span className="font-medium text-ink">
          {n} linked item{n === 1 ? "" : "s"}
        </span>
        <SourceBreakdown breakdown={goal.sourceBreakdown} />
      </div>
      {goal.quotes.length > 0 && (
        <div className="space-y-2">
          {goal.quotes.slice(0, 2).map((q) => (
            <Quote key={q} text={q} />
          ))}
        </div>
      )}
      <div className="mt-auto pt-1">
        <LinkedFeedback ids={goal.feedbackIds} feedback={feedback} />
      </div>
    </article>
  );
}
