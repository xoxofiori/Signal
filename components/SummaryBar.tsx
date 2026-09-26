import type { Scorecard } from "@/lib/types";
import StatusBadge from "./StatusBadge";

export default function SummaryBar({ summary, goalCount }: { summary: Scorecard["summary"]; goalCount: number }) {
  return (
    <div className="card grid grid-cols-2 overflow-hidden sm:grid-cols-5">
      <Tile value={summary.totalFeedback} label="Feedback items" />
      <Tile value={summary.failing} label={<StatusBadge status="failing" />} sub={`of ${goalCount} goals`} />
      <Tile value={summary.atRisk} label={<StatusBadge status="at_risk" />} sub={`of ${goalCount} goals`} />
      <Tile value={summary.working} label={<StatusBadge status="working" />} sub={`of ${goalCount} goals`} />
      <Tile value={summary.unplannedCount} label="Unplanned issues" sub="not in the PRD" />
    </div>
  );
}

function Tile({ value, label, sub }: { value: number; label: React.ReactNode; sub?: string }) {
  return (
    <div className="border-b border-r border-line px-5 py-4 last:border-r-0 sm:border-b-0">
      <div className="eyebrow text-muted">{label}</div>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="font-display text-[42px] leading-[0.95] tabular-nums">{value}</span>
        {sub && <span className="text-xs text-muted">{sub}</span>}
      </div>
    </div>
  );
}
