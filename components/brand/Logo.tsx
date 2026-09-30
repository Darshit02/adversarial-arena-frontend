import React from "react";
import { cn } from "@/lib/utils";
import { Wordmark } from "./Wordmark";

export interface LogoProps {
  size?: number;
  variant?: "default" | "mono";
  withWordmark?: boolean;
  className?: string;
}

export function Logo({
  size = 24,
  variant = "default",
  withWordmark = false,
  className,
}: LogoProps) {
  const isMono = variant === "mono";
  const outerFill = isMono ? "currentColor" : "#EDEDF0";
  const innerFill = isMono ? "var(--bg-base, #0D0E12)" : "#0D0E12";
  const crackStroke = isMono ? "currentColor" : "#7C7FE8";

  const svgElement = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-label="Adversarial Arena Logo"
      role="img"
    >
      <defs>
        {!isMono && (
          <filter id="logo-crack-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComponentTransfer in="blur" result="glow30">
              <feFuncA type="linear" slope="0.3" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode in="glow30" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>

      {/* Outer hexagon: flat-top, 400px wide */}
      <polygon
        points="456,256 356,429.21 156,429.21 56,256 156,82.79 356,82.79"
        fill={outerFill}
      />

      {/* Inner hexagon cutout: rotated 15 deg, 200px wide */}
      <polygon
        points="356,256 306,342.6 206,342.6 156,256 206,169.4 306,169.4"
        fill={innerFill}
        transform="rotate(15 256 256)"
      />

      {/* Diagonal crack: top-left to bottom-right */}
      <path
        d="M 172 110 L 228 206 L 218 246 L 294 306 L 284 346 L 340 402"
        stroke={crackStroke}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter={!isMono ? "url(#logo-crack-glow)" : undefined}
      />
    </svg>
  );

  if (!withWordmark) {
    return svgElement;
  }

  const wordmarkSize = size <= 24 ? "sm" : size <= 36 ? "md" : "lg";

  return (
    <div className="inline-flex items-center gap-2.5">
      {svgElement}
      <Wordmark size={wordmarkSize} />
    </div>
  );
}
