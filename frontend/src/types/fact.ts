export interface VerificationResult {
  verdict: "True" | "False" | "Mixed" | "Unknown";
  confidence: number;
  explanation: string;
  sources: string[];
}