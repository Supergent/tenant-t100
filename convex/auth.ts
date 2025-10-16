import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth";
import { components } from "./_generated/api";
import { type DataModel } from "./_generated/dataModel";

/**
 * Better Auth Configuration for Convex Todo App
 *
 * This file configures authentication using Better Auth with the Convex plugin.
 *
 * Key Features:
 * - Email/Password authentication
 * - JWT tokens with 30-day expiration
 * - Convex database adapter for user storage
 * - No email verification (for development - enable in production)
 *
 * Architecture:
 * - authComponent: Client for interacting with Better Auth component
 * - createAuth: Factory function that creates Better Auth instance with Convex context
 */

// Create Better Auth client for Convex component
export const authComponent = createClient<DataModel>(components.betterAuth);

/**
 * Create Better Auth instance with Convex context
 *
 * @param ctx - Convex generic context
 * @param options - Configuration options
 * @returns Better Auth instance configured for this application
 */
export const createAuth = (
  ctx: GenericCtx<DataModel>,
  { optionsOnly } = { optionsOnly: false }
) => {
  return betterAuth({
    // Base URL for authentication endpoints
    baseURL: process.env.SITE_URL!,

    // Use Convex as the database adapter
    database: authComponent.adapter(ctx),

    // Enable email/password authentication
    emailAndPassword: {
      enabled: true,
      // Disable email verification for development
      // TODO: Enable in production for security
      requireEmailVerification: false,
    },

    // Plugins
    plugins: [
      // Convex plugin - enables JWT authentication with Convex backend
      convex({
        // JWT tokens expire after 30 days
        jwtExpirationSeconds: 30 * 24 * 60 * 60,
      }),

      // NOTE: organization() plugin NOT needed for this single-tenant app
      // Add it if you need multi-tenant features in the future
    ],
  });
};

/**
 * Type Helpers
 *
 * Export types for use in other parts of the application
 */
export type Auth = ReturnType<typeof createAuth>;
