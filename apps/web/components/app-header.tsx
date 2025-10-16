/**
 * App Header Component
 *
 * Displays user information and logout functionality.
 */

"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@jn7agm02tf5q7xnzs3esvhz0c97sknhc/components";
import { useRouter } from "next/navigation";

interface AppHeaderProps {
  user: any;
}

export function AppHeader({ user }: AppHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/auth/login");
  };

  return (
    <header className="flex items-center justify-between p-6 bg-surface rounded-lg shadow-sm border border-border">
      <div>
        <h1 className="text-3xl font-bold text-primary">TaskFlow</h1>
        <p className="text-sm text-neutral-foreground-secondary mt-1">
          Welcome back, {user?.name || user?.email || "User"}!
        </p>
      </div>
      <Button onClick={handleLogout} variant="outline">
        Sign Out
      </Button>
    </header>
  );
}
