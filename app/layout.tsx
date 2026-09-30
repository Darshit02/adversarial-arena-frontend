import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600"],
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://adversarial-arena.dev"
  ),
  title: "Adversarial Arena — LLM Robustness Benchmarking",
  description:
    "Adversarial Arena is the controlled testbed where security teams run adversarial probes against their LLM deployments — and measure exactly which guardrails hold.",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Adversarial Arena — LLM Robustness Benchmarking",
    description: "Test your AI before someone else does.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${fraunces.variable}`}>
      <body className="bg-[var(--bg-base)] text-[var(--text-primary)] antialiased min-h-screen">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
