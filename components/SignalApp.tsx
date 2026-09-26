"use client";

import { useState } from "react";
import { SAMPLE_FEEDBACK, SAMPLE_GOALS, SAMPLE_PROJECT_NAME } from "@/data/sample";
import { parseFeedback, parseGoals } from "@/lib/parse";
import type { AnalyzeResponse, ApiError, FixNextItem } from "@/lib/types";
import Header from "./Header";
import InputForm, { type InputValues } from "./InputForm";
import ScorecardView from "./ScorecardView";
import Stepper, { type Step } from "./Stepper";

const EMPTY: InputValues = { projectName: "", goalsText: "", feedbackText: "" };

export default function SignalApp({ demoMode }: { demoMode: boolean }) {
  const [values, setValues] = useState<InputValues>(EMPTY);
  const [step, setStep] = useState<Step>("input");
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);

  const loadSample = () =>
    setValues({ projectName: SAMPLE_PROJECT_NAME, goalsText: SAMPLE_GOALS, feedbackText: SAMPLE_FEEDBACK });

  async function analyze() {
    setAnalyzing(true);
    setAnalyzeError(null);
    setStep("scorecard");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          projectName: values.projectName.trim(),
          goals: parseGoals(values.goalsText),
          feedback: parseFeedback(values.feedbackText),
        }),
      });
      const data = (await res.json().catch(() => ({ error: "Unexpected response from the server." }))) as
        | AnalyzeResponse
        | ApiError;
      if (!res.ok || "error" in data) throw new Error("error" in data ? data.error : "Analysis failed.");
      setAnalysis(data);
    } catch (err) {
      setAnalyzeError(err instanceof Error ? err.message : "Analysis failed. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  }

  const openPitch = (item: FixNextItem) => {
    void item;
  };

  return (
    <div className="min-h-screen">
      <Header demoMode={demoMode} />
      <main className="mx-auto max-w-[1100px] px-6 pb-16 pt-7">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[30px] font-semibold leading-tight tracking-tight">
              {step === "input" || !analysis ? "Did the PRD work?" : analysis.projectName || "PRD scorecard"}
            </h1>
            <p className="mt-1 text-[15px] text-muted">
              Map post-launch feedback to your PRD goals, then pitch what to fix next.
            </p>
          </div>
          <Stepper
            current={step}
            reachable={{ input: !analyzing, scorecard: !!analysis && !analyzing, pitch: false }}
            onSelect={setStep}
          />
        </div>

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

        {step === "scorecard" && analysis && !analyzing && (
          <ScorecardView
            scorecard={analysis.scorecard}
            feedback={analysis.feedback}
            onPitch={openPitch}
            pitchReady={new Set()}
          />
        )}
        {step === "scorecard" && analyzing && <p className="text-muted">Analyzing…</p>}
        {step === "scorecard" && analyzeError && <p className="text-failing">{analyzeError}</p>}
      </main>
    </div>
  );
}
