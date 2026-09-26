"use client";

import { useState } from "react";

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for browsers/contexts without the async clipboard API.
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}

export default function CopyButton({
  label,
  getText,
  primary = false,
}: {
  label: string;
  getText: () => string;
  primary?: boolean;
}) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  return (
    <button
      type="button"
      onClick={async () => {
        setState((await copyText(getText())) ? "copied" : "failed");
        setTimeout(() => setState("idle"), 1800);
      }}
      className={`inline-flex min-w-[170px] items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
        primary
          ? "bg-accent text-white shadow-sm hover:bg-accent-hover"
          : "border border-line bg-bg text-ink hover:bg-surface"
      }`}
      aria-live="polite"
    >
      {state === "copied" ? "✓ Copied!" : state === "failed" ? "Copy failed" : label}
    </button>
  );
}
