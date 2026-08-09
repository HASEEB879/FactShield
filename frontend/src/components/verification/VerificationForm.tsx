"use client";

import { Sparkles, Search, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

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
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >

      {/* Header */}
      <div className="flex items-center justify-between">

        <label
          htmlFor="claim"
          className="
          text-sm
          font-semibold
          tracking-wide
          text-white
          "
        >
          Claim to verify
        </label>


        <span
          className="
          rounded-full
          border
          border-cyan-400/20
          bg-cyan-400/10
          px-3
          py-1
          text-xs
          text-cyan-300
          "
        >
          AI + Evidence Analysis
        </span>

      </div>



      {/* Input Area */}
      <div className="relative">


        <textarea

          id="claim"

          value={claim}

          onChange={(event)=>
            onClaimChange(event.target.value)
          }

          placeholder="
          Paste a claim, headline, or statement...
          "

          disabled={isLoading}


          className="
          min-h-40
          w-full
          resize-none

          rounded-3xl

          border
          border-white/10

          bg-slate-950/60

          px-6
          py-5

          text-base
          leading-7

          text-white

          outline-none

          backdrop-blur-xl

          transition-all
          duration-300

          placeholder:text-slate-500

          focus:border-cyan-400/70

          focus:ring-4
          focus:ring-cyan-400/10

          disabled:opacity-50
          "

        />



        <div
          className="
          absolute
          bottom-5
          right-5
          text-slate-500
          "
        >

          <Search
            className="
            h-5
            w-5
            "
          />

        </div>


      </div>





      {/* Button */}

      <motion.button

        type="submit"


        disabled={
          !claim.trim() || isLoading
        }


        whileHover={{
          scale:1.02
        }}


        whileTap={{
          scale:0.97
        }}


        className="
        group

        relative

        flex
        w-full

        items-center
        justify-center

        gap-3


        overflow-hidden

        rounded-2xl


        bg-gradient-to-r

        from-cyan-400

        via-blue-500

        to-indigo-600


        px-6

        py-4


        font-bold

        text-white


        shadow-[0_0_35px_rgba(0,212,255,0.25)]


        transition-all

        duration-300


        hover:shadow-[0_0_50px_rgba(0,212,255,0.45)]


        disabled:cursor-not-allowed

        disabled:opacity-50
        "

      >


        {/* Moving glow */}

        <span
          className="
          absolute
          inset-0

          translate-x-[-100%]

          bg-gradient-to-r

          from-transparent

          via-white/30

          to-transparent

          transition-transform

          duration-700

          group-hover:translate-x-[100%]
          "
        />



        <div className="relative flex items-center gap-3">


          {
            isLoading ?

            <Loader2
              className="
              h-5
              w-5
              animate-spin
              "
            />

            :

            <Sparkles
              className="
              h-5
              w-5
              "
            />

          }



          {
            isLoading

            ?

            "Analyzing Evidence..."

            :

            "Verify Claim"

          }


        </div>


      </motion.button>


    </form>
  );
}