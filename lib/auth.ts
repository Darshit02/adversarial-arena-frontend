"use client";

import { useUser, useOrganization, useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { setApiAuthTokenGetter } from "./api";

/**
 * Hook to access current user, organization, and auth state.
 * Automatically wires the Clerk getToken function to the API client.
 */
export function useCurrentUser() {
  const { user, isLoaded: userLoaded } = useUser();
  const { organization, isLoaded: orgLoaded } = useOrganization();
  const { getToken } = useAuth();

  useEffect(() => {
    if (getToken) {
      setApiAuthTokenGetter(() => getToken());
    }
  }, [getToken]);

  const isLoading = !userLoaded || !orgLoaded;

  return {
    user: user
      ? {
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress || "",
          name: user.fullName || user.firstName || "Researcher",
          avatar_url: user.imageUrl,
          onboarding_completed: Boolean(
            user.publicMetadata?.onboarding_completed
          ),
          created_at: user.createdAt
            ? new Date(user.createdAt).toISOString()
            : new Date().toISOString(),
        }
      : null,
    org: organization
      ? {
          id: organization.id,
          name: organization.name,
          slug: organization.slug || "",
          plan: "pro" as const,
          created_at: new Date(organization.createdAt).toISOString(),
        }
      : null,
    isLoading,
  };
}
