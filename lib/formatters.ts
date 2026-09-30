/**
 * Formatters for Adversarial Arena
 * Enforces tabular-nums consistency and standard representations.
 */

/**
 * Formats a decimal or percentage number into a formatted RFR string.
 * Example: 0.473 -> "47.3%" or 47.3 -> "47.3%"
 */
export function formatRFR(n: number): string {
  const percentage = n <= 1 && n >= 0 ? n * 100 : n;
  return `${percentage.toFixed(1)}%`;
}

/**
 * Formats a decimal or percentage number into a percentage string.
 * Example: 0.2 -> "20%" or 0.473 -> "47.3%"
 */
export function formatPercent(n: number, decimals = 1): string {
  const percentage = n <= 1 && n >= 0 ? n * 100 : n;
  return `${percentage % 1 === 0 ? percentage.toFixed(0) : percentage.toFixed(decimals)}%`;
}

/**
 * Formats milliseconds into human-readable duration, e.g. "3m 20s" or "450ms".
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${Math.round(ms)}ms`;
  }
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${seconds}s`;
  }
  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
}

/**
 * Formats a Date or ISO timestamp into a relative time string.
 * Example: "2 hours ago", "just now"
 */
export function formatRelative(dateInput: Date | string | number): string {
  const date = typeof dateInput === "object" ? dateInput : new Date(dateInput);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  const diffWeeks = Math.floor(diffDays / 7);
  return `${diffWeeks}w ago`;
}

/**
 * Formats an integer or decimal with thousand separators for tabular display.
 * Example: 2400 -> "2,400"
 */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

/**
 * Formats a run timestamp into [HH:MM:SS] format for logs.
 */
export function formatLogTimestamp(dateInput: Date | string | number = new Date()): string {
  const date = typeof dateInput === "object" ? dateInput : new Date(dateInput);
  return date.toTimeString().split(" ")[0];
}
