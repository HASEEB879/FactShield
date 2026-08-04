import { VerifyResponse } from "@/types/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

export async function verifyClaim(
  claim: string
): Promise<VerifyResponse> {
  const response = await fetch(`${API_BASE}/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      claim,
    }),
  });

  if (!response.ok) {
    throw new Error("Verification failed.");
  }

  return response.json();
}