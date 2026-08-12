import type { VerifyRequest, VerifyResponse } from "@/types/api";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://factshield-puce.vercel.app/api";

export async function verifyClaim(
  payload: VerifyRequest
): Promise<VerifyResponse> {
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