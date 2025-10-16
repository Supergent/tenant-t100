/**
 * Email Configuration (Resend)
 *
 * Handles transactional email sending for the application.
 *
 * Features:
 * - Welcome emails for new users
 * - Task reminder notifications
 * - Weekly digest emails
 *
 * Usage in endpoints:
 * ```typescript
 * await resend.sendEmail(ctx, {
 *   from: "noreply@yourdomain.com",
 *   to: user.email,
 *   subject: "Welcome to TaskFlow!",
 *   html: "<p>Welcome!</p>",
 * });
 * ```
 *
 * NOTE: Requires RESEND_API_KEY environment variable
 */

import { Resend } from "@convex-dev/resend";
import { components } from "./_generated/api";

/**
 * Resend Client Instance
 */
export const resend: Resend = new Resend(components.resend, {});

/**
 * Email Templates
 *
 * Pre-defined email templates for common use cases.
 */

export const emailTemplates = {
  /**
   * Welcome Email Template
   */
  welcome: (userName: string) => ({
    subject: "Welcome to TaskFlow! 🎉",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .header { color: #6366f1; font-size: 28px; font-weight: bold; margin-bottom: 20px; }
            .content { color: #0f172a; line-height: 1.6; }
            .button {
              display: inline-block;
              background: #6366f1;
              color: white;
              padding: 12px 24px;
              border-radius: 8px;
              text-decoration: none;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">Welcome to TaskFlow!</div>
            <div class="content">
              <p>Hi ${userName},</p>
              <p>Thanks for joining TaskFlow! We're excited to help you stay organized and productive.</p>
              <p>Here are some tips to get started:</p>
              <ul>
                <li>Create your first task to get familiar with the interface</li>
                <li>Set priorities to focus on what matters most</li>
                <li>Use due dates to stay on track</li>
                <li>Chat with our AI assistant for help organizing your tasks</li>
              </ul>
              <p>Let's make today productive! 💪</p>
              <p>Best,<br>The TaskFlow Team</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  /**
   * Task Reminder Email Template
   */
  taskReminder: (userName: string, taskTitle: string, dueDate: Date) => ({
    subject: `Reminder: "${taskTitle}" is due soon`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .content { color: #0f172a; line-height: 1.6; }
            .task-card {
              background: #f8fafc;
              border-left: 4px solid #f97316;
              padding: 16px;
              margin: 20px 0;
              border-radius: 8px;
            }
            .task-title { font-weight: 600; font-size: 18px; margin-bottom: 8px; }
            .due-date { color: #f97316; font-weight: 500; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="content">
              <p>Hi ${userName},</p>
              <p>Just a friendly reminder about an upcoming task:</p>
              <div class="task-card">
                <div class="task-title">${taskTitle}</div>
                <div class="due-date">Due: ${dueDate.toLocaleDateString()}</div>
              </div>
              <p>Stay on track and get it done! 🎯</p>
              <p>Best,<br>TaskFlow</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  /**
   * Weekly Digest Email Template
   */
  weeklyDigest: (
    userName: string,
    stats: {
      completedTasks: number;
      pendingTasks: number;
      upcomingDeadlines: number;
    }
  ) => ({
    subject: "Your Weekly TaskFlow Digest 📊",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .header { color: #6366f1; font-size: 24px; font-weight: bold; margin-bottom: 20px; }
            .stat-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin: 24px 0; }
            .stat-card { background: #f8fafc; padding: 20px; border-radius: 8px; text-align: center; }
            .stat-number { font-size: 32px; font-weight: bold; color: #6366f1; }
            .stat-label { color: #475569; margin-top: 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">Your Weekly Summary</div>
            <p>Hi ${userName},</p>
            <p>Here's how your week looked:</p>
            <div class="stat-grid">
              <div class="stat-card">
                <div class="stat-number">${stats.completedTasks}</div>
                <div class="stat-label">Completed</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${stats.pendingTasks}</div>
                <div class="stat-label">Pending</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${stats.upcomingDeadlines}</div>
                <div class="stat-label">Upcoming</div>
              </div>
            </div>
            <p>Keep up the great work! 🌟</p>
            <p>Best,<br>TaskFlow</p>
          </div>
        </body>
      </html>
    `,
  }),
};
