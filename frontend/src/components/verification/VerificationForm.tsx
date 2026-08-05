"use client";

import { Sparkles } from "lucide-react";

interface VerificationFormProps {
  claim: string;
  isLoading: boolean;
  onClaimChange: (claim: string) => void;
  onSubmit: () => void;
}

export default function VerificationForm({
  claim,
  isLoading,
  onClaimChange,
  onSubmit,
}: VerificationFormProps) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-end sm:justify-between">
        <label className="text-sm font-semibold tracking-wide text-slate-100" htmlFor="claim">
          Claim to verify
        </label>
        <p className="text-xs text-slate-500">Paste a statement, headline, or claim.</p>
      </div>
      <textarea
        id="claim"
        value={claim}
        onChange={(event) => onClaimChange(event.target.value)}
        placeholder="Paste a claim, headline, or statement..."
        disabled={isLoading}
        className="min-h-36 w-full resize-y rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-4 text-base leading-7 text-white shadow-inner shadow-black/30 outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-60 sm:px-5"
      />
      <button
        type="submit"
        disabled={!claim.trim() || isLoading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 px-5 py-3.5 text-sm font-semibold tracking-wide text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-cyan-400/25 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
      >
        <Sparkles className="h-5 w-5" />
        {isLoading ? "Analyzing claim..." : "Verify claim"}
      </button>
    </form>
  );
}
