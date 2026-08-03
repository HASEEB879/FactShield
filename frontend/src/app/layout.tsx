import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "FactShield",
    template: "%s | FactShield",
  },
  description:
    "AI-powered fact checking platform that helps verify news, claims, websites, and online information using trusted sources and artificial intelligence.",
  keywords: [
    "AI",
    "Fact Check",
    "Fake News",
    "Verification",
    "FactShield",
    "Artificial Intelligence",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
  lang="en"
  className="dark"
  suppressHydrationWarning
>
      <body className="bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}