import DemoBadge from "./DemoBadge";
import Logo from "./Logo";

export default function Header({ demoMode }: { demoMode: boolean }) {
  return (
    <header className="sticky top-0 z-20 px-4 pt-4">
      <div className="flex w-full flex-wrap items-center justify-between gap-3 rounded-full border border-white/70 bg-white/55 py-2 pl-4 pr-2 shadow-[0_1px_2px_rgba(28,26,23,0.05),0_10px_30px_-16px_rgba(28,26,23,0.18)] backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[#3a3a3a]">
            <Logo size={26} />
            <span className="text-[19px] font-semibold tracking-tight text-ink">Signal</span>
          </div>
          <span className="hidden h-4 w-px bg-line md:block" aria-hidden />
          <p className="hidden text-[13px] text-muted md:block">
            ChatPRD helps you write the PRD. Signal tells you if it worked — and what the next one should be.
          </p>
        </div>
        {demoMode ? <DemoBadge /> : <LiveBadge />}
      </div>
    </header>
  );
}

function LiveBadge() {
  return (
    <span className="eyebrow inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-white">
      <span className="h-1.5 w-1.5 rounded-full bg-working" aria-hidden />
      Live AI analysis
    </span>
  );
}
