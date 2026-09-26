import { SOURCES } from "./schemas";
import type { FeedbackItem } from "./types";

const TAG_RE = /^\s*\[([^\]]+)\]\s*/;

/** One goal per line; strips list markers like "1.", "-", "•". */
export function parseGoals(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.replace(/^\s*(?:\d+[.)]|[-*•])\s*/, "").trim())
    .filter(Boolean);
}

/** One feedback item per line, with an optional leading [Source] tag. */
export function parseFeedback(text: string): FeedbackItem[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const m = line.match(TAG_RE);
      if (!m) return { source: "Other", text: line };
      const tag = m[1].trim().toLowerCase();
      const source =
        SOURCES.find((s) => s.toLowerCase() === tag) ?? "Other";
      return { source, text: line.slice(m[0].length).trim() || line };
    });
}
