"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  type Validator,
  type CreateValidatorInput,
  type ValidatorType,
} from "@/types/api";
import { mockValidators } from "@/hooks/useRuns";

export function useValidatorsList() {
  return useQuery<Validator[]>({
    queryKey: ["validators"],
    queryFn: async () => {
      try {
        const res = await api.getValidators();
        return res && res.length > 0 ? res : mockValidators;
      } catch {
        return mockValidators;
      }
    },
    staleTime: 30000,
  });
}

export function useCreateValidator() {
  const queryClient = useQueryClient();

  return useMutation<Validator, Error, CreateValidatorInput>({
    mutationFn: async (data: CreateValidatorInput) => {
      try {
        return await api.createValidator(data);
      } catch {
        // Optimistic fallback for offline demo
        const newValidator: Validator = {
          id: `val_${Math.random().toString(16).substring(2, 9)}`,
          name: data.name,
          type: data.type,
          description: data.description || "Custom defensive guardrail stage",
          is_enabled: data.is_enabled ?? true,
          config: data.config || {},
          created_at: new Date().toISOString(),
        };
        return newValidator;
      }
    },
    onSuccess: (newValidator) => {
      queryClient.setQueryData<Validator[]>(["validators"], (old = []) => [
        ...old,
        newValidator,
      ]);
    },
  });
}

export function useUpdateValidator() {
  const queryClient = useQueryClient();

  return useMutation<
    Validator,
    Error,
    { id: string; data: Partial<Validator> }
  >({
    mutationFn: async ({ id, data }) => {
      try {
        return await api.updateValidator(id, data);
      } catch {
        // Fallback optimistic update
        return {
          id,
          name: data.name || "Validator",
          type: (data.type as ValidatorType) || "keyword_filter",
          description: data.description || "",
          is_enabled: data.is_enabled ?? true,
          config: data.config || {},
          created_at: new Date().toISOString(),
        };
      }
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<Validator[]>(["validators"], (old = []) =>
        old.map((v) => (v.id === updated.id ? { ...v, ...updated } : v))
      );
    },
  });
}

export function useDeleteValidator() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      try {
        await api.deleteValidator(id);
      } catch {
        // Offline demo fallback
      }
    },
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<Validator[]>(["validators"], (old = []) =>
        old.filter((v) => v.id !== deletedId)
      );
    },
  });
}
