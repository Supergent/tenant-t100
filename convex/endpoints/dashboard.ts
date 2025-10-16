/**
 * Endpoint Layer: Dashboard
 *
 * Provides aggregate metrics and recent data for the dashboard view.
 * This is a REQUIRED endpoint that powers the seeded dashboard widgets.
 *
 * IMPORTANT: NEVER use ctx.db directly! Always import from ../db
 */

import { v } from "convex/values";
import { query } from "../_generated/server";
import { authComponent } from "../auth";
import * as Dashboard from "../db/dashboard";
import * as Tasks from "../db/tasks";
import { ERROR_MESSAGES } from "../helpers/constants";

/**
 * Get dashboard summary statistics
 *
 * Returns aggregate counts for primary entities and key metrics.
 * This powers the dashboard widgets on the homepage.
 */
export const summary = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error(ERROR_MESSAGES.NOT_AUTHENTICATED);
    }

    // Use the _id field (Convex document ID), not userId
    return Dashboard.loadSummary(ctx, authUser._id);
  },
});

/**
 * Get recent tasks for the dashboard table view
 *
 * Returns the latest tasks to display in the homepage table.
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

    // Use the _id field (Convex document ID), not userId
    return Dashboard.loadRecent(ctx, authUser._id, args.limit ?? 5);
  },
});

/**
 * Get productivity metrics
 *
 * Returns time-based metrics for productivity tracking.
 */
export const productivityMetrics = query({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error(ERROR_MESSAGES.NOT_AUTHENTICATED);
    }

    // Get all tasks
    const allTasks = await Tasks.getTasksByUser(ctx, authUser._id);

    // Calculate metrics
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;

    const tasksToday = allTasks.filter((task) => task.createdAt >= oneDayAgo);
    const tasksThisWeek = allTasks.filter((task) => task.createdAt >= oneWeekAgo);
    const completedToday = tasksToday.filter((task) => task.completed);
    const completedThisWeek = tasksThisWeek.filter((task) => task.completed);

    // Calculate overdue tasks
    const overdueTasks = allTasks.filter(
      (task) =>
        !task.completed &&
        task.dueDate !== undefined &&
        task.dueDate < now
    );

    return {
      today: {
        created: tasksToday.length,
        completed: completedToday.length,
      },
      thisWeek: {
        created: tasksThisWeek.length,
        completed: completedThisWeek.length,
      },
      overdue: overdueTasks.length,
    };
  },
});
