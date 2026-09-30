/**
 * Domain Color Semantics
 * Enforces strict color isolation:
 * - Probe UI: --probe (dusty rose #C77B7B, bg #2A1E1E)
 * - Validator UI: --validator (sage green #7FB88E, bg #1E2A22)
 * - Warning: --warning (amber #D4A574, bg #2A241E)
 * - Info: --info (soft slate blue #7FA8C9, bg #1E2429)
 *
 * RFR Thresholds:
 *   > 50%   → --probe (high failure rate)
 *   20-50%  → --warning (moderate risk)
 *   < 20%   → --validator (high robustness)
 */

export type SemanticDomain = "probe" | "validator" | "warning" | "info";

export interface SemanticClassGroup {
  badge: string;
  border: string;
  text: string;
  bg: string;
  dot: string;
}

/**
 * Returns the semantic classification for a given Robustness Failure Rate (RFR).
 * Accepts either ratio (0.0 to 1.0) or percentage (0 to 100).
 */
export function rfrColor(rfr: number): "probe" | "warning" | "validator" {
  const percentage = rfr <= 1 && rfr >= 0 ? rfr * 100 : rfr;
  if (percentage > 50) return "probe";
  if (percentage >= 20) return "warning";
  return "validator";
}

export function probeClasses(): SemanticClassGroup {
  return {
    badge: "bg-[var(--probe-bg)] text-[var(--probe)] border border-[var(--probe)]/20",
    border: "border-[var(--probe)]",
    text: "text-[var(--probe)]",
    bg: "bg-[var(--probe-bg)]",
    dot: "bg-[var(--probe)]",
  };
}

export function validatorClasses(): SemanticClassGroup {
  return {
    badge: "bg-[var(--validator-bg)] text-[var(--validator)] border border-[var(--validator)]/20",
    border: "border-[var(--validator)]",
    text: "text-[var(--validator)]",
    bg: "bg-[var(--validator-bg)]",
    dot: "bg-[var(--validator)]",
  };
}

export function warningClasses(): SemanticClassGroup {
  return {
    badge: "bg-[var(--warning-bg)] text-[var(--warning)] border border-[var(--warning)]/20",
    border: "border-[var(--warning)]",
    text: "text-[var(--warning)]",
    bg: "bg-[var(--warning-bg)]",
    dot: "bg-[var(--warning)]",
  };
}

export function infoClasses(): SemanticClassGroup {
  return {
    badge: "bg-[var(--info-bg)] text-[var(--info)] border border-[var(--info)]/20",
    border: "border-[var(--info)]",
    text: "text-[var(--info)]",
    bg: "bg-[var(--info-bg)]",
    dot: "bg-[var(--info)]",
  };
}

export function getSemanticClasses(domain: SemanticDomain): SemanticClassGroup {
  switch (domain) {
    case "probe":
      return probeClasses();
    case "validator":
      return validatorClasses();
    case "warning":
      return warningClasses();
    case "info":
      return infoClasses();
  }
}
