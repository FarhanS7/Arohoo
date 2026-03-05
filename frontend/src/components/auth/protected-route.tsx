"use client";

import { useAuth } from "@/features/auth/auth.context";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

/**
 * A wrapper component that protects routes from unauthenticated access.
 * Redirects to the login page if the user is not authenticated.
 */
export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: ReactNode;
  allowedRoles?: string[];
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in, redirect to login
        router.push("/login");
      } else if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Logged in but doesn't have required role, redirect to home
        router.push("/");
      }
    }
  }, [user, loading, router, allowedRoles]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  // If no user or unauthorized role, we don't render children (redirect will happen)
  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return null;
  }

  return <>{children}</>;
}
