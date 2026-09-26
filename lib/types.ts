import type { z } from "zod";
import type {
  AnalyzeRequestSchema,
  FeedbackItemSchema,
  FixNextItemSchema,
  GoalResultSchema,
  PitchRequestSchema,
  PitchSchema,
  ScorecardSchema,
  StatusSchema,
  UnplannedThemeSchema,
} from "./schemas";

export type Status = z.infer<typeof StatusSchema>;
export type FeedbackItem = z.infer<typeof FeedbackItemSchema>;
export type AnalyzeRequest = z.infer<typeof AnalyzeRequestSchema>;
export type GoalResult = z.infer<typeof GoalResultSchema>;
export type UnplannedTheme = z.infer<typeof UnplannedThemeSchema>;
export type FixNextItem = z.infer<typeof FixNextItemSchema>;
export type Scorecard = z.infer<typeof ScorecardSchema>;
export type PitchRequest = z.infer<typeof PitchRequestSchema>;
export type Pitch = z.infer<typeof PitchSchema>;

export type Mode = "demo" | "live";

export interface AnalyzeResponse {
  scorecard: Scorecard;
  mode: Mode;
  /** In demo mode: true when the submitted inputs differ from the sample. */
  inputsEdited?: boolean;
}

export interface PitchResponse {
  pitch: Pitch;
  mode: Mode;
}

export interface ApiError {
  error: string;
}
