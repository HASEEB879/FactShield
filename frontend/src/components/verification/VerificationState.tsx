import { AlertCircle, ClipboardCheck, FileSearch, Scale } from "lucide-react";

interface VerificationStateProps {
  isLoading: boolean;
  error: string | null;
}

const analysisSteps = [
  {
    title: "Preparing analysis",
    description: "Setting up the claim for review",
    Icon: ClipboardCheck,
  },
  {
    title: "Reviewing claim",
    description: "Assessing the available evidence",
    Icon: FileSearch,
  },
  {
    title: "Generating verdict",
    description: "Building a clear, sourced explanation",
    Icon: Scale,
  },
];

export default function VerificationState({
  isLoading,
  error,
}: VerificationStateProps) {
  if (isLoading) {
    return (
      <section
        role="status"
        aria-live="polite"
        className="mt-6 overflow-hidden rounded-3xl border border-cyan-300/15 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.13),_transparent_40%),linear-gradient(135deg,rgba(15,23,42,0.98),rgba(2,6,23,0.94))] p-5 sm:p-6"
      >
        <div className="flex items-start gap-4">
          <div className="relative mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10">
            <span className="absolute inset-0 animate-ping rounded-2xl border border-cyan-300/30" />
            <FileSearch className="relative h-5 w-5 text-cyan-200" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200/70">
              FactShield analysis
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-white sm:text-2xl">
              Examining your claim
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              This usually takes a few moments. We will return a verdict, reasoning,
              and the sources used in the review.
            </p>
          </div>
        </div>

        <ol className="mt-6 grid gap-3 md:grid-cols-3">
          {analysisSteps.map(({ title, description, Icon }, index) => (
            <li
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.035] p-4"
            >
              <div
                className="absolute inset-x-0 top-0 h-px animate-pulse bg-gradient-to-r from-transparent via-cyan-300 to-transparent"
                style={{ animationDelay: `${index * 180}ms` }}
              />
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-slate-900 p-2 text-cyan-200 shadow-inner shadow-black/30">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-100">{title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="mt-6 flex gap-3 rounded-2xl border border-red-400/25 bg-red-400/10 p-4 text-sm leading-6 text-red-100"
      >
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-300" />
        <p>{error}</p>
      </div>
    );
  }

  return null;
}
