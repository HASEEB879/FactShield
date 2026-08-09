import {
  BrainCircuit,
  CheckCircle2,
  Link2,
  Quote,
  ShieldCheck,
} from "lucide-react";

import type { VerificationResult } from "@/types/api";

import VerificationMetadata from "./VerificationMetadata";

interface VerificationResultCardProps {
  result: VerificationResult;
}

function getVerdictStyles(verdict: string) {
  switch (verdict.toLowerCase()) {
    case "true":
      return {
        badge:
          "border-emerald-300/30 bg-emerald-300/10 text-emerald-100",
        accent: "from-emerald-300 to-teal-400",
      };

    case "false":
      return {
        badge:
          "border-red-300/30 bg-red-300/10 text-red-100",
        accent: "from-red-300 to-rose-400",
      };

    case "misleading":
      return {
        badge:
          "border-amber-300/30 bg-amber-300/10 text-amber-100",
        accent: "from-amber-200 to-yellow-400",
      };

    case "insufficient evidence":
      return {
        badge:
          "border-slate-300/30 bg-slate-300/10 text-slate-100",
        accent: "from-slate-300 to-slate-500",
      };

    case "answered":
      return {
        badge:
          "border-cyan-300/30 bg-cyan-300/10 text-cyan-100",
        accent: "from-cyan-300 to-violet-400",
      };

    default:
      return {
        badge:
          "border-cyan-300/30 bg-cyan-300/10 text-cyan-100",
        accent: "from-cyan-300 to-violet-400",
      };
  }
}

export default function VerificationResultCard({
  result,
}: VerificationResultCardProps) {
  const confidence = Math.max(
    0,
    Math.min(100, result.confidence ?? 0)
  );

  const sources = result.sources ?? [];
  const verdict = getVerdictStyles(result.verdict);

  return (
    <article className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/90 shadow-2xl shadow-black/40">

      {/* Header */}
      <header className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.14),_transparent_45%),linear-gradient(135deg,rgba(15,23,42,0.98),rgba(2,6,23,0.95))] px-5 py-6 sm:px-7 sm:py-8">

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/70 to-transparent" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3.5">

            <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/10 p-3 text-cyan-100 shadow-lg shadow-cyan-500/10">
              <ShieldCheck className="h-6 w-6" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/70">
                Fact-check report
              </p>

              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Verification complete
              </h2>
            </div>

          </div>

          <span
            className={`w-fit rounded-full border px-3.5 py-1.5 text-sm font-semibold ${verdict.badge}`}
          >
            Verdict: {result.verdict}
          </span>

        </div>
      </header>

      <div className="space-y-8 p-5 sm:p-7 lg:p-8">

        {/* Claim */}
        <section className="rounded-2xl border border-white/8 bg-white/[0.025] p-5 sm:p-6">

          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            <Quote className="h-4 w-4 text-cyan-300" />
            Claim reviewed
          </div>

          <blockquote className="mt-3 border-l-2 border-cyan-300/60 pl-4 text-lg leading-8 text-slate-100 sm:text-xl">
            {result.claim}
          </blockquote>

        </section>

        {/* Answer */}
        {result.answer && (
          <section className="rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.045] p-5 sm:p-6">

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-cyan-300/10 p-2 text-cyan-200">
                <CheckCircle2 className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">
                  Answer
                </h3>

                <p className="text-sm text-slate-400">
                  FactShield's verified response
                </p>
              </div>

            </div>

            <p className="mt-5 text-2xl font-semibold leading-9 text-cyan-100">
              {result.answer}
            </p>

          </section>
        )}

        {/* Confidence */}
        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.8fr)] lg:items-end">

          <div>

            <div className="mb-3 flex items-center justify-between gap-4 text-sm">
              <span className="font-medium text-slate-200">
                Confidence meter
              </span>

              <span className="text-lg font-semibold text-white">
                {confidence}%
              </span>
            </div>

            <div
              className="h-3 overflow-hidden rounded-full border border-white/10 bg-white/[0.06] p-0.5"
              role="progressbar"
              aria-label="Verification confidence"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={confidence}
            >

              <div
                className={`h-full rounded-full bg-gradient-to-r ${verdict.accent} shadow-[0_0_18px_rgba(34,211,238,0.3)] transition-all duration-700 ease-out`}
                style={{
                  width: `${confidence}%`,
                }}
              />

            </div>

          </div>

          <p className="text-sm leading-6 text-slate-400 lg:text-right">
            Confidence reflects the available evidence reviewed for this claim.
          </p>

        </section>

        {/* AI Explanation */}
        <section className="rounded-2xl border border-violet-300/10 bg-violet-300/[0.035] p-5 sm:p-6">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-violet-300/10 p-2 text-violet-200">
              <BrainCircuit className="h-5 w-5" />
            </div>

            <div>

              <h3 className="text-lg font-semibold text-white">
                AI reasoning
              </h3>

              <p className="text-sm text-slate-400">
                Why this result was returned
              </p>

            </div>

          </div>

          <p className="mt-5 leading-8 text-slate-200">
            {result.explanation}
          </p>

        </section>

        {/* Sources */}
        <section>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <h3 className="text-lg font-semibold text-white">
                Evidence sources
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Sources referenced during verification
              </p>

            </div>

            <span className="text-sm font-medium text-cyan-200">
              {sources.length} cited
            </span>

          </div>

          {sources.length > 0 ? (

            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">

              {sources.map((source, index) => (

                <a
                  key={`${source}-${index}`}
                  href={source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:-translate-y-0.5 hover:border-cyan-300/30 hover:bg-cyan-300/[0.05]"
                >

                  <div className="flex items-start gap-3">

                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-300/10 text-xs font-semibold text-cyan-100">
                      {index + 1}
                    </span>

                    <div className="min-w-0">

                      <Link2 className="mb-2 h-4 w-4 text-cyan-300" />

                      <p className="break-all text-sm font-medium leading-6 text-slate-200 group-hover:text-cyan-300">
                        {source}
                      </p>

                    </div>

                  </div>

                </a>

              ))}

            </div>

          ) : (

            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-400">

              <CheckCircle2 className="h-4 w-4 shrink-0" />

              No sources were returned for this analysis.

            </div>

          )}

        </section>

        {/* Metadata */}
        <VerificationMetadata
          confidence={confidence}
          sourceCount={sources.length}
        />

      </div>

    </article>
  );
}