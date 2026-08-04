"use client";

import { useState } from "react";

interface VerificationResult {
  claim: string;
  verdict: string;
  confidence: number;
  explanation: string;
  sources: string[];
}

export default function VerifyBox() {
  const [claim, setClaim] = useState("");
  const [result, setResult] = useState<VerificationResult | null>(null);

  async function verifyClaim() {
    if (!claim.trim()) return;

    const response = await fetch("http://127.0.0.1:8000/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        claim: claim,
      }),
    });

    const data = await response.json();
    setResult(data);
  }

  return (
    <div className="w-full flex justify-center mt-10">
      <div className="w-full max-w-2xl">

        <textarea
          value={claim}
          onChange={(e) => setClaim(e.target.value)}
          placeholder="Enter a claim to verify..."
          className="
          w-full
          min-h-[120px]
          rounded-xl
          border
          border-white/20
          bg-black/40
          px-5
          py-4
          text-white
          placeholder:text-gray-400
          outline-none
          focus:border-white
          "
        />

        <button
          onClick={verifyClaim}
          className="
          mt-4
          w-full
          rounded-xl
          bg-white
          py-3
          text-black
          font-semibold
          hover:bg-gray-200
          transition
          "
        >
          Verify Claim
        </button>


        {result && (
          <div className="mt-6 rounded-xl border border-white/20 bg-white/5 p-5 text-white">
            <div className="flex items-center justify-between gap-4">
              <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-black">
                {result.verdict}
              </span>
              <span className="text-sm text-gray-300">
                Confidence: {result.confidence}%
              </span>
            </div>

            <p className="mt-4 leading-7 text-gray-100">{result.explanation}</p>

            <div className="mt-5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-300">
                Sources
              </h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-100">
                {result.sources.map((source) => (
                  <li key={source}>{source}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
