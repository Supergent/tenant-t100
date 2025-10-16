import type { Metadata } from "next";
import "./globals.css";
import { ConvexAuthProvider } from "@/providers/convex-auth-provider";

export const metadata: Metadata = {
  title: "TaskFlow - Your Smart Todo List",
  description: "Stay organized and productive with TaskFlow, powered by AI assistance",
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ConvexAuthProvider>{children}</ConvexAuthProvider>
      </body>
    </html>
  );
}
