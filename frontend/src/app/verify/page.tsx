import { Suspense } from "react";
import VerifyPageClient from "./VerifyPageClient";

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <main className="relative min-h-screen overflow-hidden bg-slate-950 px-6 py-10 text-white">
          <div className="mx-auto max-w-5xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300/70">
              FactShield
            </p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
              Verification Report
            </h1>

            <p className="mt-3 text-slate-400">
              Loading verification...
            </p>
          </div>
        </main>
      }
    >
      <VerifyPageClient />
    </Suspense>
  );
}