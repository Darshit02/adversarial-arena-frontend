import React from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export function Footer() {
  const sections = [
    {
      title: "Product",
      links: [
        { label: "Attack Lab", href: "/attack-lab" },
        { label: "Probe Registry", href: "/docs" },
        { label: "Validator Chains", href: "/validators" },
        { label: "Run Telemetry", href: "/runs" },
        { label: "Pricing", href: "/pricing" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "/docs" },
        { label: "Research Citations", href: "#research" },
        { label: "Methodology", href: "#how-it-works" },
        { label: "Component Showcase", href: "/dev/components" },
        { label: "API Reference", href: "/docs" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/docs" },
        { label: "Security & Trust", href: "/docs" },
        { label: "Changelog", href: "/docs" },
        { label: "Careers", href: "#" },
        { label: "Contact", href: "mailto:security@adversarial-arena.dev" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Responsible Disclosure", href: "#" },
        { label: "Cookie Settings", href: "#" },
        { label: "SOC 2 Compliance", href: "#" },
      ],
    },
  ];

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)]">
      <div className="max-w-[1440px] mx-auto px-6 py-16 space-y-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Col 1: Brand & statement */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link href="/" className="inline-block focus-ring rounded-[6px]">
              <Logo withWordmark size={24} />
            </Link>
            <p className="text-[12px] leading-relaxed text-[var(--text-muted)]">
              The controlled testbed for adversarial LLM robustness benchmarking and defensive security engineering.
            </p>
          </div>

          {/* Cols 2-5: Link sections */}
          {sections.map((col, idx) => (
            <div key={idx} className="space-y-3">
              <h5 className="text-[11px] uppercase tracking-[0.03em] font-medium text-[var(--text-primary)]">
                {col.title}
              </h5>
              <ul className="space-y-2 text-[13px]">
                {col.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link
                      href={link.href}
                      className="hover:text-[var(--text-primary)] transition-colors focus-ring rounded-[4px]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[var(--text-muted)]">
          <div>
            © 2026 Adversarial Arena. Built for defenders.
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--text-primary)] transition-colors focus-ring rounded-[4px]"
            >
              GitHub
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--text-primary)] transition-colors focus-ring rounded-[4px]"
            >
              X (Twitter)
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--text-primary)] transition-colors focus-ring rounded-[4px]"
            >
              Discord
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
