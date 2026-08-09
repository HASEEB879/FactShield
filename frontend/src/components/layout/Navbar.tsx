"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "About", href: "#about" },
];

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="fixed left-0 right-0 top-0 z-50"
    >
      <div className="mx-auto mt-5 flex max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-6 py-3 backdrop-blur-2xl shadow-2xl">

        <Link href="/" className="flex items-center gap-3">

          <Image
            src="/branding/Main Logo.svg"
            alt="FactShield"
            width={42}
            height={42}
            priority
          />

          <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-200 bg-clip-text text-transparent">
            FactShield
          </span>

        </Link>

        <nav className="hidden gap-8 md:flex">

          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative text-slate-300 transition hover:text-cyan-300"
            >
              {item.label}
            </Link>
          ))}

        </nav>

        <Button
          className="rounded-xl bg-cyan-500 px-6 text-black transition hover:scale-105 hover:bg-cyan-400"
        >
          Verify Now
        </Button>

      </div>
    </motion.header>
  );
}