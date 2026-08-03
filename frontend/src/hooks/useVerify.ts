import { useState } from "react";
import { verifyClaim } from "@/services/factService";
import { VerificationResult } from "@/types/fact";

export function useVerify() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] =
    useState<VerificationResult | null>(null);

  async function verify(claim: string) {
    setLoading(true);

    const response = await verifyClaim(claim);

    setResult(response);

    setLoading(false);
  }

  return {
    loading,
    result,
    verify,
  };
}