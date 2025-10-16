import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Database Schema for Todo List Application
 *
 * Architecture: Four-layer Convex pattern (db/endpoints/workflows/helpers)
 * - User-scoped: All operations are scoped to userId
 * - Single-tenant: No organizationId needed for this simple app
 * - Status-based: Tasks have completion status
 * - Timestamped: All records track createdAt/updatedAt
 */

export default defineSchema({
  /**
   * Tasks Table
   *
   * Core entity for the todo list application.
   * Each task belongs to a single user and has a completion status.
   */
  tasks: defineTable({
    userId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    completed: v.boolean(),
    priority: v.optional(
      v.union(v.literal("low"), v.literal("medium"), v.literal("high"))
    ),
    dueDate: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_completed", ["userId", "completed"])
    .index("by_user_and_created_at", ["userId", "createdAt"])
    .index("by_user_and_due_date", ["userId", "dueDate"]),

  /**
   * Agent Threads Table
   *
   * Stores AI assistant conversation threads.
   * Each user can have multiple threads for different conversations.
   */
  threads: defineTable({
    userId: v.string(),
    title: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("archived")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_status", ["userId", "status"]),

  /**
   * Agent Messages Table
   *
   * Stores individual messages within conversation threads.
   * Messages can be from the user or the AI assistant.
   */
  messages: defineTable({
    threadId: v.id("threads"),
    userId: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    createdAt: v.number(),
  })
    .index("by_thread", ["threadId"])
    .index("by_user", ["userId"]),
});
