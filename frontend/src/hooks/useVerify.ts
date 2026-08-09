import { useState } from "react";
import { verifyClaim } from "@/services/api";
import type { VerificationResult } from "@/types/api";

export function useVerify() {
  const [claim, setClaim] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function verify() {
    const normalizedClaim = claim.trim();

    if (!normalizedClaim || loading) {
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await verifyClaim({
        claim: normalizedClaim,
      });

      setResult(response);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "We could not verify this claim. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return {
    claim,
    setClaim,
    loading,
    result,
    error,
    verify,
  };
}