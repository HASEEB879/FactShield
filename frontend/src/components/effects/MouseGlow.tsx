"use client";

import { useEffect, useRef } from "react";

export default function MouseGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = glowRef.current;

    if (!element) return;

    let animationFrame = 0;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    const updateGlow = () => {
      element.style.background = `
        radial-gradient(
          400px circle at ${mouseX}px ${mouseY}px,
          rgba(0,180,255,0.12),
          transparent 60%
        )
      `;

      animationFrame = 0;
    };

    const move = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      if (!animationFrame) {
        animationFrame = requestAnimationFrame(updateGlow);
      }
    };

    window.addEventListener("mousemove", move, { passive: true });

    updateGlow();

    return () => {
      window.removeEventListener("mousemove", move);

      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed inset-0 -z-10"
      aria-hidden="true"
    />
  );
}