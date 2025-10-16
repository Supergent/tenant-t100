/**
 * Convex Client Configuration
 *
 * This file creates the Convex client instance.
 * Used by ConvexProviderWithAuth to connect to the Convex backend.
 */

import { ConvexReactClient } from "convex/react";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL is not set");
}

export const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);
