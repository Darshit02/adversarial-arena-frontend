"use client";

import React from "react";
import { type Validator } from "@/types/api";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useDeleteValidator } from "@/hooks/useValidatorsManager";
import { toast } from "@/components/ui/toast";
import { AlertTriangle, Trash2 } from "lucide-react";

interface DeleteValidatorModalProps {
  validator: Validator | null;
  onClose: () => void;
}

export function DeleteValidatorModal({
  validator,
  onClose,
}: DeleteValidatorModalProps) {
  const deleteValidator = useDeleteValidator();

  if (!validator) return null;

  const handleDelete = async () => {
    try {
      await deleteValidator.mutateAsync(validator.id);
      toast.success(`Removed guardrail "${validator.name}"`);
      onClose();
    } catch {
      toast.error("Failed to delete validator");
    }
  };

  return (
    <Modal
      open={Boolean(validator)}
      onClose={onClose}
      title="Delete Defensive Guardrail"
      description={`Are you sure you want to delete "${validator.name}"? Active suites using this guardrail stage will bypass it.`}
      size="sm"
    >
      <div className="space-y-4 pt-2">
        <div className="p-3 rounded-[8px] bg-[var(--probe-bg)] border border-[var(--probe)]/30 text-[12px] text-[var(--probe)] flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 stroke-[2] shrink-0 mt-0.5" />
          <span>
            This guardrail will be permanently decommissioned from the pipeline.
          </span>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
            loading={deleteValidator.isPending}
            iconLeft={<Trash2 className="w-3.5 h-3.5 stroke-[1.75]" />}
          >
            Delete Guardrail
          </Button>
        </div>
      </div>
    </Modal>
  );
}
