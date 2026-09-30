import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "bg-base": "var(--bg-base)",
        surface: "var(--surface)",
        "surface-hover": "var(--surface-hover)",
        "surface-raised": "var(--surface-raised)",
        border: "var(--border)",
        "border-subtle": "var(--border-subtle)",

        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        "text-faint": "var(--text-faint)",

        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
        "accent-muted": "var(--accent-muted)",

        probe: "var(--probe)",
        "probe-bg": "var(--probe-bg)",
        validator: "var(--validator)",
        "validator-bg": "var(--validator-bg)",
        warning: "var(--warning)",
        "warning-bg": "var(--warning-bg)",
        info: "var(--info)",
        "info-bg": "var(--info-bg)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-fraunces)", "Georgia", "serif"],
      },
      borderRadius: {
        card: "12px",
        btn: "8px",
        badge: "6px",
      },
      boxShadow: {
        overlay: "0 8px 32px rgba(0, 0, 0, 0.35), 0 0 0 1px var(--border)",
        "card-inset": "inset 0 1px 0 0 rgba(255, 255, 255, 0.05)",
      },
      transitionTimingFunction: {
        "enter-curve": "cubic-bezier(0.16, 1, 0.3, 1)",
        "exit-curve": "cubic-bezier(0.7, 0, 0.84, 0)",
      },
    },
  },
  plugins: [],
};

export default config;
