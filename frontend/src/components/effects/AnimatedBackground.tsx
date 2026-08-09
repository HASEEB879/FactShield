"use client";

import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

      <motion.div
        animate={{
          x: [0, 120, -80, 0],
          y: [0, -80, 50, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -left-48 -top-48 h-[700px] w-[700px] rounded-full bg-sky-500/20 blur-[180px]"
      />

      <motion.div
        animate={{
          x: [0, -120, 100, 0],
          y: [0, 100, -60, 0],
          scale: [1.1, .9, 1.15, 1.1],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[-200px] top-[150px] h-[650px] w-[650px] rounded-full bg-blue-600/20 blur-[180px]"
      />

      <motion.div
        animate={{
          y: [0, 80, -40, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[-250px] left-1/3 h-[600px] w-[600px] rounded-full bg-cyan-400/10 blur-[200px]"
      />
    </div>
  );
}