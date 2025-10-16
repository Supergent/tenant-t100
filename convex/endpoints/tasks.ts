/**
 * Endpoint Layer: Tasks
 *
 * Business logic for task management.
 * Composes database operations from the db layer.
 * Handles authentication, authorization, and rate limiting.
 *
 * IMPORTANT: NEVER use ctx.db directly! Always import from ../db
 */

import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { authComponent } from "../auth";
import { rateLimiter } from "../rateLimiter";
import * as Tasks from "../db/tasks";
import {
  isValidTaskTitle,
  isValidTaskDescription,
  isValidPriority,
  isValidDueDate,
} from "../helpers/validation";
import { ERROR_MESSAGES } from "../helpers/constants";

/**
 * Create a new task
 */
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // 1. Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error(ERROR_MESSAGES.NOT_AUTHENTICATED);
    }

    // 2. Rate limiting
    const rateLimitStatus = await rateLimiter.limit(ctx, "createTask", {
      key: authUser._id,
    });
    if (!rateLimitStatus.ok) {
      throw new Error(
        `${ERROR_MESSAGES.RATE_LIMIT_EXCEEDED} Retry after ${rateLimitStatus.retryAfter}ms`
      );
    }

    // 3. Validation
    if (!isValidTaskTitle(args.title)) {
      throw new Error("Task title must be between 1 and 200 characters");
    }

    if (args.description && !isValidTaskDescription(args.description)) {
      throw new Error("Task description must be less than 2000 characters");
    }

    if (args.priority && !isValidPriority(args.priority)) {
      throw new Error("Priority must be low, medium, or high");
    }

    if (args.dueDate && !isValidDueDate(args.dueDate)) {
      throw new Error("Due date must be in the future");
    }

    // 4. Create task (using database layer)
    const taskId = await Tasks.createTask(ctx, {
      userId: authUser._id,
      title: args.title,
      description: args.description,
      priority: args.priority,
      dueDate: args.dueDate,
    });

    return taskId;
  },
});

/**
 * List all tasks for the current user
 */
export const list = query({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error(ERROR_MESSAGES.NOT_AUTHENTICATED);
    }

    return await Tasks.getTasksByUser(ctx, authUser._id);
  },
});

/**
 * List tasks by completion status
 */
export const listByStatus = query({
  args: {
    completed: v.boolean(),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error(ERROR_MESSAGES.NOT_AUTHENTICATED);
    }

    return await Tasks.getTasksByUserAndCompleted(
      ctx,
      authUser._id,
      args.completed
    );
  },
});

/**
 * Get upcoming tasks (sorted by due date)
 */
export const upcoming = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error(ERROR_MESSAGES.NOT_AUTHENTICATED);
    }

    return await Tasks.getUpcomingTasksByUser(ctx, authUser._id, args.limit);
  },
});

/**
 * Get recent tasks
 */
export const recent = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error(ERROR_MESSAGES.NOT_AUTHENTICATED);
    }

    return await Tasks.getRecentTasksByUser(
      ctx,
      authUser._id,
      args.limit || 10
    );
  },
});

/**
 * Get a single task by ID
 */
export const get = query({
  args: {
    id: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error(ERROR_MESSAGES.NOT_AUTHENTICATED);
    }

    const task = await Tasks.getTaskById(ctx, args.id);

    if (!task) {
      throw new Error(ERROR_MESSAGES.TASK_NOT_FOUND);
    }

    // Verify ownership
    if (task.userId !== authUser._id) {
      throw new Error(ERROR_MESSAGES.NOT_AUTHORIZED);
    }

    return task;
  },
});

/**
 * Update a task
 */
export const update = mutation({
  args: {
    id: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
    dueDate: v.optional(v.number()),
    completed: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // 1. Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error(ERROR_MESSAGES.NOT_AUTHENTICATED);
    }

    // 2. Rate limiting
    const rateLimitStatus = await rateLimiter.limit(ctx, "updateTask", {
      key: authUser._id,
    });
    if (!rateLimitStatus.ok) {
      throw new Error(
        `${ERROR_MESSAGES.RATE_LIMIT_EXCEEDED} Retry after ${rateLimitStatus.retryAfter}ms`
      );
    }

    // 3. Verify ownership
    const task = await Tasks.getTaskById(ctx, args.id);
    if (!task) {
      throw new Error(ERROR_MESSAGES.TASK_NOT_FOUND);
    }
    if (task.userId !== authUser._id) {
      throw new Error(ERROR_MESSAGES.NOT_AUTHORIZED);
    }

    // 4. Validation
    if (args.title !== undefined && !isValidTaskTitle(args.title)) {
      throw new Error("Task title must be between 1 and 200 characters");
    }

    if (args.description !== undefined && !isValidTaskDescription(args.description)) {
      throw new Error("Task description must be less than 2000 characters");
    }

    if (args.priority !== undefined && !isValidPriority(args.priority)) {
      throw new Error("Priority must be low, medium, or high");
    }

    if (args.dueDate !== undefined && !isValidDueDate(args.dueDate)) {
      throw new Error("Due date must be in the future");
    }

    // 5. Update task (using database layer)
    const { id, ...updateArgs } = args;
    return await Tasks.updateTask(ctx, id, updateArgs);
  },
});

/**
 * Toggle task completion status
 */
export const toggleComplete = mutation({
  args: {
    id: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    // 1. Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error(ERROR_MESSAGES.NOT_AUTHENTICATED);
    }

    // 2. Rate limiting
    const rateLimitStatus = await rateLimiter.limit(ctx, "updateTask", {
      key: authUser._id,
    });
    if (!rateLimitStatus.ok) {
      throw new Error(
        `${ERROR_MESSAGES.RATE_LIMIT_EXCEEDED} Retry after ${rateLimitStatus.retryAfter}ms`
      );
    }

    // 3. Verify ownership
    const task = await Tasks.getTaskById(ctx, args.id);
    if (!task) {
      throw new Error(ERROR_MESSAGES.TASK_NOT_FOUND);
    }
    if (task.userId !== authUser._id) {
      throw new Error(ERROR_MESSAGES.NOT_AUTHORIZED);
    }

    // 4. Toggle completion (using database layer)
    return await Tasks.toggleTaskCompleted(ctx, args.id);
  },
});

/**
 * Delete a task
 */
export const remove = mutation({
  args: {
    id: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    // 1. Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error(ERROR_MESSAGES.NOT_AUTHENTICATED);
    }

    // 2. Rate limiting
    const rateLimitStatus = await rateLimiter.limit(ctx, "deleteTask", {
      key: authUser._id,
    });
    if (!rateLimitStatus.ok) {
      throw new Error(
        `${ERROR_MESSAGES.RATE_LIMIT_EXCEEDED} Retry after ${rateLimitStatus.retryAfter}ms`
      );
    }

    // 3. Verify ownership
    const task = await Tasks.getTaskById(ctx, args.id);
    if (!task) {
      throw new Error(ERROR_MESSAGES.TASK_NOT_FOUND);
    }
    if (task.userId !== authUser._id) {
      throw new Error(ERROR_MESSAGES.NOT_AUTHORIZED);
    }

    // 4. Delete task (using database layer)
    return await Tasks.deleteTask(ctx, args.id);
  },
});

/**
 * Get task statistics for the current user
 */
export const stats = query({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error(ERROR_MESSAGES.NOT_AUTHENTICATED);
    }

    const totalTasks = await Tasks.countTasksByUser(ctx, authUser._id);
    const completedTasks = await Tasks.countCompletedTasksByUser(ctx, authUser._id);
    const pendingTasks = totalTasks - completedTasks;

    return {
      total: totalTasks,
      completed: completedTasks,
      pending: pendingTasks,
      completionRate:
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    };
  },
});
