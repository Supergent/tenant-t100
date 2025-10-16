/**
 * Database Layer: Dashboard
 *
 * This file provides dashboard-specific database queries.
 * Used for aggregating data across multiple tables for analytics.
 *
 * NOTE: This is an exception where we query multiple tables dynamically.
 * We use type assertion to tell TypeScript that our table names are valid.
 */

import type { QueryCtx } from "../_generated/server";
import type { DataModel } from "../_generated/dataModel";

const TABLES = ["tasks", "threads", "messages"] as const;

/**
 * Load summary statistics for dashboard
 */
export async function loadSummary(ctx: QueryCtx, userId: string) {
  const perTable: Record<string, number> = {};

  for (const table of TABLES) {
    // Use type assertion for dynamic table queries
    const records = await ctx.db.query(table as keyof DataModel).collect();
    const scopedRecords = records.filter((record: any) => record.userId === userId);
    perTable[table] = scopedRecords.length;
  }

  const totalRecords = Object.values(perTable).reduce((a, b) => a + b, 0);

  return {
    totalRecords,
    perTable,
    primaryTableCount: perTable["tasks"] ?? 0,
  };
}

/**
 * Load recent tasks for dashboard
 */
export async function loadRecent(ctx: QueryCtx, userId: string, limit = 5) {
  const records = await ctx.db
    .query("tasks" as keyof DataModel)
    .withIndex("by_user_and_created_at", (q) => q.eq("userId", userId))
    .order("desc")
    .take(limit);

  return records.map((record: any) => ({
    _id: record._id,
    name: record.title ?? "Untitled",
    status: record.completed ? "completed" : "pending",
    updatedAt: record.updatedAt ?? null,
  }));
}
