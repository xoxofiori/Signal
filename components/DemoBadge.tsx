export default function DemoBadge() {
  return (
    <span
      className="eyebrow inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-white"
      title="No ANTHROPIC_API_KEY found. Add one to .env.local for live analysis."
    >
      <span className="h-1.5 w-1.5 rounded-full bg-highlight" aria-hidden />
      Demo mode — using sample analysis
    </span>
  );
}
