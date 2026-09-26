"use client";

import { useState } from "react";
import Header from "./Header";
import InputForm, { type InputValues } from "./InputForm";
import Stepper, { type Step } from "./Stepper";
import { SAMPLE_FEEDBACK, SAMPLE_GOALS, SAMPLE_PROJECT_NAME } from "@/data/sample";

const EMPTY: InputValues = { projectName: "", goalsText: "", feedbackText: "" };

export default function SignalApp({ demoMode }: { demoMode: boolean }) {
  const [values, setValues] = useState<InputValues>(EMPTY);
  const [step, setStep] = useState<Step>("input");

  const loadSample = () =>
    setValues({
      projectName: SAMPLE_PROJECT_NAME,
      goalsText: SAMPLE_GOALS,
      feedbackText: SAMPLE_FEEDBACK,
    });

  return (
    <div className="min-h-screen">
      <Header demoMode={demoMode} />
      <main className="mx-auto max-w-[1100px] px-6 pb-16 pt-7">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[30px] font-semibold leading-tight tracking-tight">
              Did the PRD work?
            </h1>
            <p className="mt-1 text-[15px] text-muted">
              Map post-launch feedback to your PRD goals, then pitch what to fix next.
            </p>
          </div>
          <Stepper
            current={step}
            reachable={{ input: true, scorecard: false, pitch: false }}
            onSelect={setStep}
          />
        </div>
        {step === "input" && (
          <InputForm
            values={values}
            onChange={setValues}
            onLoadSample={loadSample}
            onAnalyze={() => {}}
            loading={false}
            demoMode={demoMode}
          />
        )}
      </main>
    </div>
  );
}
