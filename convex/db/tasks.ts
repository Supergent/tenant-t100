/**
 * Database Layer: Tasks
 *
 * This is the ONLY file that directly accesses the tasks table using ctx.db.
 * All tasks-related database operations are defined here as pure async functions.
 *
 * The tasks table stores user's todo items with completion status, priority, and due dates.
 */

import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

/**
 * CREATE - Create a new task
 */
export async function createTask(
  ctx: MutationCtx,
  args: {
    userId: string;
    title: string;
    description?: string;
    priority?: "low" | "medium" | "high";
    dueDate?: number;
  }
) {
  const now = Date.now();
  return await ctx.db.insert("tasks", {
    userId: args.userId,
    title: args.title,
    description: args.description,
    completed: false,
    priority: args.priority,
    dueDate: args.dueDate,
    createdAt: now,
    updatedAt: now,
  });
}

/**
 * READ - Get task by ID
 */
export async function getTaskById(ctx: QueryCtx, id: Id<"tasks">) {
  return await ctx.db.get(id);
}

/**
 * READ - Get all tasks for a user
 */
export async function getTasksByUser(ctx: QueryCtx, userId: string) {
  return await ctx.db
    .query("tasks")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .order("desc")
    .collect();
}

/**
 * READ - Get tasks by user and completion status
 */
export async function getTasksByUserAndCompleted(
  ctx: QueryCtx,
  userId: string,
  completed: boolean
) {
  return await ctx.db
    .query("tasks")
    .withIndex("by_user_and_completed", (q) =>
      q.eq("userId", userId).eq("completed", completed)
    )
    .order("desc")
    .collect();
}

/**
 * READ - Get upcoming tasks (sorted by due date)
 */
export async function getUpcomingTasksByUser(
  ctx: QueryCtx,
  userId: string,
  limit?: number
) {
  const query = ctx.db
    .query("tasks")
    .withIndex("by_user_and_due_date", (q) => q.eq("userId", userId))
    .filter((q) => q.neq(q.field("dueDate"), undefined))
    .order("asc");

  if (limit) {
    return await query.take(limit);
  }

  return await query.collect();
}

/**
 * READ - Get recently created tasks
 */
export async function getRecentTasksByUser(
  ctx: QueryCtx,
  userId: string,
  limit: number = 10
) {
  return await ctx.db
    .query("tasks")
    .withIndex("by_user_and_created_at", (q) => q.eq("userId", userId))
    .order("desc")
    .take(limit);
}

/**
 * UPDATE - Update a task
 */
export async function updateTask(
  ctx: MutationCtx,
  id: Id<"tasks">,
  args: {
    title?: string;
    description?: string;
    completed?: boolean;
    priority?: "low" | "medium" | "high";
    dueDate?: number;
  }
) {
  return await ctx.db.patch(id, {
    ...args,
    updatedAt: Date.now(),
  });
}

/**
 * UPDATE - Toggle task completion status
 */
export async function toggleTaskCompleted(ctx: MutationCtx, id: Id<"tasks">) {
  const task = await ctx.db.get(id);
  if (!task) {
    throw new Error("Task not found");
  }

  return await ctx.db.patch(id, {
    completed: !task.completed,
    updatedAt: Date.now(),
  });
}

/**
 * DELETE - Delete a task
 */
export async function deleteTask(ctx: MutationCtx, id: Id<"tasks">) {
  return await ctx.db.delete(id);
}

/**
 * ANALYTICS - Count tasks by user
 */
export async function countTasksByUser(ctx: QueryCtx, userId: string) {
  const tasks = await ctx.db
    .query("tasks")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .collect();

  return tasks.length;
}

/**
 * ANALYTICS - Count completed tasks by user
 */
export async function countCompletedTasksByUser(ctx: QueryCtx, userId: string) {
  const tasks = await ctx.db
    .query("tasks")
    .withIndex("by_user_and_completed", (q) =>
      q.eq("userId", userId).eq("completed", true)
    )
    .collect();

  return tasks.length;
}
