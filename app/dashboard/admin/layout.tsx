"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  LayoutDashboard,
  Users,
  FileCheck,
  Layers,
  BarChart2,
  Settings,
} from "lucide-react";
import { Sidebar, type SidebarSection } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/lib/auth-context";

const sections: SidebarSection[] = [
  {
    title: "Platform",
    links: [
      { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
      { label: "Users", href: "/dashboard/admin/users", icon: Users },
      { label: "Applications", href: "/dashboard/admin/applications", icon: FileCheck, badge: "4" },
      { label: "Content Review", href: "/dashboard/admin/content", icon: Layers, badge: "7" },
      { label: "Revenue", href: "/dashboard/admin/revenue", icon: BarChart2 },
    ],
  },
  {
    title: "Config",
    links: [
      { label: "Settings", href: "/dashboard/admin/settings", icon: Settings },
    ],
  },
];

const titleMap: Record<string, string> = {
  "/dashboard/admin": "Overview",
  "/dashboard/admin/users": "Users",
  "/dashboard/admin/applications": "Applications",
  "/dashboard/admin/content": "Content Review",
  "/dashboard/admin/revenue": "Revenue",
  "/dashboard/admin/settings": "Platform Settings",
};

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const title = titleMap[pathname] || "Dashboard";
  const { user } = useAuth();
  const initials = user?.username?.slice(0, 2).toUpperCase() ?? "AD";
  const displayName = user?.username ?? "Admin";

  return (
    <AuthGuard allowedRoles={["admin"]}>
      <div className="min-h-screen bg-neutral-50">
        <Sidebar
          sections={sections}
          userInitials={initials}
          userName={displayName}
          userRole="Admin"
          avatarColor="green"
        />
        <div className="ml-[240px]">
          <Topbar
            title={title}
            userName={displayName}
            userInitials={initials}
            avatarColor="green"
            searchPlaceholder="Search..."
          />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
