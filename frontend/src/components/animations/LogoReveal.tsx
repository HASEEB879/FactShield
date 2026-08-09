"use client";

import { motion } from "framer-motion";
import Image from "next/image";


export default function LogoReveal() {

  return (

    <motion.div

      initial={{
        opacity:0,
        scale:0.7,
        y:30,
      }}

      animate={{
        opacity:1,
        scale:1,
        y:0,
      }}

      transition={{
        duration:1.2,
        ease:"easeOut",
      }}

      className="relative mb-12"

    >

      {/* Glow */}

      <motion.div

        animate={{
          scale:[1,1.25,1],
          opacity:[0.3,0.6,0.3],
        }}

        transition={{
          duration:3,
          repeat:Infinity,
        }}

        className="
        absolute
        inset-0
        rounded-full
        bg-blue-500/40
        blur-3xl
        "

      />


      {/* Floating logo */}

      <motion.div

        animate={{
          y:[0,-8,0],
        }}

        transition={{
          duration:4,
          repeat:Infinity,
          ease:"easeInOut",
        }}

      >

        <Image

          src="/branding/primary/Main Logo.svg"

          alt="FactShield"

          width={140}

          height={140}

          priority

          className="
          relative
          h-32
          w-32
          object-contain
          "

        />

      </motion.div>


    </motion.div>

  );

}