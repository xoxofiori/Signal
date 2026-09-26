export type Step = "input" | "scorecard" | "pitch";

const STEPS: { key: Step; label: string }[] = [
  { key: "input", label: "Input" },
  { key: "scorecard", label: "Scorecard" },
  { key: "pitch", label: "Pitch" },
];

export default function Stepper({
  current,
  reachable,
  onSelect,
}: {
  current: Step;
  reachable: Record<Step, boolean>;
  onSelect: (s: Step) => void;
}) {
  const currentIdx = STEPS.findIndex((s) => s.key === current);
  return (
    <nav aria-label="Progress">
      <ol className="flex items-center gap-2 text-sm">
        {STEPS.map((s, i) => {
          const active = s.key === current;
          const done = i < currentIdx;
          const clickable = reachable[s.key] && !active;
          return (
            <li key={s.key} className="flex items-center gap-2">
              {i > 0 && (
                <span
                  className={`h-px w-8 sm:w-12 ${i <= currentIdx ? "bg-accent" : "bg-line"}`}
                  aria-hidden
                />
              )}
              <button
                type="button"
                disabled={!clickable}
                onClick={() => onSelect(s.key)}
                aria-current={active ? "step" : undefined}
                className={`flex items-center gap-2 rounded-full px-1 py-0.5 outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  clickable ? "cursor-pointer hover:text-accent" : "cursor-default"
                }`}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                    active
                      ? "bg-accent text-white"
                      : done
                        ? "bg-accent-soft text-accent"
                        : "border border-line bg-bg text-muted"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </span>
                <span className={active ? "font-semibold text-ink" : "text-muted"}>
                  {s.label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
