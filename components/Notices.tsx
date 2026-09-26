export function ErrorState({
  title,
  message,
  onRetry,
  onBack,
  backLabel,
}: {
  title: string;
  message: string;
  onRetry?: () => void;
  onBack?: () => void;
  backLabel?: string;
}) {
  return (
    <div role="alert" className="mx-auto max-w-[640px] rounded-xl border border-red-200 bg-bg p-6">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-50 text-sm font-bold text-failing" aria-hidden>
          !
        </span>
        <div>
          <h2 className="text-[15px] font-semibold">{title}</h2>
          <p className="mt-1 text-sm leading-relaxed text-[#5f574b]">{message}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="btn btn-primary px-4 py-2"
              >
                Try again
              </button>
            )}
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="btn btn-secondary px-4 py-2"
              >
                {backLabel ?? "Back"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function DemoEditedNotice() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-[#f5cdb4] bg-highlight-soft px-4 py-3 text-sm text-[#7a3413]">
      <span aria-hidden className="mt-px font-bold">i</span>
      <p>
        <span className="font-semibold">Showing the sample analysis.</span> Add an{" "}
        <code className="rounded bg-white/70 px-1 py-0.5 font-mono text-[12.5px]">ANTHROPIC_API_KEY</code> in{" "}
        <code className="rounded bg-white/70 px-1 py-0.5 font-mono text-[12.5px]">.env.local</code> to analyze your own data.
      </p>
    </div>
  );
}
