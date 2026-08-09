"use client";

import { useEffect, useState } from "react";
import {
  ClipboardCheck,
  FileSearch,
  Database,
  BrainCircuit,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface VerificationStateProps {
  isLoading: boolean;
  error: string | null;
}

const steps = [
  {
    title: "Preparing Analysis",
    description: "Understanding your claim...",
    Icon: ClipboardCheck,
  },
  {
    title: "Searching Trusted Sources",
    description: "Finding reliable evidence...",
    Icon: FileSearch,
  },
  {
    title: "Cross-checking Information",
    description: "Comparing multiple sources...",
    Icon: Database,
  },
  {
    title: "Generating AI Report",
    description: "Building final explanation...",
    Icon: BrainCircuit,
  },
];

export default function VerificationState({
  isLoading,
  error,
}: VerificationStateProps) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setActiveStep(0);
      return;
    }

    const interval = setInterval(() => {
      setActiveStep((prev) =>
        prev < steps.length - 1 ? prev + 1 : prev
      );
    }, 1200);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (error) {
    return (
      <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-200 flex gap-3">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <p>{error}</p>
      </div>
    );
  }

  if (!isLoading) return null;

  return (
    <section className="mt-8 rounded-3xl border border-cyan-400/20 bg-slate-950/90 p-6">

      <div className="mb-8">

        <h2 className="text-2xl font-bold text-white">
          AI Verification in Progress
        </h2>

        <p className="mt-2 text-slate-400">
          FactShield is analyzing your claim using trusted sources.
        </p>

      </div>

      <div className="space-y-5">

        {steps.map((step, index) => {
          const completed = index < activeStep;
          const current = index === activeStep;

          return (
            <div
              key={step.title}
              className={`
                flex items-center gap-4
                rounded-2xl
                border
                p-4
                transition-all
                duration-500

                ${
                  current
                    ? "border-cyan-400/40 bg-cyan-400/10"
                    : completed
                    ? "border-green-500/30 bg-green-500/10"
                    : "border-white/10 bg-white/[0.03]"
                }
              `}
            >
              <div
                className={`
                  rounded-xl
                  p-3

                  ${
                    completed
                      ? "bg-green-500 text-white"
                      : current
                      ? "bg-cyan-500 text-white animate-pulse"
                      : "bg-slate-800 text-slate-400"
                  }
                `}
              >
                {completed ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <step.Icon className="h-5 w-5" />
                )}
              </div>

              <div>

                <h3 className="font-semibold text-white">
                  {step.title}
                </h3>

                <p className="text-sm text-slate-400">
                  {step.description}
                </p>

              </div>

            </div>
          );
        })}

      </div>

    </section>
  );
}