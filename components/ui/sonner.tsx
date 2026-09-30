"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      theme="dark"
      position="bottom-right"
      duration={4000}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[var(--surface-raised)] group-[.toaster]:text-[var(--text-primary)] group-[.toaster]:border-[var(--border)] group-[.toaster]:shadow-lg group-[.toaster]:rounded-[8px] group-[.toaster]:p-3.5 group-[.toaster]:text-[13px] group-[.toaster]:font-sans",
          description: "group-[.toast]:text-[var(--text-secondary)]",
          actionButton:
            "group-[.toast]:bg-[var(--accent)] group-[.toast]:text-white group-[.toast]:rounded-[6px] group-[.toast]:text-[12px] group-[.toast]:px-2.5 group-[.toast]:py-1",
          cancelButton:
            "group-[.toast]:bg-[var(--surface)] group-[.toast]:text-[var(--text-secondary)] group-[.toast]:rounded-[6px] group-[.toast]:text-[12px] group-[.toast]:px-2.5 group-[.toast]:py-1",
          error:
            "group-[.toast]:border-[var(--probe)] group-[.toast]:text-[var(--probe)]",
          success:
            "group-[.toast]:border-[var(--validator)] group-[.toast]:text-[var(--validator)]",
          warning:
            "group-[.toast]:border-[var(--warning)] group-[.toast]:text-[var(--warning)]",
          info:
            "group-[.toast]:border-[var(--info)] group-[.toast]:text-[var(--info)]",
        },
      }}
      {...props}
    />
  );
}

export { toast } from "sonner";
