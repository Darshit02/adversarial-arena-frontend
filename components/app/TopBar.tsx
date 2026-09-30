"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { ChevronRight, Github, BookOpen } from "lucide-react";

export function TopBar() {
  const pathname = usePathname();

  // Generate breadcrumbs from route segments
  const segments = pathname.split("/").filter(Boolean);

  const getSegmentLabel = (segment: string) => {
    switch (segment) {
      case "dashboard":
        return "Dashboard";
      case "attack-lab":
        return "Attack Lab";
      case "runs":
        return "Runs";
      case "validators":
        return "Validators";
      case "models":
        return "Models Under Test";
      case "settings":
        return "Settings";
      case "profile":
        return "Profile";
      case "api-keys":
        return "API Keys";
      default:
        return segment;
    }
  };

  return (
    <header className="h-14 sticky top-0 z-20 w-full bg-[var(--bg-base)]/80 backdrop-blur-md border-b border-[var(--border)] px-6 flex items-center justify-between">
      {/* Left: Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[13px]">
        <Link
          href="/dashboard"
          className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors focus-ring rounded-[4px]"
        >
          Arena
        </Link>

        {segments.map((segment, idx) => {
          const isLast = idx === segments.length - 1;
          const href = `/${segments.slice(0, idx + 1).join("/")}`;

          return (
            <React.Fragment key={segment}>
              <ChevronRight className="w-3.5 h-3.5 text-[var(--text-faint)] stroke-[1.75]" />
              {isLast ? (
                <span className="font-medium text-[var(--text-primary)]">
                  {getSegmentLabel(segment)}
                </span>
              ) : (
                <Link
                  href={href}
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors focus-ring rounded-[4px]"
                >
                  {getSegmentLabel(segment)}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* Center/Right Status Pill */}
      <div className="flex items-center gap-5">
        <Link
          href="/runs"
          className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[6px] bg-[var(--warning-bg)] border border-[var(--warning)]/30 text-[11px] font-medium text-[var(--warning)] tracking-[0.02em] hover:bg-[var(--warning-bg)]/80 transition-colors focus-ring"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--warning)] animate-pulse shrink-0" />
          <span>3 runs active</span>
        </Link>

        {/* Right Action Icons & User Profile */}
        <div className="flex items-center gap-3">
          <Link
            href="/docs"
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] rounded-[6px] transition-colors focus-ring"
            title="Documentation"
          >
            <BookOpen className="w-4 h-4 stroke-[1.75]" />
          </Link>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] rounded-[6px] transition-colors focus-ring"
            title="GitHub Repository"
          >
            <Github className="w-4 h-4 stroke-[1.75]" />
          </a>

          <div className="ml-1 flex items-center">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-7 h-7 rounded-full border border-[var(--border)]",
                },
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
