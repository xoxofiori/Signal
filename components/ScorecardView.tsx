import type { FeedbackItem, FixNextItem, Scorecard } from "@/lib/types";
import FixNextList from "./FixNextList";
import GoalCard from "./GoalCard";
import { STATUS_META } from "./StatusBadge";
import SummaryBar from "./SummaryBar";
import UnplannedSection, { SectionTitle } from "./UnplannedSection";

export default function ScorecardView({
  scorecard,
  feedback,
  onPitch,
  pitchReady,
}: {
  scorecard: Scorecard;
  feedback: FeedbackItem[];
  onPitch: (item: FixNextItem) => void;
  pitchReady: Set<string>;
}) {
  const ordered = scorecard.goals
    .map((g, i) => ({ g, i }))
    .sort((a, b) => STATUS_META[a.g.status].rank - STATUS_META[b.g.status].rank || a.i - b.i);

  return (
    <div className="space-y-8">
      <SummaryBar summary={scorecard.summary} goalCount={scorecard.goals.length} />
      <section>
        <SectionTitle title="PRD goals" sub="How each goal performed after launch. Failing goals first." />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {ordered.map(({ g, i }) => (
            <GoalCard key={g.id} goal={g} index={i} feedback={feedback} />
          ))}
        </div>
      </section>
      <UnplannedSection themes={scorecard.unplanned} feedback={feedback} />
      <FixNextList scorecard={scorecard} onPitch={onPitch} pitchReady={pitchReady} />
    </div>
  );
}
