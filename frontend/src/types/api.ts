export interface VerifyRequest {
  claim: string;
}

export interface VerifyResponse {
  claim: string;
  verdict: string;
  confidence: number;
  explanation: string;
  answer?: string;
  sources: string[];
  intent?: string;
  search_query?: string;
}

export type VerificationResult = VerifyResponse;