/**
 * AI Agent Configuration
 *
 * Configures the AI assistant for helping users with their tasks.
 * Uses OpenAI GPT-4o-mini by default (configurable via environment).
 *
 * Features:
 * - Task management assistance
 * - Natural language task creation
 * - Task suggestions and reminders
 * - Productivity tips
 *
 * Usage in endpoints:
 * ```typescript
 * const response = await assistant.chat(ctx, {
 *   threadId,
 *   message: userMessage,
 *   userId: user._id,
 * });
 * ```
 */

import { Agent } from "@convex-dev/agent";
import { components } from "./_generated/api";
import { openai } from "@ai-sdk/openai";

/**
 * AI Assistant Instance
 *
 * Configured to help users manage their tasks and improve productivity.
 */
export const assistant = new Agent(components.agent, {
  name: "Task Assistant",

  // Use GPT-4o-mini for fast, cost-effective responses
  languageModel: openai.chat("gpt-4o-mini"),

  // System instructions for the AI assistant
  instructions: `You are a helpful AI assistant for a todo list application.

Your role is to:
1. Help users create, organize, and prioritize their tasks
2. Suggest task breakdowns for complex projects
3. Provide productivity tips and time management advice
4. Help users set realistic deadlines and priorities
5. Answer questions about their tasks and progress

Guidelines:
- Be concise and actionable
- Focus on practical task management advice
- Use friendly, encouraging language
- Suggest specific next steps when possible
- Help users break down overwhelming tasks into smaller pieces

When users ask to create tasks, extract:
- Title (required)
- Description (optional)
- Priority (low/medium/high)
- Due date (if mentioned)

Always be supportive and help users stay motivated!`,
});

/**
 * Alternative: Use Claude (Anthropic) instead of OpenAI
 *
 * Uncomment to use Claude Sonnet 3.5:
 * ```typescript
 * import { anthropic } from "@ai-sdk/anthropic";
 *
 * export const assistant = new Agent(components.agent, {
 *   name: "Task Assistant",
 *   languageModel: anthropic.chat("claude-3-5-sonnet-20241022"),
 *   instructions: "...",
 * });
 * ```
 */
