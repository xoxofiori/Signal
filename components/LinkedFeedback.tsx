"use client";

import { useState } from "react";
import type { FeedbackItem } from "@/lib/types";

export default function LinkedFeedback({ ids, feedback }: { ids: number[]; feedback: FeedbackItem[] }) {
  const [open, setOpen] = useState(false);
  if (!ids.length) return null;
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="inline-flex items-center gap-1 text-[13px] font-medium text-ink underline decoration-line underline-offset-4 hover:decoration-highlight focus-visible:outline-2 focus-visible:outline-highlight"
      >
        <span className={`inline-block transition-transform ${open ? "rotate-90" : ""}`} aria-hidden>
          ›
        </span>
        {open ? "Hide" : "Show"} all {ids.length} linked item{ids.length === 1 ? "" : "s"}
      </button>
      {open && (
        <ul className="mt-2 space-y-1.5 rounded-2xl bg-surface p-3">
          {ids.map((id) => {
            const f = feedback[id];
            if (!f) return null;
            return (
              <li key={id} className="flex gap-2 text-[13px] leading-relaxed">
                <span className="eyebrow mt-1 w-[92px] shrink-0 text-muted">{f.source}</span>
                <span className="text-[#3d3831]">{f.text}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
