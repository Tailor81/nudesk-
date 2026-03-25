"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  LayoutDashboard,
  Layers,
  Video,
  Users,
  BarChart2,
  Settings,
} from "lucide-react";
import { Sidebar, type SidebarSection } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";

const sections: SidebarSection[] = [
  {
    title: "Main",
    links: [
      { label: "Overview", href: "/dashboard/tutor", icon: LayoutDashboard },
      { label: "My Content", href: "/dashboard/tutor/content", icon: Layers },
      { label: "Live Classes", href: "/dashboard/tutor/live", icon: Video, badge: "1" },
      { label: "Students", href: "/dashboard/tutor/students", icon: Users },
      { label: "Earnings", href: "/dashboard/tutor/earnings", icon: BarChart2 },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Settings", href: "/dashboard/tutor/settings", icon: Settings },
    ],
  },
];

const titleMap: Record<string, string> = {
  "/dashboard/tutor": "Overview",
  "/dashboard/tutor/content": "My Content",
  "/dashboard/tutor/live": "Live Classes",
  "/dashboard/tutor/students": "Students",
  "/dashboard/tutor/earnings": "Earnings",
  "/dashboard/tutor/settings": "Settings",
};

export default function TutorDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const title = titleMap[pathname] || "Dashboard";

  return (
    <div className="min-h-screen bg-neutral-50">
      <Sidebar
        sections={sections}
        userInitials="SO"
        userName="Dr. Sarah Osei"
        userRole="Tutor · Pro Plan"
        avatarColor="orange"
      />
      <div className="ml-[240px]">
        <Topbar
          title={title}
          userName="Dr. Sarah Osei"
          userInitials="SO"
          avatarColor="orange"
          searchPlaceholder="Search content..."
        />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
