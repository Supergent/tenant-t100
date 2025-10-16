/**
 * Task List Component
 *
 * Displays all tasks with ability to toggle completion, delete, and filter.
 */

"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button, Badge, Skeleton, Tabs, StyledTabsList, StyledTabsTrigger, StyledTabsContent } from "@jn7agm02tf5q7xnzs3esvhz0c97sknhc/components";
import { useToast } from "@jn7agm02tf5q7xnzs3esvhz0c97sknhc/components";
import { Id } from "@/convex/_generated/dataModel";

export function TaskList() {
  const { toast } = useToast();
  const allTasks = useQuery(api.endpoints.tasks.list);
  const toggleComplete = useMutation(api.endpoints.tasks.toggleComplete);
  const deleteTask = useMutation(api.endpoints.tasks.remove);

  const [activeTab, setActiveTab] = useState<"all" | "active" | "completed">("all");

  const filteredTasks = allTasks?.filter((task) => {
    if (activeTab === "active") return !task.completed;
    if (activeTab === "completed") return task.completed;
    return true;
  });

  const handleToggleComplete = async (taskId: Id<"tasks">) => {
    try {
      await toggleComplete({ id: taskId });
      toast({
        title: "Success",
        description: "Task status updated",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (taskId: Id<"tasks">) => {
    if (!confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      await deleteTask({ id: taskId });
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "bg-danger text-danger-foreground";
      case "medium":
        return "bg-accent text-accent-foreground";
      case "low":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-muted";
    }
  };

  if (!allTasks) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <StyledTabsList>
          <StyledTabsTrigger value="all">
            All ({allTasks.length})
          </StyledTabsTrigger>
          <StyledTabsTrigger value="active">
            Active ({allTasks.filter((t) => !t.completed).length})
          </StyledTabsTrigger>
          <StyledTabsTrigger value="completed">
            Completed ({allTasks.filter((t) => t.completed).length})
          </StyledTabsTrigger>
        </StyledTabsList>

        <StyledTabsContent value={activeTab} className="mt-4">
          {filteredTasks && filteredTasks.length === 0 ? (
            <div className="text-center py-12 text-neutral-foreground-secondary">
              <p className="text-lg">No tasks found</p>
              <p className="text-sm mt-2">
                {activeTab === "all"
                  ? "Create your first task to get started"
                  : `No ${activeTab} tasks`}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks?.map((task) => (
                <div
                  key={task._id}
                  className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleToggleComplete(task._id)}
                        className="mt-1 h-5 w-5 rounded border-border text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                      />

                      {/* Task Content */}
                      <div className="flex-1">
                        <h3
                          className={`font-medium ${
                            task.completed
                              ? "line-through text-neutral-foreground-secondary"
                              : "text-neutral-foreground"
                          }`}
                        >
                          {task.title}
                        </h3>

                        {task.description && (
                          <p className="text-sm text-neutral-foreground-secondary mt-1">
                            {task.description}
                          </p>
                        )}

                        {/* Metadata */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {task.priority && (
                            <Badge
                              variant="subtle"
                              className={getPriorityColor(task.priority)}
                            >
                              {task.priority}
                            </Badge>
                          )}

                          {task.dueDate && (
                            <Badge variant="subtle">
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </Badge>
                          )}

                          <Badge variant="subtle">
                            Created: {new Date(task.createdAt).toLocaleDateString()}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(task._id)}
                      className="text-danger hover:bg-danger/10"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </StyledTabsContent>
      </Tabs>
    </div>
  );
}
