import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import VerifyBox from "@/components/VerifyBox";
import Features from "@/components/sections/Features";
import HowItWorks from "@/components/sections/HowItWorks";
import Stats from "@/components/sections/Stats";
import Footer from "@/components/layout/Footer";
export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <Hero />

      <VerifyBox />
      <Features />
      <HowItWorks />
      <Stats />
      <Footer />
    </main>
  );
}