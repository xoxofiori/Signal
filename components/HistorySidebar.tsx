import type { SavedRun } from "@/lib/history";

interface Props {
  runs: SavedRun[];
  activeId: string | null;
  disabled: boolean;
  onNew: () => void;
  onOpen: (run: SavedRun) => void;
  onDelete: (id: string) => void;
}

export default function HistorySidebar({ runs, activeId, disabled, onNew, onOpen, onDelete }: Props) {
  return (
    <aside className="sticky top-[82px] hidden h-[calc(100vh-98px)] w-60 shrink-0 flex-col rounded-[24px] border border-white/70 bg-white/55 p-2 shadow-[0_1px_2px_rgba(28,26,23,0.05),0_10px_30px_-16px_rgba(28,26,23,0.18)] backdrop-blur-xl md:flex">
      <button
        type="button"
        onClick={onNew}
        disabled={disabled}
        className="btn justify-start gap-2.5 rounded-xl px-2.5 py-2 text-[15px] text-ink hover:bg-surface disabled:opacity-50"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface" aria-hidden>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M7 2v10M2 7h10" />
          </svg>
        </span>
        New
      </button>

      <p className="mt-5 px-2.5 pb-1.5 text-[13px] text-muted">Previous</p>
      <nav className="-mr-1 min-h-0 flex-1 overflow-y-auto pr-1">
        {runs.length === 0 ? (
          <p className="px-2.5 py-1 text-[13px] leading-snug text-muted">Scorecards you run will show up here.</p>
        ) : (
          <ul className="space-y-0.5">
            {runs.map((run) => {
              const active = run.id === activeId;
              const title = run.analysis.projectName || "Untitled project";
              return (
                <li key={run.id} className="group relative">
                  <button
                    type="button"
                    onClick={() => onOpen(run)}
                    disabled={disabled}
                    title={`${title} · ${new Date(run.createdAt).toLocaleString()}`}
                    className={`flex w-full items-center gap-2.5 rounded-xl py-2 pl-3 pr-8 text-left text-[14px] transition-colors disabled:opacity-50 ${
                      active ? "bg-surface text-ink" : "text-[#3a3631] hover:bg-surface/70"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${active ? "bg-highlight" : "border border-muted/60"}`}
                      aria-hidden
                    />
                    <span className="truncate">{title}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(run.id)}
                    disabled={disabled}
                    aria-label={`Delete ${title}`}
                    className="absolute right-1.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-muted opacity-0 transition-opacity hover:bg-bg hover:text-ink focus-visible:opacity-100 group-hover:opacity-100"
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
                      <path d="M2 2l6 6M8 2l-6 6" />
                    </svg>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </nav>
    </aside>
  );
}
