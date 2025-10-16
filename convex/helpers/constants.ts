/**
 * Application Constants
 *
 * Centralized constants used throughout the application.
 * NO database access, NO business logic.
 */

/**
 * Pagination Settings
 */
export const PAGINATION = {
  TASKS_PER_PAGE: 50,
  MESSAGES_PER_PAGE: 50,
  RECENT_TASKS_LIMIT: 10,
  UPCOMING_TASKS_LIMIT: 5,
} as const;

/**
 * Task Priorities
 */
export const TASK_PRIORITIES = ["low", "medium", "high"] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

/**
 * Priority Display Labels
 */
export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Low Priority",
  medium: "Medium Priority",
  high: "High Priority",
};

/**
 * Priority Colors (for UI)
 */
export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: "#0ea5e9", // Secondary blue
  medium: "#f97316", // Accent orange
  high: "#ef4444", // Danger red
};

/**
 * Thread Status
 */
export const THREAD_STATUSES = ["active", "archived"] as const;
export type ThreadStatus = (typeof THREAD_STATUSES)[number];

/**
 * Message Roles
 */
export const MESSAGE_ROLES = ["user", "assistant"] as const;
export type MessageRole = (typeof MESSAGE_ROLES)[number];

/**
 * Input Limits
 */
export const INPUT_LIMITS = {
  TASK_TITLE_MAX: 200,
  TASK_DESCRIPTION_MAX: 2000,
  THREAD_TITLE_MAX: 100,
  MESSAGE_CONTENT_MAX: 5000,
  USER_ID_MAX: 100,
} as const;

/**
 * Date/Time Constants
 */
export const TIME = {
  MINUTE_MS: 60 * 1000,
  HOUR_MS: 60 * 60 * 1000,
  DAY_MS: 24 * 60 * 60 * 1000,
  WEEK_MS: 7 * 24 * 60 * 60 * 1000,
} as const;

/**
 * Email Configuration
 */
export const EMAIL = {
  FROM_ADDRESS: "noreply@taskflow.app",
  REPLY_TO: "support@taskflow.app",
} as const;

/**
 * AI Assistant Configuration
 */
export const ASSISTANT = {
  NAME: "Task Assistant",
  MAX_CONTEXT_MESSAGES: 20,
  DEFAULT_TEMPERATURE: 0.7,
} as const;

/**
 * Feature Flags
 */
export const FEATURES = {
  EMAIL_NOTIFICATIONS: true,
  AI_ASSISTANT: true,
  TASK_REMINDERS: true,
  WEEKLY_DIGEST: true,
} as const;

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  NOT_AUTHENTICATED: "You must be logged in to perform this action",
  NOT_AUTHORIZED: "You are not authorized to perform this action",
  TASK_NOT_FOUND: "Task not found",
  THREAD_NOT_FOUND: "Thread not found",
  MESSAGE_NOT_FOUND: "Message not found",
  INVALID_INPUT: "Invalid input provided",
  RATE_LIMIT_EXCEEDED: "Rate limit exceeded. Please try again later.",
} as const;

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  TASK_CREATED: "Task created successfully",
  TASK_UPDATED: "Task updated successfully",
  TASK_DELETED: "Task deleted successfully",
  TASK_COMPLETED: "Task marked as complete",
  THREAD_CREATED: "Conversation started successfully",
  THREAD_ARCHIVED: "Conversation archived successfully",
  MESSAGE_SENT: "Message sent successfully",
} as const;
