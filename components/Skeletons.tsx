function Bar({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-[#e9e2d6] ${className}`} />;
}

const card = "card";

export function ScorecardSkeleton({ label }: { label: string }) {
  return (
    <div className="space-y-8" aria-busy="true" aria-live="polite">
      <p className="flex items-center gap-2 text-sm text-muted">
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-highlight/30 border-t-highlight" aria-hidden />
        {label}
      </p>
      <div className={`grid grid-cols-2 sm:grid-cols-5 ${card}`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-3 border-r border-line px-5 py-4 last:border-r-0">
            <Bar className="h-3 w-20" />
            <Bar className="h-7 w-10" />
          </div>
        ))}
      </div>
      <div>
        <Bar className="mb-4 h-5 w-32" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={`space-y-3 p-5 ${card}`}>
              <Bar className="h-5 w-20 rounded-full" />
              <Bar className="h-4 w-11/12" />
              <Bar className="h-3 w-full" />
              <Bar className="h-3 w-4/5" />
              <div className="space-y-2 border-l-2 border-line pl-3 pt-1">
                <Bar className="h-3 w-full" />
                <Bar className="h-3 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={`divide-y divide-line ${card}`}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-6 px-5 py-4">
            <div className="flex-1 space-y-2.5">
              <Bar className="h-4 w-1/2" />
              <div className="flex gap-2">
                <Bar className="h-5 w-24" />
                <Bar className="h-5 w-24" />
                <Bar className="h-5 w-24" />
              </div>
            </div>
            <Bar className="h-7 w-10" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PitchSkeleton() {
  return (
    <div className={`mx-auto max-w-[800px] space-y-7 px-8 py-10 sm:px-14 ${card}`} aria-busy="true" aria-live="polite">
      <p className="flex items-center gap-2 text-sm text-muted">
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-highlight/30 border-t-highlight" aria-hidden />
        Writing the engineering pitch…
      </p>
      <div className="space-y-3">
        <Bar className="h-3 w-40" />
        <Bar className="h-7 w-4/5" />
        <Bar className="h-14 w-full rounded-lg" />
      </div>
      {[3, 4, 2, 4].map((lines, i) => (
        <div key={i} className="space-y-2.5">
          <Bar className="h-3 w-28" />
          {Array.from({ length: lines }).map((_, j) => (
            <Bar key={j} className={`h-3 ${j === lines - 1 ? "w-2/3" : "w-full"}`} />
          ))}
        </div>
      ))}
    </div>
  );
}
