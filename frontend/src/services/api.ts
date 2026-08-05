import type { VerifyRequest, VerifyResponse } from "@/types/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function verifyClaim(
  payload: VerifyRequest
): Promise<VerifyResponse> {
  if (!API_BASE) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  const response = await fetch(`${API_BASE}/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      body && typeof body.detail === "string"
        ? body.detail
        : "We could not verify this claim. Please try again.";
    throw new Error(message);
  }

  return body as VerifyResponse;
}
