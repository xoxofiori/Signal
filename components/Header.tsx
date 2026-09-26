import DemoBadge from "./DemoBadge";

export default function Header({ demoMode }: { demoMode: boolean }) {
  return (
    <header className="border-b border-line bg-bg">
      <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-3 px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <SignalMark />
            <span className="text-lg font-semibold tracking-tight">Signal</span>
          </div>
          <p className="hidden text-[13px] text-muted md:block">
            ChatPRD helps you write the PRD. Signal tells you if it worked — and
            what the next one should be.
          </p>
        </div>
        {demoMode ? <DemoBadge /> : <LiveBadge />}
      </div>
    </header>
  );
}

function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 text-xs font-medium text-muted">
      <span className="h-1.5 w-1.5 rounded-full bg-working" aria-hidden />
      Live AI analysis
    </span>
  );
}

function SignalMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden>
      <rect width="22" height="22" rx="6" fill="#4F46E5" />
      <rect x="5" y="12" width="2.5" height="5" rx="1" fill="white" />
      <rect x="9.75" y="8.5" width="2.5" height="8.5" rx="1" fill="white" />
      <rect x="14.5" y="5" width="2.5" height="12" rx="1" fill="white" />
    </svg>
  );
}
