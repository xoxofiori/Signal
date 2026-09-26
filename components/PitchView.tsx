"use client";

import { chatPrdPrompt, pitchToMarkdown } from "@/lib/markdown";
import type { Pitch } from "@/lib/types";
import CopyButton from "./CopyButton";
import Quote from "./Quote";
import SourceBreakdown from "./SourceBreakdown";

export default function PitchView({
  pitch,
  projectName,
  onBack,
}: {
  pitch: Pitch;
  projectName: string;
  onBack: () => void;
}) {
  return (
    <div className="space-y-4">
      <PitchToolbar onBack={onBack}>
        <CopyButton label="Copy as Markdown" getText={() => pitchToMarkdown(pitch, projectName)} />
        <CopyButton label="Copy as ChatPRD prompt" primary getText={() => chatPrdPrompt(pitch, projectName)} />
      </PitchToolbar>

      <article className="mx-auto max-w-[800px] rounded-xl border border-line bg-bg px-8 py-9 shadow-[0_1px_3px_rgba(28,25,23,0.06)] sm:px-12">
        <p className="text-xs font-medium uppercase tracking-wider text-accent">
          Engineering pitch{projectName ? ` · ${projectName}` : ""}
        </p>
        <h2 className="mt-2 text-[26px] font-semibold leading-tight tracking-tight">{pitch.title}</h2>

        <dl className="mt-5 grid gap-4 rounded-lg bg-surface px-4 py-3 text-sm sm:grid-cols-[1fr_auto]">
          <div>
            <dt className="text-xs font-medium text-muted">PRD goal affected</dt>
            <dd className="mt-0.5 font-medium">{pitch.prdGoal}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-muted">Evidence</dt>
            <dd className="mt-0.5 font-medium">
              {pitch.evidence.feedbackCount} feedback item{pitch.evidence.feedbackCount === 1 ? "" : "s"}
            </dd>
          </div>
        </dl>

        <Section title="Problem">
          <p>{pitch.problem}</p>
        </Section>

        <Section title="Evidence">
          <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
            <span className="font-medium">{pitch.evidence.feedbackCount} items from</span>
            <SourceBreakdown breakdown={pitch.evidence.sources} />
          </div>
          <div className="space-y-2.5">
            {pitch.evidence.quotes.map((q) => (
              <Quote key={q} text={q} />
            ))}
          </div>
        </Section>

        <div className="grid gap-x-8 sm:grid-cols-2">
          <Section title="Who's affected">
            <p>{pitch.whoAffected}</p>
          </Section>
          <Section title="Impact if unsolved">
            <p>{pitch.impactIfUnsolved}</p>
          </Section>
        </div>

        <Section title="Proposed direction for v2">
          <ul className="list-disc space-y-1.5 pl-5 marker:text-muted">
            {pitch.proposedDirection.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </Section>

        <Section title="The ask">
          <p className="rounded-lg border-l-2 border-accent bg-accent-soft/60 px-4 py-3 font-medium">{pitch.ask}</p>
        </Section>
      </article>
    </div>
  );
}

export function PitchToolbar({ onBack, children }: { onBack: () => void; children?: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-[800px] flex-wrap items-center justify-between gap-3">
      <button
        type="button"
        onClick={onBack}
        className="rounded-lg px-2 py-2 text-sm font-medium text-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-accent"
      >
        ← Back to scorecard
      </button>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-7">
      <h3 className="mb-2 text-[13px] font-semibold uppercase tracking-wider text-muted">{title}</h3>
      <div className="text-[15px] leading-relaxed text-stone-800">{children}</div>
    </section>
  );
}
