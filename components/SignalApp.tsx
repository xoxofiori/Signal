"use client";

import { useState } from "react";
import { SAMPLE_FEEDBACK, SAMPLE_GOALS, SAMPLE_PROJECT_NAME } from "@/data/sample";
import { parseFeedback, parseGoals } from "@/lib/parse";
import type { AnalyzeResponse, ApiError, FixNextItem, Pitch, PitchResponse } from "@/lib/types";
import Header from "./Header";
import InputForm, { type InputValues } from "./InputForm";
import { DemoEditedNotice, ErrorState } from "./Notices";
import PitchView, { PitchToolbar } from "./PitchView";
import ScorecardView from "./ScorecardView";
import { PitchSkeleton, ScorecardSkeleton } from "./Skeletons";
import Stepper, { type Step } from "./Stepper";

const EMPTY: InputValues = { projectName: "", goalsText: "", feedbackText: "" };

async function postJson<T>(url: string, body: unknown, fallback: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Couldn't reach the Signal server. Is `npm run dev` still running?");
  }
  const data = (await res.json().catch(() => null)) as T | ApiError | null;
  if (!data) throw new Error(fallback);
  if (!res.ok || (typeof data === "object" && "error" in data)) {
    throw new Error((data as ApiError).error || fallback);
  }
  return data as T;
}

export default function SignalApp({ demoMode }: { demoMode: boolean }) {
  const [values, setValues] = useState<InputValues>(EMPTY);
  const [step, setStep] = useState<Step>("input");

  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);

  const [pitches, setPitches] = useState<Record<string, Pitch>>({});
  const [selected, setSelected] = useState<FixNextItem | null>(null);
  const [pitchLoading, setPitchLoading] = useState(false);
  const [pitchError, setPitchError] = useState<string | null>(null);

  const loadSample = () =>
    setValues({ projectName: SAMPLE_PROJECT_NAME, goalsText: SAMPLE_GOALS, feedbackText: SAMPLE_FEEDBACK });

  async function analyze() {
    setAnalyzing(true);
    setAnalyzeError(null);
    setStep("scorecard");
    try {
      const data = await postJson<AnalyzeResponse>(
        "/api/analyze",
        {
          projectName: values.projectName.trim(),
          goals: parseGoals(values.goalsText),
          feedback: parseFeedback(values.feedbackText),
        },
        "Analysis failed. Please try again.",
      );
      setAnalysis(data);
      setPitches({});
      setSelected(null);
    } catch (err) {
      setAnalyzeError(err instanceof Error ? err.message : "Analysis failed. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  }

  async function openPitch(item: FixNextItem) {
    if (!analysis) return;
    setSelected(item);
    setStep("pitch");
    setPitchError(null);
    window.scrollTo({ top: 0 });
    if (pitches[item.id]) return;

    const { scorecard, feedback, projectName } = analysis;
    const goal = scorecard.goals.find((g) => g.id === item.refId);
    const theme = scorecard.unplanned.find((u) => u.id === item.refId);
    const ids = goal?.feedbackIds ?? theme?.feedbackIds ?? [];
    setPitchLoading(true);
    try {
      const data = await postJson<PitchResponse>(
        "/api/pitch",
        {
          projectName,
          item,
          context: { goal: goal?.goal, verdict: goal?.verdict, summary: theme?.summary },
          linkedFeedback: ids.map((i) => feedback[i]).filter(Boolean),
        },
        "Pitch generation failed. Please try again.",
      );
      setPitches((p) => ({ ...p, [item.id]: data.pitch }));
    } catch (err) {
      setPitchError(err instanceof Error ? err.message : "Pitch generation failed. Please try again.");
    } finally {
      setPitchLoading(false);
    }
  }

  const goTo = (s: Step) => {
    setStep(s);
    window.scrollTo({ top: 0 });
  };
  const pitch = selected ? pitches[selected.id] : undefined;
  const showTitle = step !== "input" && analysis && !analyzing;

  return (
    <div className="min-h-screen">
      <Header demoMode={demoMode} />
      <main className="mx-auto max-w-[1100px] px-4 pb-16 pt-6 sm:px-6">
        <section className="hero relative mb-6 overflow-hidden rounded-[28px] border border-white/70 px-8 py-7 shadow-[0_1px_2px_rgba(28,26,23,0.04),0_18px_40px_-24px_rgba(160,96,20,0.35)]">
          <div className="relative flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="eyebrow text-highlight">
                {step === "input" && "Step 1 · Input"}
                {step === "scorecard" && "Step 2 · PRD scorecard"}
                {step === "pitch" && "Step 3 · Engineering pitch"}
              </p>
              <h1 className="mt-2 font-display text-[46px] leading-[1.02]">
                {showTitle ? analysis.projectName || "PRD scorecard" : "Did the PRD work?"}
              </h1>
              <p className="mt-2 text-[15px] text-[#5f574b]">
                {step === "input" && "Map post-launch feedback to your PRD goals, then pitch what to fix next."}
                {step === "scorecard" && "Which PRD goals are working, and what to fix next."}
                {step === "pitch" && "An evidence-backed pitch for quarterly engineering intake."}
              </p>
            </div>
            <Stepper
              current={step}
              reachable={{ input: !analyzing, scorecard: !!analysis && !analyzing, pitch: !!pitch }}
              onSelect={goTo}
            />
          </div>
        </section>

        {step === "input" && (
          <InputForm
            values={values}
            onChange={setValues}
            onLoadSample={loadSample}
            onAnalyze={analyze}
            loading={analyzing}
            demoMode={demoMode}
          />
        )}

        {step === "scorecard" && analyzing && (
          <ScorecardSkeleton label={demoMode ? "Loading sample analysis…" : "Mapping feedback to PRD goals… this can take up to a minute."} />
        )}
        {step === "scorecard" && !analyzing && analyzeError && (
          <ErrorState
            title="We couldn't analyze that feedback"
            message={analyzeError}
            onRetry={analyze}
            onBack={() => goTo("input")}
            backLabel="Edit inputs"
          />
        )}
        {step === "scorecard" && !analyzing && !analyzeError && analysis && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => goTo("input")}
                className="btn px-3 py-1.5 text-muted hover:bg-bg hover:text-ink"
              >
                ← Edit inputs
              </button>
              <span className="eyebrow text-muted">
                {analysis.mode === "demo" ? "Sample analysis (demo mode)" : "Live analysis · quotes are verbatim from your feedback"}
              </span>
            </div>
            {analysis.inputsEdited && <DemoEditedNotice />}
            <ScorecardView
              scorecard={analysis.scorecard}
              feedback={analysis.feedback}
              onPitch={openPitch}
              pitchReady={new Set(Object.keys(pitches))}
            />
          </div>
        )}

        {step === "pitch" && (
          <>
            {pitch && analysis && selected ? (
              <PitchView pitch={pitch} item={selected} projectName={analysis.projectName} onBack={() => goTo("scorecard")} />
            ) : (
              <div className="space-y-4">
                <PitchToolbar onBack={() => goTo("scorecard")} />
                {pitchLoading && <PitchSkeleton />}
                {!pitchLoading && pitchError && (
                  <ErrorState
                    title="We couldn't write that pitch"
                    message={pitchError}
                    onRetry={selected ? () => openPitch(selected) : undefined}
                    onBack={() => goTo("scorecard")}
                    backLabel="Back to scorecard"
                  />
                )}
              </div>
            )}
          </>
        )}
      </main>
      <footer className="eyebrow py-6 text-center text-muted">
        Signal · post-launch PRD evaluation · nothing you paste is stored
      </footer>
    </div>
  );
}
