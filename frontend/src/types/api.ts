export interface VerifyRequest {
  claim: string;
}

export interface VerifyResponse {
  claim: string;
  verdict: string;
  confidence: number;
  explanation: string;
  sources: string[];
}

export type VerificationResult = VerifyResponse;
