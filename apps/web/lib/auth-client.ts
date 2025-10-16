/**
 * Better Auth Client Configuration
 *
 * This file sets up the authentication client for use in React components.
 *
 * Usage:
 * ```tsx
 * import { authClient } from "@/lib/auth-client";
 *
 * const { signIn } = authClient;
 * await signIn.email({ email, password });
 * ```
 */

import { createAuthClient } from "better-auth/react";
import { convexClient } from "@convex-dev/better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  plugins: [
    convexClient(),
    // Note: No organization plugin for this single-tenant app
  ],
});

/**
 * Hook exports for easier access
 */
export const useSession = authClient.useSession;
export const useSignIn = () => authClient.signIn;
export const useSignUp = () => authClient.signUp;
export const useSignOut = () => authClient.signOut;
