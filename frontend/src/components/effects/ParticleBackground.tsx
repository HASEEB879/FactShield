"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function generateParticles(count: number) {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 15 + 10,
  }));
}

export default function ParticleBackground() {

  const [particles, setParticles] = useState<
    ReturnType<typeof generateParticles>
  >([]);

  const [mouse, setMouse] = useState({
    x: 50,
    y: 50,
  });


  useEffect(() => {
    setParticles(generateParticles(35));

    const move = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", move);

    return () =>
      window.removeEventListener("mousemove", move);

  }, []);


  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">


      {/* Mouse light */}

      <motion.div
        animate={{
          left: `${mouse.x}%`,
          top: `${mouse.y}%`,
        }}
        transition={{
          duration: .8,
          ease: "easeOut",
        }}
        className="
        absolute
        h-96
        w-96
        -translate-x-1/2
        -translate-y-1/2
        rounded-full
        bg-cyan-400/10
        blur-[120px]
        "
      />


      {/* Particles */}

      {particles.map((particle)=>(
        <motion.span

          key={particle.id}

          initial={{
            x:`${particle.x}vw`,
            y:`${particle.y}vh`,
            opacity:0,
          }}

          animate={{
            y:[
              `${particle.y}vh`,
              `${particle.y-15}vh`,
              `${particle.y}vh`,
            ],
            opacity:[
              0,
              .7,
              0
            ],
          }}

          transition={{
            duration:particle.duration,
            repeat:Infinity,
            ease:"easeInOut",
          }}

          className="
          absolute
          rounded-full
          bg-cyan-300
          "

          style={{
            width:particle.size,
            height:particle.size,
          }}

        />

      ))}

    </div>
  );
}