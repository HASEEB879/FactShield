"use client";

import { Sparkles } from "lucide-react";
import LogoReveal from "@/components/animations/LogoReveal";
import Reveal from "@/components/animations/Reveal";

export default function Hero() {
  return (
    <section
      className="
        relative mx-auto flex
        min-h-[calc(100vh-5rem)]
        max-w-7xl
        flex-col
        items-center
        justify-start
        px-6
        pb-20
        pt-28
        text-center
        md:pt-32
      "
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(0,150,255,0.15),transparent_45%)]" />

      {/* Badge */}
      <Reveal>
        <div
          className="
            relative
            z-20
            mb-8
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-cyan-400/30
            bg-cyan-400/10
            px-5
            py-2
            text-sm
            text-cyan-300
            backdrop-blur-md
          "
        >
          <Sparkles className="h-4 w-4" />

          AI-Powered Fact Verification
        </div>
      </Reveal>

      {/* Shield */}
      <div className="relative z-10">
        <LogoReveal />
      </div>

      {/* Main heading */}
      <Reveal>
        <h1
          className="
            relative
            z-10
            mt-6
            max-w-5xl
            text-5xl
            font-extrabold
            tracking-tight
            md:text-7xl
          "
        >
          Verify Information

          <br />

          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Before You Believe It.
          </span>
        </h1>
      </Reveal>

      {/* Description */}
      <Reveal delay={0.2}>
        <p
          className="
            relative
            z-10
            mt-8
            max-w-3xl
            text-lg
            text-muted-foreground
            md:text-xl
          "
        >
          FactShield combines Artificial Intelligence with trusted evidence,
          authoritative sources, and transparent reasoning to help detect
          misinformation in seconds.
        </p>
      </Reveal>
    </section>
  );
}