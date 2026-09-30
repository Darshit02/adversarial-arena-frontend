import type { Metadata } from "next";
import { Inter, Lato } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";

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
    <ClerkProvider
      appearance={{
        variables: {
          colorBackground: "#15161B",
          colorForeground: "#EDEDF0",
          colorMutedForeground: "#A8ABB5",
          colorPrimary: "#7C7FE8",
          colorInput: "#1D1F26",
          colorInputForeground: "#EDEDF0",
          colorDanger: "#C77B7B",
          colorSuccess: "#7FB88E",
          colorWarning: "#D4A574",
          borderRadius: "8px",
          fontFamily: "Inter, sans-serif",
        },
        elements: {
          card: "bg-[var(--surface)] border border-[var(--border)] card-highlight shadow-2xl",
          headerTitle: "font-display text-[22px] font-medium text-[var(--text-primary)]",
          headerSubtitle: "text-[13px] text-[var(--text-secondary)]",
          socialButtonsBlockButton:
            "bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface-raised)]",
          formButtonPrimary:
            "bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-[14px] font-medium py-2 rounded-[8px]",
          formFieldInput:
            "bg-[var(--bg-base)] border border-[var(--border)] text-[var(--text-primary)] focus:border-[var(--accent)]",
          footerActionLink: "text-[var(--accent)] hover:text-[var(--accent-hover)]",
        },
      }}
    >
      <html lang="en" className={`dark ${inter.variable} ${lato.variable}`}>
        <body className="bg-[var(--bg-base)] text-[var(--text-primary)] antialiased min-h-screen">
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
