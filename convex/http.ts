import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { createAuth } from "./auth";

/**
 * HTTP Router for Convex Todo App
 *
 * This file configures HTTP routes for the application.
 *
 * Routes:
 * - POST /auth/* - Better Auth authentication endpoints (login, signup, logout, etc.)
 * - GET /auth/* - Better Auth session endpoints (me, session, etc.)
 *
 * Architecture:
 * - Uses httpAction() wrapper for proper TypeScript types
 * - All auth routes handled by Better Auth's built-in handler
 * - Better Auth automatically handles CORS, cookies, and session management
 *
 * Important:
 * - These routes are REQUIRED for Better Auth to work
 * - Do NOT modify unless you know what you're doing
 * - Better Auth handles all security concerns (CSRF, rate limiting, etc.)
 */

const http = httpRouter();

/**
 * POST /auth/* - Handle authentication requests
 *
 * Handles:
 * - POST /auth/sign-up/email - Create new user account
 * - POST /auth/sign-in/email - Log in existing user
 * - POST /auth/sign-out - Log out user
 * - POST /auth/reset-password - Request password reset
 * - POST /auth/update-password - Update password
 */
http.route({
  path: "/auth/*",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const auth = createAuth(ctx);
    return await auth.handler(request);
  }),
});

/**
 * GET /auth/* - Handle authentication queries
 *
 * Handles:
 * - GET /auth/me - Get current user
 * - GET /auth/session - Get current session
 * - GET /auth/verify-email - Verify email (if enabled)
 */
http.route({
  path: "/auth/*",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const auth = createAuth(ctx);
    return await auth.handler(request);
  }),
});

export default http;
