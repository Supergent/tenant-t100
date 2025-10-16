/**
 * Database Layer Barrel Export
 *
 * Re-exports all database operations for easy importing.
 *
 * Usage in endpoint layer:
 * ```typescript
 * import * as Tasks from "../db/tasks";
 * import * as Threads from "../db/threads";
 * import * as Messages from "../db/messages";
 *
 * // Then call like:
 * await Tasks.createTask(ctx, { userId, title });
 * ```
 *
 * IMPORTANT: This is the ONLY approved way to access database operations.
 * NEVER use ctx.db directly outside the db layer!
 */

export * as Tasks from "./tasks";
export * as Threads from "./threads";
export * as Messages from "./messages";
export * as Dashboard from "./dashboard";
