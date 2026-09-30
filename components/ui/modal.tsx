import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  trigger?: React.ReactNode;
}

const sizeClasses: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
  className,
  trigger,
}: ModalProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      {trigger && <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>}
      <DialogPrimitive.Portal>
        {/* Backdrop blur with smooth fade */}
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/70 backdrop-blur-sm",
            "transition-opacity duration-200 ease-out",
            "data-[state=open]:opacity-100 data-[state=closed]:opacity-0"
          )}
        />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 w-full translate-x-[-50%] translate-y-[-50%]",
            "bg-[var(--surface)] border border-[var(--border)] rounded-[12px] p-6 overlay-shadow card-highlight",
            "transition-all duration-200 ease-out",
            "data-[state=open]:opacity-100 data-[state=open]:scale-100 data-[state=open]:translate-y-[-50%]",
            "data-[state=closed]:opacity-0 data-[state=closed]:scale-[0.96] data-[state=closed]:translate-y-[calc(-50%-4px)]",
            sizeClasses[size],
            className
          )}
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="space-y-1">
              {title && (
                <DialogPrimitive.Title className="text-[18px] font-semibold text-[var(--text-primary)] tracking-[-0.01em]">
                  {title}
                </DialogPrimitive.Title>
              )}
              {description && (
                <DialogPrimitive.Description className="text-[13px] text-[var(--text-secondary)]">
                  {description}
                </DialogPrimitive.Description>
              )}
            </div>

            <DialogPrimitive.Close
              onClick={onClose}
              className="rounded-[6px] p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              aria-label="Close"
            >
              <X className="w-4 h-4 stroke-[1.75]" />
            </DialogPrimitive.Close>
          </div>

          <div>{children}</div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
