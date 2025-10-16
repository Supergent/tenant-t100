/**
 * Convex Auth Provider
 *
 * Wraps the app with Convex and Better Auth providers.
 * This is the main provider that connects authentication with Convex backend.
 */

"use client";

import { ConvexProviderWithAuth } from "@convex-dev/better-auth/react";
import { convex } from "@/lib/convex";
import { authClient } from "@/lib/auth-client";
import { ReactNode } from "react";
import { ThemeProvider, ToastProvider } from "@jn7agm02tf5q7xnzs3esvhz0c97sknhc/components";

export function ConvexAuthProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithAuth client={convex} authClient={authClient}>
      <ThemeProvider>
        <ToastProvider>{children}</ToastProvider>
      </ThemeProvider>
    </ConvexProviderWithAuth>
  );
}
