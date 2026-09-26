export default function DemoBadge() {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800"
      title="No ANTHROPIC_API_KEY found. Add one to .env.local for live analysis."
    >
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden />
      Demo mode — using sample analysis
    </span>
  );
}
