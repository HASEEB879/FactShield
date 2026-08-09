"use client";

import { useState } from "react";

import VerificationForm from "@/components/verification/VerificationForm";
import VerificationState from "@/components/verification/VerificationState";
import VerificationResultCard from "@/components/verification/VerificationResultCard";

import { verifyClaim } from "@/services/api";

import type { VerificationResult } from "@/types/api";

export default function VerifyBox() {
  const [claim, setClaim] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [result, setResult] =
    useState<VerificationResult | null>(null);

  async function handleSubmit() {
    if (!claim.trim()) return;

    setIsLoading(true);

    setError(null);

    setResult(null);

    try {
      const response = await verifyClaim({
        claim,
      });

      setResult(response);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Verification failed."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section
      id="verify"
      className="mx-auto mt-16 max-w-5xl px-6"
    >
      <div
        className="
        rounded-3xl
        border
        border-white/10
        bg-white/5
        p-8
        backdrop-blur-xl
        shadow-2xl
        "
      >
        <VerificationForm
          claim={claim}
          isLoading={isLoading}
          onClaimChange={setClaim}
          onSubmit={handleSubmit}
        />

        <VerificationState
          isLoading={isLoading}
          error={error}
        />

        {result && (
          <VerificationResultCard
            result={result}
          />
        )}
      </div>
    </section>
  );
}