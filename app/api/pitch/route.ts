import { NextResponse } from "next/server";
import { FriendlyError, generateJson, hasApiKey } from "@/lib/anthropic";
import { DEMO_SCORECARD, demoPitch, sleep } from "@/lib/demo";
import { normalizePitch } from "@/lib/normalize";
import { PITCH_SYSTEM, pitchPrompt } from "@/lib/prompts";
import { PitchRequestSchema, PitchSchema } from "@/lib/schemas";
import type { ApiError, PitchResponse } from "@/lib/types";

export const maxDuration = 300;

export async function POST(req: Request): Promise<NextResponse<PitchResponse | ApiError>> {
  const body = PitchRequestSchema.safeParse(await req.json().catch(() => null));
  if (!body.success) {
    return NextResponse.json({ error: "That fix-next item couldn't be read. Re-run the analysis and try again." }, { status: 400 });
  }
  const { item, context, linkedFeedback } = body.data;

  if (!hasApiKey()) {
    await sleep(1200);
    const match = DEMO_SCORECARD.fixNext.find((f) => f.refId === item.refId) ?? DEMO_SCORECARD.fixNext.find((f) => f.id === item.id);
    const pitch = match && demoPitch(match.id);
    if (!pitch) {
      return NextResponse.json({ error: "No sample pitch exists for this item. Add an ANTHROPIC_API_KEY in .env.local to generate pitches for your own data." }, { status: 404 });
    }
    return NextResponse.json({ pitch, mode: "demo" });
  }

  try {
    const raw = await generateJson({ system: PITCH_SYSTEM, prompt: pitchPrompt(body.data), schema: PitchSchema, maxTokens: 8000 });
    const prdGoal = item.refType === "goal" ? (context.goal ?? item.title) : "Unplanned issue";
    return NextResponse.json({ pitch: normalizePitch(raw, linkedFeedback, prdGoal), mode: "live" });
  } catch (err) {
    const e = err instanceof FriendlyError ? err : new FriendlyError("Pitch generation failed. Please try again.", 500);
    return NextResponse.json({ error: e.message }, { status: e.status });
  }
}
