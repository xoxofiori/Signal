import type { Status } from "@/lib/types";

export const STATUS_META: Record<Status, { label: string; cls: string; dot: string; rank: number }> = {
  failing: { label: "Failing", cls: "border-red-200 bg-red-50 text-red-700", dot: "bg-failing", rank: 0 },
  at_risk: { label: "At risk", cls: "border-amber-200 bg-amber-50 text-amber-800", dot: "bg-risk", rank: 1 },
  working: { label: "Working", cls: "border-green-200 bg-green-50 text-green-700", dot: "bg-working", rank: 2 },
};

export default function StatusBadge({ status }: { status: Status }) {
  const m = STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-semibold ${m.cls}`}>
      <StatusIcon status={status} />
      {m.label}
    </span>
  );
}

/** Shape differs per status so it doesn't rely on color alone. */
function StatusIcon({ status }: { status: Status }) {
  const common = { width: 12, height: 12, viewBox: "0 0 12 12", "aria-hidden": true } as const;
  if (status === "working")
    return (
      <svg {...common}>
        <circle cx="6" cy="6" r="6" fill="#16A34A" />
        <path d="M3.5 6.2 5.2 7.8 8.5 4.3" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (status === "at_risk")
    return (
      <svg {...common}>
        <path d="M6 0.8 11.4 10.6H0.6Z" fill="#D97706" strokeLinejoin="round" />
        <path d="M6 4.3v3" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="6" cy="8.9" r="0.75" fill="white" />
      </svg>
    );
  return (
    <svg {...common}>
      <circle cx="6" cy="6" r="6" fill="#DC2626" />
      <path d="M4 4 8 8M8 4 4 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
