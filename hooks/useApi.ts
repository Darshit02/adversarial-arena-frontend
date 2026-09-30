"use client";

import { useAuth } from "@clerk/nextjs";
import { apiFetch } from "@/lib/api";

export function useApi() {
  const { getToken } = useAuth();

  return {
    get: async <T>(path: string): Promise<T> => {
      const token = (await getToken()) || undefined;
      return apiFetch<T>(path, { token });
    },
    post: async <T>(path: string, body?: unknown): Promise<T> => {
      const token = (await getToken()) || undefined;
      return apiFetch<T>(path, {
        method: "POST",
        body: body !== undefined ? JSON.stringify(body) : undefined,
        token,
      });
    },
    patch: async <T>(path: string, body?: unknown): Promise<T> => {
      const token = (await getToken()) || undefined;
      return apiFetch<T>(path, {
        method: "PATCH",
        body: body !== undefined ? JSON.stringify(body) : undefined,
        token,
      });
    },
    delete: async (path: string): Promise<void> => {
      const token = (await getToken()) || undefined;
      return apiFetch<void>(path, {
        method: "DELETE",
        token,
      });
    },
  };
}
