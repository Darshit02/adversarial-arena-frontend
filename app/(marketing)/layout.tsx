import React from "react";
import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-base)]">
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
