"use client";

import { parseFeedback, parseGoals } from "@/lib/parse";

export interface InputValues {
  projectName: string;
  goalsText: string;
  feedbackText: string;
}

export default function InputForm({
  values,
  onChange,
  onLoadSample,
  onAnalyze,
  loading,
  demoMode,
}: {
  values: InputValues;
  onChange: (v: InputValues) => void;
  onLoadSample: () => void;
  onAnalyze: () => void;
  loading: boolean;
  demoMode: boolean;
}) {
  const goalCount = parseGoals(values.goalsText).length;
  const feedback = parseFeedback(values.feedbackText);
  const canAnalyze = goalCount > 0 && feedback.length > 0 && !loading;

  const set = (patch: Partial<InputValues>) => onChange({ ...values, ...patch });

  return (
    <section className="card p-7">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-[27px] leading-tight">What shipped, and what did users say?</h2>
          <p className="mt-1 text-sm text-muted">
            Paste the PRD&apos;s goals and the raw post-launch feedback. Signal maps
            each piece of feedback to a goal and tells you what to fix next.
          </p>
        </div>
        <button
          type="button"
          onClick={onLoadSample}
          disabled={loading}
          className="btn btn-secondary px-4 py-2"
        >
          Load sample data
        </button>
      </div>

      <div className="space-y-5">
        <Field label="Project name" htmlFor="projectName">
          <input
            id="projectName"
            type="text"
            value={values.projectName}
            onChange={(e) => set({ projectName: e.target.value })}
            placeholder="e.g. Moderation Queue Tool v1"
            className={inputCls}
          />
        </Field>

        <div className="grid gap-5 lg:grid-cols-[2fr_3fr]">
          <Field
            label="PRD goals & success criteria"
            htmlFor="goals"
            hint="One goal per line."
            count={goalCount ? `${goalCount} goal${goalCount === 1 ? "" : "s"}` : undefined}
          >
            <textarea
              id="goals"
              value={values.goalsText}
              onChange={(e) => set({ goalsText: e.target.value })}
              rows={11}
              placeholder={"Moderators can review and tag an item in under 30 seconds.\nEscalations reach the specialist team within 5 minutes."}
              className={`${inputCls} resize-y leading-relaxed`}
            />
          </Field>
          <Field
            label="Post-launch feedback"
            htmlFor="feedback"
            hint="One item per line. Optional source tag: [Slack] [Sync] [Widget] [Observation]. Untagged lines count as Other."
            count={
              feedback.length
                ? `${feedback.length} item${feedback.length === 1 ? "" : "s"}`
                : undefined
            }
          >
            <textarea
              id="feedback"
              value={values.feedbackText}
              onChange={(e) => set({ feedbackText: e.target.value })}
              rows={11}
              placeholder={"[Slack] Escalated an item and nobody picked it up for 30 minutes.\n[Widget] Please add keyboard shortcuts."}
              className={`${inputCls} resize-y font-[inherit] leading-relaxed`}
            />
          </Field>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
        <p className="text-[13px] text-muted">
          {goalCount === 0 || feedback.length === 0
            ? "Add at least one goal and one feedback item to analyze — or load the sample data."
            : demoMode
              ? "Demo mode: Analyze returns the precomputed sample analysis."
              : "Analysis runs on Claude via a server route. Nothing is stored."}
        </p>
        <button
          type="button"
          onClick={onAnalyze}
          disabled={!canAnalyze}
          className="btn btn-primary px-6 py-2.5"
        >
          {loading && (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden />
          )}
          {loading ? "Analyzing…" : "Analyze"}
        </button>
      </div>
    </section>
  );
}

const inputCls =
  "w-full rounded-2xl border border-line bg-white/80 px-3.5 py-2.5 text-[14px] text-ink placeholder:text-[#b3aa9b] outline-none focus:border-highlight focus:ring-4 focus:ring-highlight/15";

function Field({
  label,
  htmlFor,
  hint,
  count,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  count?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <label htmlFor={htmlFor} className="eyebrow text-ink">
          {label}
        </label>
        {count && <span className="eyebrow text-muted">{count}</span>}
      </div>
      {children}
      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}
