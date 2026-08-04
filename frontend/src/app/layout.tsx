import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FactShield",
  description:
    "AI-powered fact verification platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}