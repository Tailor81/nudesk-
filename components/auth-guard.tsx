"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import type { UserRole } from "@/lib/types";

interface AuthGuardProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      // Admins have a separate login
      if (allowedRoles?.includes("admin") && allowedRoles.length === 1) {
        router.replace("/admin/login");
      } else {
        router.replace("/auth/signin");
      }
      return;
    }

    // Admin users skip profile-complete and approval checks
    if (user.role !== "admin") {
      if (!user.is_profile_complete) {
        router.replace("/auth/profile-setup");
        return;
      }

      if (user.role === "tutor" && !user.is_approved) {
        router.replace("/auth/pending-approval");
        return;
      }
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.replace(`/dashboard/${user.role}`);
    }
  }, [user, loading, allowedRoles, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg
            className="animate-spin w-8 h-8 text-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M21 12a9 9 0 11-6.219-8.56" />
          </svg>
          <p className="text-sm text-neutral-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;
  if (user.role !== "admin") {
    if (!user.is_profile_complete) return null;
    if (user.role === "tutor" && !user.is_approved) return null;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) return null;

  return <>{children}</>;
}
