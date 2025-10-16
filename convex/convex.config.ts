import { defineApp } from "convex/server";
import betterAuth from "@convex-dev/better-auth/convex.config";
import rateLimiter from "@convex-dev/rate-limiter/convex.config";
import agent from "@convex-dev/agent/convex.config";
import resend from "@convex-dev/resend/convex.config";

const app = defineApp();

// Better Auth MUST be first
app.use(betterAuth);

// Rate Limiter - Protect API endpoints from abuse
app.use(rateLimiter);

// Agent - AI agent orchestration for chat/assistant features
app.use(agent);

// Resend - Transactional email sending
app.use(resend);

export default app;
