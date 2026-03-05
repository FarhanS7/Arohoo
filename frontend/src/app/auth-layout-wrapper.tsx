"use client";

import { AuthProvider } from "@/features/auth/auth.context";
import { ReactNode } from "react";

/**
 * Root Layout wrapper to provide authentication context to the entire application.
 */
export default function AuthLayoutWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
