import { VerificationResult } from "@/types/fact";

export async function verifyClaim(
  claim: string
): Promise<VerificationResult> {
  // Temporary mock response
  return {
    verdict: "Mixed",
    confidence: 82,
    explanation:
      "This is a placeholder response. The AI backend will be connected later.",
    sources: [
      "BBC",
      "Reuters",
      "Nature"
    ]
  };
}