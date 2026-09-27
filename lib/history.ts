import type { InputValues } from "@/components/InputForm";
import type { AnalyzeResponse, Pitch } from "./types";

/** A past analysis, saved in this browser so it can be reopened from the sidebar. */
export interface SavedRun {
  id: string;
  createdAt: number;
  values: InputValues;
  analysis: AnalyzeResponse;
  pitches: Record<string, Pitch>;
}

const KEY = "signal:history";
const MAX_RUNS = 25;

export function newRunId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function loadRuns(): SavedRun[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as SavedRun[]) : [];
  } catch {
    return [];
  }
}

export function saveRuns(runs: SavedRun[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(runs.slice(0, MAX_RUNS)));
  } catch {
    // Storage full or blocked (private mode): history just won't persist.
  }
}
