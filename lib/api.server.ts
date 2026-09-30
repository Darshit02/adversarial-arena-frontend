import { auth } from "@clerk/nextjs/server";
import { apiFetch } from "./api";

/**
 * Server-side authenticated fetch wrapper.
 * Retrieves the current Clerk user JWT token on the server and attaches it as a Bearer token.
 * Only usable in Server Components, Route Handlers, and Server Actions.
 */
export async function apiServer<T>(path: string, init?: RequestInit): Promise<T> {
  const { getToken } = await auth();
  const token = await getToken();
  if (!token) {
    throw new Error("Not authenticated: No active server session token available.");
  }
  return apiFetch<T>(path, { ...init, token });
}
