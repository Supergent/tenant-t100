/**
 * Database Layer: Threads
 *
 * This is the ONLY file that directly accesses the threads table using ctx.db.
 * All threads-related database operations are defined here as pure async functions.
 *
 * The threads table stores AI assistant conversation threads for each user.
 */

import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

/**
 * CREATE - Create a new thread
 */
export async function createThread(
  ctx: MutationCtx,
  args: {
    userId: string;
    title?: string;
    status?: "active" | "archived";
  }
) {
  const now = Date.now();
  return await ctx.db.insert("threads", {
    userId: args.userId,
    title: args.title,
    status: args.status || "active",
    createdAt: now,
    updatedAt: now,
  });
}

/**
 * READ - Get thread by ID
 */
export async function getThreadById(ctx: QueryCtx, id: Id<"threads">) {
  return await ctx.db.get(id);
}

/**
 * READ - Get all threads for a user
 */
export async function getThreadsByUser(ctx: QueryCtx, userId: string) {
  return await ctx.db
    .query("threads")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .order("desc")
    .collect();
}

/**
 * READ - Get threads by user and status
 */
export async function getThreadsByUserAndStatus(
  ctx: QueryCtx,
  userId: string,
  status: "active" | "archived"
) {
  return await ctx.db
    .query("threads")
    .withIndex("by_user_and_status", (q) =>
      q.eq("userId", userId).eq("status", status)
    )
    .order("desc")
    .collect();
}

/**
 * READ - Get active threads for a user
 */
export async function getActiveThreadsByUser(ctx: QueryCtx, userId: string) {
  return getThreadsByUserAndStatus(ctx, userId, "active");
}

/**
 * UPDATE - Update a thread
 */
export async function updateThread(
  ctx: MutationCtx,
  id: Id<"threads">,
  args: {
    title?: string;
    status?: "active" | "archived";
  }
) {
  return await ctx.db.patch(id, {
    ...args,
    updatedAt: Date.now(),
  });
}

/**
 * UPDATE - Archive a thread
 */
export async function archiveThread(ctx: MutationCtx, id: Id<"threads">) {
  return await ctx.db.patch(id, {
    status: "archived",
    updatedAt: Date.now(),
  });
}

/**
 * DELETE - Delete a thread
 */
export async function deleteThread(ctx: MutationCtx, id: Id<"threads">) {
  return await ctx.db.delete(id);
}

/**
 * ANALYTICS - Count threads by user
 */
export async function countThreadsByUser(ctx: QueryCtx, userId: string) {
  const threads = await ctx.db
    .query("threads")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .collect();

  return threads.length;
}

/**
 * ANALYTICS - Count active threads by user
 */
export async function countActiveThreadsByUser(ctx: QueryCtx, userId: string) {
  const threads = await ctx.db
    .query("threads")
    .withIndex("by_user_and_status", (q) =>
      q.eq("userId", userId).eq("status", "active")
    )
    .collect();

  return threads.length;
}
