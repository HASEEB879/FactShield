import { ShieldCheck, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-24 text-center">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm text-primary">
        <Sparkles className="h-4 w-4" />
        AI-Powered Fact Verification
      </div>

      <ShieldCheck className="mx-auto mb-8 h-20 w-20 text-primary" />

      <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight md:text-7xl">
        Verify Information
        <br />
        Before You Believe It.
      </h1>

      <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground">
        Detect misinformation using AI, trusted sources, and transparent
        evidence. FactShield helps you verify online claims in seconds.
      </p>
    </section>
  );
}