/**
 * Validation Helpers
 *
 * Pure functions for input validation.
 * NO database access, NO ctx parameter.
 *
 * These functions are used in the endpoint layer to validate user input
 * before passing it to the database layer.
 */

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

/**
 * Validate task title
 */
export function isValidTaskTitle(title: string): boolean {
  return title.trim().length > 0 && title.length <= 200;
}

/**
 * Validate task description
 */
export function isValidTaskDescription(description: string): boolean {
  return description.length <= 2000;
}

/**
 * Validate priority value
 */
export function isValidPriority(
  priority: string
): priority is "low" | "medium" | "high" {
  return ["low", "medium", "high"].includes(priority);
}

/**
 * Validate due date (must be in the future)
 */
export function isValidDueDate(dueDate: number): boolean {
  return dueDate > Date.now();
}

/**
 * Validate thread title
 */
export function isValidThreadTitle(title: string): boolean {
  return title.trim().length > 0 && title.length <= 100;
}

/**
 * Validate message content
 */
export function isValidMessageContent(content: string): boolean {
  return content.trim().length > 0 && content.length <= 5000;
}

/**
 * Sanitize user input (basic XSS prevention)
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, "");
}

/**
 * Validate user ID format
 */
export function isValidUserId(userId: string): boolean {
  return userId.length > 0 && userId.length <= 100;
}

/**
 * Parse and validate date input
 */
export function parseDueDate(dateString: string): number | null {
  try {
    const timestamp = new Date(dateString).getTime();
    if (isNaN(timestamp)) {
      return null;
    }
    return timestamp;
  } catch {
    return null;
  }
}

/**
 * Format validation error message
 */
export function formatValidationError(field: string, message: string): string {
  return `Validation error on ${field}: ${message}`;
}
