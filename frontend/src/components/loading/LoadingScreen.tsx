"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const messages = [
  "Initializing FactShield AI...",
  "Connecting trusted sources...",
  "Analyzing verification systems...",
  "Preparing evidence engine...",
  "FactShield is ready.",
];

export default function LoadingScreen() {

  const [index, setIndex] = useState(0);

  useEffect(() => {

    const interval = setInterval(() => {

      setIndex((current) =>
        current < messages.length - 1
          ? current + 1
          : current
      );

    }, 1000);


    return () => clearInterval(interval);

  }, []);


  return (

    <motion.div

      initial={{opacity:1}}

      exit={{
        opacity:0,
        scale:1.05
      }}

      transition={{
        duration:.8
      }}

      className="
      fixed inset-0 z-[9999]
      flex items-center justify-center
      overflow-hidden
      bg-[#030712]
      "

    >


      {/* Glow */}

      <motion.div

        animate={{
          scale:[1,1.25,1],
          opacity:[.3,.6,.3]
        }}

        transition={{
          duration:3,
          repeat:Infinity
        }}

        className="
        absolute
        h-[500px]
        w-[500px]
        rounded-full
        bg-cyan-500/20
        blur-[160px]
        "

      />


      <div className="relative flex flex-col items-center">


        {/* Logo */}

        <motion.div

          initial={{
            opacity:0,
            scale:.7
          }}

          animate={{
            opacity:1,
            scale:1,
            y:[0,-8,0]
          }}

          transition={{
            duration:1.2,
            y:{
              duration:2,
              repeat:Infinity
            }
          }}

        >

          <Image

            src="/branding/primary/Main Logo.svg"

            alt="FactShield"

            width={160}

            height={160}

            priority

          />

        </motion.div>



        <motion.h1

          initial={{
            opacity:0
          }}

          animate={{
            opacity:1
          }}

          transition={{
            delay:.5
          }}

          className="
          mt-8
          text-5xl
          font-black
          text-white
          "

        >

          FactShield

        </motion.h1>



        <AnimatePresence mode="wait">

          <motion.p

            key={messages[index]}

            initial={{
              opacity:0,
              y:10
            }}

            animate={{
              opacity:1,
              y:0
            }}

            exit={{
              opacity:0,
              y:-10
            }}

            className="
            mt-6
            text-lg
            text-slate-300
            "

          >

            {messages[index]}

          </motion.p>


        </AnimatePresence>



        {/* Progress */}

        <div
          className="
          mt-10
          h-1
          w-72
          overflow-hidden
          rounded-full
          bg-white/10
          "
        >

          <motion.div

            initial={{
              width:0
            }}

            animate={{
              width:"100%"
            }}

            transition={{
              duration:5
            }}

            className="
            h-full
            bg-gradient-to-r
            from-cyan-400
            to-blue-600
            "

          />

        </div>


      </div>


    </motion.div>

  );
}