import demoPitches from "@/data/demo-pitches.json";
import demoScorecard from "@/data/demo-scorecard.json";
import { SAMPLE_FEEDBACK, SAMPLE_GOALS, SAMPLE_PROJECT_NAME } from "@/data/sample";
import { parseFeedback, parseGoals } from "./parse";
import { PitchSchema, ScorecardSchema } from "./schemas";
import type { FeedbackItem, Pitch, Scorecard } from "./types";

export const DEMO_SCORECARD: Scorecard = ScorecardSchema.parse(demoScorecard);
const DEMO_PITCHES: Record<string, Pitch> = Object.fromEntries(
  Object.entries(demoPitches).map(([k, v]) => [k, PitchSchema.parse(v)]),
);

export const DEMO_FEEDBACK = parseFeedback(SAMPLE_FEEDBACK);

export function demoPitch(fixId: string): Pitch | null {
  return DEMO_PITCHES[fixId] ?? null;
}

export function matchesSample(projectName: string, goals: string[], feedback: FeedbackItem[]): boolean {
  const key = (p: string, g: string[], f: FeedbackItem[]) =>
    JSON.stringify([p.trim(), g, f.map((x) => [x.source, x.text])]);
  return (
    key(projectName, goals, feedback) ===
    key(SAMPLE_PROJECT_NAME, parseGoals(SAMPLE_GOALS), DEMO_FEEDBACK)
  );
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
