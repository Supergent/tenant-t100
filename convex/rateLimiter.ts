/**
 * Rate Limiter Configuration
 *
 * Protects API endpoints from abuse using token bucket and fixed window algorithms.
 *
 * Token Bucket: Allows bursts, refills over time (good for user actions)
 * Fixed Window: Hard limit per time window (good for preventing abuse)
 *
 * Usage in endpoints:
 * ```typescript
 * const status = await rateLimiter.limit(ctx, "createTask", { key: user._id });
 * if (!status.ok) {
 *   throw new Error(`Rate limit exceeded. Retry after ${status.retryAfter}ms`);
 * }
 * ```
 */

import { RateLimiter, MINUTE, HOUR } from "@convex-dev/rate-limiter";
import { components } from "./_generated/api";

export const rateLimiter = new RateLimiter(components.rateLimiter, {
  /**
   * Task Operations
   */
  createTask: {
    kind: "token bucket",
    rate: 30, // 30 requests per minute
    period: MINUTE,
    capacity: 5, // Allow bursts of up to 5
  },
  updateTask: {
    kind: "token bucket",
    rate: 60, // 60 requests per minute
    period: MINUTE,
    capacity: 10,
  },
  deleteTask: {
    kind: "token bucket",
    rate: 20, // 20 requests per minute
    period: MINUTE,
    capacity: 3,
  },

  /**
   * Chat/Assistant Operations
   */
  sendMessage: {
    kind: "token bucket",
    rate: 20, // 20 messages per minute
    period: MINUTE,
    capacity: 3,
  },
  createThread: {
    kind: "token bucket",
    rate: 10, // 10 threads per minute
    period: MINUTE,
    capacity: 2,
  },

  /**
   * Auth Operations (stricter limits)
   */
  signup: {
    kind: "fixed window",
    rate: 5, // 5 signups per hour (per IP or user)
    period: HOUR,
  },
  login: {
    kind: "fixed window",
    rate: 10, // 10 login attempts per hour
    period: HOUR,
  },
});
