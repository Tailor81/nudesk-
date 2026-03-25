"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  LayoutDashboard,
  PlayCircle,
  Video,
  BookOpen,
  Award,
  BarChart2,
  Settings,
} from "lucide-react";
import { Sidebar, type SidebarSection } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";

const sections: SidebarSection[] = [
  {
    title: "Main",
    links: [
      { label: "Overview", href: "/dashboard/student", icon: LayoutDashboard },
      { label: "My Courses", href: "/dashboard/student/courses", icon: PlayCircle },
      { label: "Live Classes", href: "/dashboard/student/live", icon: Video, badge: "2" },
      { label: "Study Guides", href: "/dashboard/student/guides", icon: BookOpen },
      { label: "Certificates", href: "/dashboard/student/certificates", icon: Award },
      { label: "Progress", href: "/dashboard/student/progress", icon: BarChart2 },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Settings", href: "/dashboard/student/settings", icon: Settings },
    ],
  },
];

const titleMap: Record<string, string> = {
  "/dashboard/student": "Overview",
  "/dashboard/student/courses": "My Courses",
  "/dashboard/student/live": "Live Classes",
  "/dashboard/student/guides": "Study Guides",
  "/dashboard/student/certificates": "Certificates",
  "/dashboard/student/progress": "Progress",
  "/dashboard/student/settings": "Settings",
};

export default function StudentDashboardLayout({
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
        userInitials="AK"
        userName="Amara Kofi"
        userRole="Student · Plus Plan"
        avatarColor="violet"
      />
      <div className="ml-[240px]">
        <Topbar
          title={title}
          userName="Amara Kofi"
          userInitials="AK"
          avatarColor="violet"
          searchPlaceholder="Search courses..."
        />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
