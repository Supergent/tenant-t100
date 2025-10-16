/**
 * Database Layer: Messages
 *
 * This is the ONLY file that directly accesses the messages table using ctx.db.
 * All messages-related database operations are defined here as pure async functions.
 *
 * The messages table stores individual messages within conversation threads.
 */

import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

/**
 * CREATE - Create a new message
 */
export async function createMessage(
  ctx: MutationCtx,
  args: {
    threadId: Id<"threads">;
    userId: string;
    role: "user" | "assistant";
    content: string;
  }
) {
  return await ctx.db.insert("messages", {
    threadId: args.threadId,
    userId: args.userId,
    role: args.role,
    content: args.content,
    createdAt: Date.now(),
  });
}

/**
 * READ - Get message by ID
 */
export async function getMessageById(ctx: QueryCtx, id: Id<"messages">) {
  return await ctx.db.get(id);
}

/**
 * READ - Get all messages for a thread
 */
export async function getMessagesByThread(
  ctx: QueryCtx,
  threadId: Id<"threads">
) {
  return await ctx.db
    .query("messages")
    .withIndex("by_thread", (q) => q.eq("threadId", threadId))
    .order("asc")
    .collect();
}

/**
 * READ - Get messages for a thread with pagination
 */
export async function getMessagesByThreadPaginated(
  ctx: QueryCtx,
  threadId: Id<"threads">,
  limit: number = 50
) {
  return await ctx.db
    .query("messages")
    .withIndex("by_thread", (q) => q.eq("threadId", threadId))
    .order("asc")
    .take(limit);
}

/**
 * READ - Get all messages for a user (across all threads)
 */
export async function getMessagesByUser(ctx: QueryCtx, userId: string) {
  return await ctx.db
    .query("messages")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .order("desc")
    .collect();
}

/**
 * READ - Get latest message in a thread
 */
export async function getLatestMessageInThread(
  ctx: QueryCtx,
  threadId: Id<"threads">
) {
  const messages = await ctx.db
    .query("messages")
    .withIndex("by_thread", (q) => q.eq("threadId", threadId))
    .order("desc")
    .take(1);

  return messages[0] || null;
}

/**
 * DELETE - Delete a message
 */
export async function deleteMessage(ctx: MutationCtx, id: Id<"messages">) {
  return await ctx.db.delete(id);
}

/**
 * DELETE - Delete all messages in a thread
 */
export async function deleteMessagesByThread(
  ctx: MutationCtx,
  threadId: Id<"threads">
) {
  const messages = await ctx.db
    .query("messages")
    .withIndex("by_thread", (q) => q.eq("threadId", threadId))
    .collect();

  for (const message of messages) {
    await ctx.db.delete(message._id);
  }

  return messages.length;
}

/**
 * ANALYTICS - Count messages in a thread
 */
export async function countMessagesByThread(
  ctx: QueryCtx,
  threadId: Id<"threads">
) {
  const messages = await ctx.db
    .query("messages")
    .withIndex("by_thread", (q) => q.eq("threadId", threadId))
    .collect();

  return messages.length;
}

/**
 * ANALYTICS - Count total messages by user
 */
export async function countMessagesByUser(ctx: QueryCtx, userId: string) {
  const messages = await ctx.db
    .query("messages")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .collect();

  return messages.length;
}
