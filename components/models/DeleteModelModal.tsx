"use client";

import React from "react";
import { type ModelUnderTest } from "@/types/api";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useDeleteModel } from "@/hooks/useModels";
import { toast } from "@/components/ui/toast";
import { AlertTriangle, Trash2 } from "lucide-react";

interface DeleteModelModalProps {
  model: ModelUnderTest | null;
  onClose: () => void;
}

export function DeleteModelModal({ model, onClose }: DeleteModelModalProps) {
  const deleteModel = useDeleteModel();

  if (!model) return null;

  const handleDelete = async () => {
    try {
      await deleteModel.mutateAsync(model.id);
      toast.success(`Removed model "${model.name}"`);
      onClose();
    } catch {
      toast.error("Failed to remove model");
    }
  };

  return (
    <Modal
      open={Boolean(model)}
      onClose={onClose}
      title="Unregister Model Under Test"
      description={`Are you sure you want to remove "${model.name}"? Active probe suites referencing this model will require reconfiguration.`}
      size="sm"
    >
      <div className="space-y-4 pt-2">
        <div className="p-3 rounded-[8px] bg-[var(--probe-bg)] border border-[var(--probe)]/30 text-[12px] text-[var(--probe)] flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 stroke-[2] shrink-0 mt-0.5" />
          <span>
            This action cannot be undone. Historical benchmark runs evaluating this model will retain their logs and reports.
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
            loading={deleteModel.isPending}
            iconLeft={<Trash2 className="w-3.5 h-3.5 stroke-[1.75]" />}
          >
            Remove Target
          </Button>
        </div>
      </div>
    </Modal>
  );
}
