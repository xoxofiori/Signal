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
      <ol className="flex items-center gap-2 rounded-full border border-line bg-bg/70 p-1.5 text-sm backdrop-blur">
        {STEPS.map((s, i) => {
          const active = s.key === current;
          const done = i < currentIdx;
          const clickable = reachable[s.key] && !active;
          return (
            <li key={s.key} className="flex items-center gap-2">
              {i > 0 && (
                <span
                  className={`h-px w-4 sm:w-6 ${i <= currentIdx ? "bg-ink" : "bg-line"}`}
                  aria-hidden
                />
              )}
              <button
                type="button"
                disabled={!clickable}
                onClick={() => onSelect(s.key)}
                aria-current={active ? "step" : undefined}
                className={`flex items-center gap-2 rounded-full py-1 pl-1 pr-3 outline-none focus-visible:ring-2 focus-visible:ring-highlight ${
                  active ? "bg-ink text-white" : ""
                } ${clickable ? "cursor-pointer hover:bg-surface" : "cursor-default"}`}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                    active
                      ? "bg-white text-ink"
                      : done
                        ? "bg-highlight text-white"
                        : "border border-line bg-bg text-muted"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </span>
                <span className={active ? "font-medium text-white" : done ? "text-ink" : "text-muted"}>
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
