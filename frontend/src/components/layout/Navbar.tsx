"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <ShieldCheck className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold tracking-tight">
            FactShield
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="#features"
            className="text-muted-foreground transition hover:text-foreground"
          >
            Features
          </Link>

          <Link
            href="#how-it-works"
            className="text-muted-foreground transition hover:text-foreground"
          >
            How it Works
          </Link>

          <Link
            href="#about"
            className="text-muted-foreground transition hover:text-foreground"
          >
            About
          </Link>
        </nav>

        <Button>Get Started</Button>
      </div>
    </header>
  );
}