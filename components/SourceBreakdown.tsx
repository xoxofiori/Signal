const ORDER = ["Slack", "Sync", "Widget", "Observation", "Other"];

export default function SourceBreakdown({ breakdown }: { breakdown: Record<string, number> }) {
  const rank = (s: string) => (ORDER.includes(s) ? ORDER.indexOf(s) : ORDER.length);
  const entries = Object.entries(breakdown).sort((a, b) => rank(a[0]) - rank(b[0]));
  if (!entries.length) return null;
  return (
    <span className="flex flex-wrap gap-1">
      {entries.map(([source, n]) => (
        <span key={source} className="rounded-full bg-surface px-2 py-0.5 text-xs text-muted">
          {source} <span className="font-medium text-ink">{n}</span>
        </span>
      ))}
    </span>
  );
}
