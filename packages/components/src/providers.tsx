"use client";

import * as React from "react";
import { ToastProvider } from "./toast";

/**
 * Theme Provider
 *
 * Wraps the app to provide theme context.
 * Currently a passthrough but can be extended for dark mode, etc.
 */
export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <>{children}</>;
};

/**
 * App Providers
 *
 * NOTE: This component is designed to be used from the web app
 * where Convex and Auth clients are available.
 *
 * For proper auth integration, import ConvexProviderWithAuth
 * in your app's layout.tsx instead of using this directly.
 */
export const AppProviders: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider>
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  );
};
