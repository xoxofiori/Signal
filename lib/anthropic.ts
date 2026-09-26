import Anthropic from "@anthropic-ai/sdk";
import type { z } from "zod";

/** Change the model in one place. */
export const MODEL = "claude-sonnet-5";

export function hasApiKey(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY?.trim());
}

let client: Anthropic | null = null;
function getClient(): Anthropic {
  client ??= new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return client;
}

/** Error whose message is safe to show to the user. */
export class FriendlyError extends Error {
  constructor(
    message: string,
    public status = 502,
  ) {
    super(message);
  }
}

/** Remove ```json fences and any prose around the outermost JSON object. */
export function extractJson(raw: string): string {
  let s = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  const start = s.indexOf("{");
  const end = s.lastIndexOf("}");
  if (start !== -1 && end > start) s = s.slice(start, end + 1);
  return s;
}

/**
 * Ask Claude for JSON, parse it, and validate it with `schema` plus an
 * optional `check`. Retries once on bad output, then throws FriendlyError.
 */
export async function generateJson<T>({
  system,
  prompt,
  schema,
  check,
  maxTokens = 16000,
}: {
  system: string;
  prompt: string;
  schema: z.ZodType<T>;
  check?: (value: T) => string | null;
  maxTokens?: number;
}): Promise<T> {
  let lastProblem = "";
  for (let attempt = 0; attempt < 2; attempt++) {
    const userContent =
      attempt === 0
        ? prompt
        : `${prompt}\n\nYour previous response could not be used (${lastProblem}). Return ONLY one valid JSON object matching the schema exactly. No markdown fences, no commentary.`;

    let message: Anthropic.Message;
    try {
      message = await getClient()
        .messages.stream({
          model: MODEL,
          max_tokens: maxTokens,
          system,
          messages: [{ role: "user", content: userContent }],
        })
        .finalMessage();
    } catch (err) {
      throw toFriendly(err);
    }

    if (message.stop_reason === "refusal") {
      throw new FriendlyError("The model declined to analyze this input. Try rephrasing or removing sensitive details.");
    }

    const text = message.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    try {
      const parsed = schema.safeParse(JSON.parse(extractJson(text)));
      if (!parsed.success) {
        lastProblem = `schema validation failed: ${parsed.error.issues
          .slice(0, 3)
          .map((i) => `${i.path.join(".")}: ${i.message}`)
          .join("; ")}`;
      } else {
        const problem = check?.(parsed.data) ?? null;
        if (!problem) return parsed.data;
        lastProblem = problem;
      }
    } catch {
      lastProblem =
        message.stop_reason === "max_tokens"
          ? "the response was cut off before the JSON was complete"
          : "the response was not valid JSON";
    }
    console.warn(`[signal] attempt ${attempt + 1} unusable: ${lastProblem}`);
  }
  throw new FriendlyError(
    "The AI returned a result we couldn't read, even after a retry. Please try again in a moment.",
  );
}

function toFriendly(err: unknown): FriendlyError {
  if (err instanceof Anthropic.AuthenticationError) {
    return new FriendlyError("Your ANTHROPIC_API_KEY was rejected. Check the key in .env.local and restart the dev server.", 401);
  }
  if (err instanceof Anthropic.PermissionDeniedError || err instanceof Anthropic.NotFoundError) {
    return new FriendlyError(`Your API key can't access the model "${MODEL}". Change MODEL in lib/anthropic.ts or check your account.`, 403);
  }
  if (err instanceof Anthropic.RateLimitError) {
    return new FriendlyError("Rate limited by the Anthropic API. Wait a few seconds and try again.", 429);
  }
  if (err instanceof Anthropic.APIConnectionError) {
    return new FriendlyError("Couldn't reach the Anthropic API. Check your network connection and try again.", 503);
  }
  if (err instanceof Anthropic.APIError) {
    return new FriendlyError(`The Anthropic API returned an error (${err.status ?? "unknown"}). Please try again.`, 502);
  }
  console.error("[signal] unexpected error", err);
  return new FriendlyError("Something went wrong while contacting the AI. Please try again.", 500);
}
