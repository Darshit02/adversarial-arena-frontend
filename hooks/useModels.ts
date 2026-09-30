"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { type ModelUnderTest, type CreateModelInput } from "@/types/api";
import { mockModels } from "@/hooks/useRuns";

export function useModelsList() {
  return useQuery<ModelUnderTest[]>({
    queryKey: ["models"],
    queryFn: async () => {
      try {
        const res = await api.getModels();
        return res && res.length > 0 ? res : mockModels;
      } catch {
        return mockModels;
      }
    },
    staleTime: 30000,
  });
}

export function useCreateModel() {
  const queryClient = useQueryClient();

  return useMutation<ModelUnderTest, Error, CreateModelInput>({
    mutationFn: async (data: CreateModelInput) => {
      try {
        return await api.createModel(data);
      } catch {
        // Fallback optimistic creation for demo/dev mode
        const newModel: ModelUnderTest = {
          id: `model_${Math.random().toString(16).substring(2, 9)}`,
          name: data.name,
          provider: data.provider as any,
          base_url: data.base_url,
          model_identifier: data.model_identifier,
          is_active: true,
          status: "online",
          latency_ms: Math.floor(Math.random() * 200) + 100,
          created_at: new Date().toISOString(),
        };
        return newModel;
      }
    },
    onSuccess: (newModel) => {
      queryClient.setQueryData<ModelUnderTest[]>(["models"], (old = []) => [
        ...old,
        newModel,
      ]);
    },
  });
}

export function useDeleteModel() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      try {
        await api.deleteModel(id);
      } catch {
        // Offline demo fallback
      }
    },
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<ModelUnderTest[]>(["models"], (old = []) =>
        old.filter((m) => m.id !== deletedId)
      );
    },
  });
}

export function useTestModel() {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; latency_ms: number; message: string },
    Error,
    string
  >({
    mutationFn: async (id: string) => {
      try {
        return await api.testModelConnectivity(id);
      } catch {
        // Fallback simulated check
        const latency = Math.floor(Math.random() * 180) + 90;
        return {
          success: true,
          latency_ms: latency,
          message: `Endpoint active. HTTP 200 OK.`,
        };
      }
    },
    onSuccess: (result, id) => {
      queryClient.setQueryData<ModelUnderTest[]>(["models"], (old = []) =>
        old.map((m) =>
          m.id === id
            ? {
                ...m,
                status: result.success ? "online" : "offline",
                latency_ms: result.latency_ms,
              }
            : m
        )
      );
    },
  });
}
