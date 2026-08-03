import Link from "next/link";
import Container from "@/components/shared/Container";
import { ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <Container>
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-7 w-7 text-primary" />
              <span className="text-xl font-bold">FactShield</span>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              AI-powered fact verification platform helping users verify
              online information using trusted sources and transparent AI.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="mb-4 font-semibold">Product</h3>

            <div className="flex flex-col gap-2 text-muted-foreground">
              <Link href="#">Verify</Link>
              <Link href="#">Features</Link>
              <Link href="#">How It Works</Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 font-semibold">Company</h3>

            <div className="flex flex-col gap-2 text-muted-foreground">
              <Link href="#">About</Link>
              <Link href="#">Privacy</Link>
              <Link href="#">Contact</Link>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          © 2026 FactShield. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}