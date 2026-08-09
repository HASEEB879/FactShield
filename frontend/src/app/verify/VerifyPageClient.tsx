"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import VerificationResultCard from "@/components/verification/VerificationResultCard";
import VerificationState from "@/components/verification/VerificationState";

import { verifyClaim } from "@/services/api";
import type { VerificationResult } from "@/types/api";

export default function VerifyPageClient() {
  const searchParams = useSearchParams();

  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const claim = searchParams.get("claim")?.trim() || "";

  useEffect(() => {
    if (!claim) {
      setLoading(false);
      setError("No claim was provided.");
      return;
    }

    async function runVerification() {
      setLoading(true);
      setError(null);
      setResult(null);

      try {
        const response = await verifyClaim({
          claim,
        });

        setResult(response);
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Verification failed. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    runVerification();
  }, [claim]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300/70">
            FactShield
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Verification Report
          </h1>

          <p className="mt-3 text-slate-400">
            AI-assisted claim verification using evidence from trusted sources.
          </p>
        </div>

        {/* Verification state */}
        <VerificationState
          isLoading={loading}
          error={error}
        />

        {/* Result */}
        {result && (
          <VerificationResultCard
            result={result}
          />
        )}

        {/* No claim */}
        {!loading && !error && !result && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-slate-400">
            No verification result is available.
          </div>
        )}

      </div>
    </main>
  );
}