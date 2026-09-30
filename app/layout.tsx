import type { Metadata } from "next";
import { Inter, Lato } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerk-appearance";
import { Providers } from "@/app/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600"],
});

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  display: "swap",
  weight: ["400", "700", "900"],
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
    <ClerkProvider appearance={clerkAppearance}>
      <html lang="en" className={`dark ${inter.variable} ${lato.variable}`}>
        <body className="bg-[var(--bg-base)] text-[var(--text-primary)] antialiased min-h-screen">
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
