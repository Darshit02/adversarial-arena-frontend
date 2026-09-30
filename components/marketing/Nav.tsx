"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-200",
        scrolled
          ? "border-b border-[var(--border)] bg-[var(--bg-base)]/80 backdrop-blur-md"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left: Brand */}
        <Link href="/" className="focus-ring rounded-[6px]">
          <Logo withWordmark size={28} />
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium text-[var(--text-secondary)]">
          <Link
            href="/docs"
            className="hover:text-[var(--text-primary)] transition-colors focus-ring rounded-[4px] px-1 py-0.5"
          >
            Docs
          </Link>
          <a
            href="#research"
            className="hover:text-[var(--text-primary)] transition-colors focus-ring rounded-[4px] px-1 py-0.5"
          >
            Research
          </a>
          <Link
            href="/pricing"
            className="hover:text-[var(--text-primary)] transition-colors focus-ring rounded-[4px] px-1 py-0.5"
          >
            Pricing
          </Link>
          <a
            href="#how-it-works"
            className="hover:text-[var(--text-primary)] transition-colors focus-ring rounded-[4px] px-1 py-0.5"
          >
            Methodology
          </a>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
          </Link>
          <Link href="/signup">
            <Button
              variant="primary"
              size="sm"
              iconRight={<ArrowRight className="w-3.5 h-3.5 stroke-[1.75]" />}
            >
              Get started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
