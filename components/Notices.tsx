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
    <div role="alert" className="mx-auto max-w-[640px] rounded-xl border border-red-200 bg-bg p-6 shadow-[0_1px_2px_rgba(28,25,23,0.04)]">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-50 text-sm font-bold text-failing" aria-hidden>
          !
        </span>
        <div>
          <h2 className="text-[15px] font-semibold">{title}</h2>
          <p className="mt-1 text-sm leading-relaxed text-stone-700">{message}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="rounded-lg bg-accent px-3.5 py-2 text-sm font-semibold text-white hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Try again
              </button>
            )}
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="rounded-lg border border-line px-3.5 py-2 text-sm font-medium hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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
    <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <span aria-hidden className="mt-px font-bold">i</span>
      <p>
        <span className="font-semibold">Showing the sample analysis.</span> Add an{" "}
        <code className="rounded bg-amber-100 px-1 py-0.5 text-[13px]">ANTHROPIC_API_KEY</code> in{" "}
        <code className="rounded bg-amber-100 px-1 py-0.5 text-[13px]">.env.local</code> to analyze your own data.
      </p>
    </div>
  );
}
