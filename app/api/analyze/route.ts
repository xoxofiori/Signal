import { NextResponse } from "next/server";
import { FriendlyError, generateJson, hasApiKey } from "@/lib/anthropic";
import { DEMO_SCORECARD, matchesSample, sleep } from "@/lib/demo";
import { checkScorecard, normalizeScorecard } from "@/lib/normalize";
import { ANALYZE_SYSTEM, analyzePrompt } from "@/lib/prompts";
import { AnalyzeRequestSchema, ScorecardSchema } from "@/lib/schemas";
import type { AnalyzeResponse, ApiError } from "@/lib/types";

export const maxDuration = 300;

export async function POST(req: Request): Promise<NextResponse<AnalyzeResponse | ApiError>> {
  const body = AnalyzeRequestSchema.safeParse(await req.json().catch(() => null));
  if (!body.success) {
    return NextResponse.json(
      { error: "Add at least one PRD goal and one feedback item, then try again." },
      { status: 400 },
    );
  }
  const { projectName, goals, feedback } = body.data;

  if (!hasApiKey()) {
    await sleep(1500);
    return NextResponse.json({
      scorecard: DEMO_SCORECARD,
      mode: "demo",
      inputsEdited: !matchesSample(projectName, goals, feedback),
    });
  }

  try {
    const raw = await generateJson({
      system: ANALYZE_SYSTEM,
      prompt: analyzePrompt(projectName, goals, feedback),
      schema: ScorecardSchema,
      check: (sc) => checkScorecard(sc, goals.length),
    });
    return NextResponse.json({ scorecard: normalizeScorecard(raw, goals, feedback), mode: "live" });
  } catch (err) {
    const e = err instanceof FriendlyError ? err : new FriendlyError("Analysis failed. Please try again.", 500);
    return NextResponse.json({ error: e.message }, { status: e.status });
  }
}
