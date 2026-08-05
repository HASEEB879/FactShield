"use client";

import VerificationForm from "@/components/verification/VerificationForm";
import VerificationResultCard from "@/components/verification/VerificationResultCard";
import VerificationState from "@/components/verification/VerificationState";
import { useVerify } from "@/hooks/useVerify";

export default function VerifyBox() {
  const { claim, setClaim, loading, result, error, verify } = useVerify();

  return (
    <section className="mx-auto mt-12 w-full max-w-3xl px-6 pb-8">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/90 to-slate-950 p-5 shadow-2xl shadow-black/40 sm:p-8">
        <VerificationForm
          claim={claim}
          isLoading={loading}
          onClaimChange={setClaim}
          onSubmit={verify}
        />
        <VerificationState isLoading={loading} error={error} />
        {result && <VerificationResultCard result={result} />}
      </div>
    </section>
  );
}
