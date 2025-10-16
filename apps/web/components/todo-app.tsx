/**
 * Todo App Component
 *
 * Main application interface for task management with dashboard.
 * Handles authentication state and displays appropriate UI.
 */

"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, Skeleton } from "@jn7agm02tf5q7xnzs3esvhz0c97sknhc/components";
import { DashboardHero } from "./dashboard-hero";
import { TaskList } from "./task-list";
import { TaskForm } from "./task-form";
import { AppHeader } from "./app-header";

export function TodoApp() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/auth/login");
    }
  }, [session, isPending, router]);

  // Show loading state while checking authentication
  if (isPending) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!session) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <AppHeader user={session.user} />

      {/* Dashboard Overview */}
      <DashboardHero />

      {/* Task Management Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Task Creation Form */}
        <Card className="lg:col-span-1 p-6">
          <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
          <TaskForm />
        </Card>

        {/* Task List */}
        <Card className="lg:col-span-2 p-6">
          <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
          <TaskList />
        </Card>
      </div>
    </div>
  );
}
