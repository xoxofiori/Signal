import { z } from "zod";

export const SOURCES = ["Slack", "Sync", "Widget", "Observation", "Other"] as const;

export const StatusSchema = z.enum(["working", "at_risk", "failing"]);

export const FeedbackItemSchema = z.object({
  source: z.string().min(1),
  text: z.string().min(1),
});

export const AnalyzeRequestSchema = z.object({
  projectName: z.string().default(""),
  goals: z.array(z.string().min(1)).min(1).max(20),
  feedback: z.array(FeedbackItemSchema).min(1).max(500),
});

const ScoreSchema = z.object({
  value: z.number().int().min(1).max(5),
  rationale: z.string().min(1),
});

export const GoalResultSchema = z.object({
  id: z.string().min(1),
  goal: z.string().min(1),
  status: StatusSchema,
  verdict: z.string().min(1),
  feedbackIds: z.array(z.number().int().nonnegative()),
  sourceBreakdown: z.record(z.string(), z.number().int().nonnegative()),
  quotes: z.array(z.string()),
});

export const UnplannedThemeSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  feedbackIds: z.array(z.number().int().nonnegative()),
  quotes: z.array(z.string()),
});

export const FixNextItemSchema = z.object({
  id: z.string().min(1),
  refType: z.enum(["goal", "unplanned"]),
  refId: z.string().min(1),
  title: z.string().min(1),
  scores: z.object({
    stoppage: ScoreSchema,
    impact: ScoreSchema,
    urgency: ScoreSchema,
  }),
  total: z.number(),
});

export const ScorecardSchema = z.object({
  summary: z.object({
    totalFeedback: z.number().int().nonnegative(),
    working: z.number().int().nonnegative(),
    atRisk: z.number().int().nonnegative(),
    failing: z.number().int().nonnegative(),
    unplannedCount: z.number().int().nonnegative(),
  }),
  goals: z.array(GoalResultSchema),
  unplanned: z.array(UnplannedThemeSchema),
  fixNext: z.array(FixNextItemSchema),
});

export const PitchRequestSchema = z.object({
  projectName: z.string().default(""),
  item: FixNextItemSchema,
  context: z.object({
    goal: z.string().optional(),
    verdict: z.string().optional(),
    summary: z.string().optional(),
  }),
  linkedFeedback: z.array(FeedbackItemSchema),
});

export const PitchSchema = z.object({
  title: z.string().min(1),
  problem: z.string().min(1),
  evidence: z.object({
    feedbackCount: z.number().int().nonnegative(),
    sources: z.record(z.string(), z.number().int().nonnegative()),
    quotes: z.array(z.string()),
  }),
  prdGoal: z.string().min(1),
  whoAffected: z.string().min(1),
  impactIfUnsolved: z.string().min(1),
  proposedDirection: z.array(z.string().min(1)).min(1),
  ask: z.string().min(1),
});
