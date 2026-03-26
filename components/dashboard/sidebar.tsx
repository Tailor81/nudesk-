"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type SidebarLink = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
};

export type SidebarSection = {
  title: string;
  links: SidebarLink[];
};

interface SidebarProps {
  sections: SidebarSection[];
  userInitials: string;
  userName: string;
  userRole: string;
  avatarColor?: "violet" | "orange" | "green";
  onUserClick?: () => void;
  onLogout?: () => void;
}

export function Sidebar({
  sections,
  userInitials,
  userName,
  userRole,
  avatarColor = "violet",
  onUserClick,
  onLogout,
}: SidebarProps) {
  const pathname = usePathname();

  const colorMap = {
    violet: "bg-violet-600 text-white",
    orange: "bg-orange-500 text-white",
    green: "bg-green-600 text-white",
  };

  return (
    <aside className="fixed top-0 left-0 w-[240px] h-screen bg-neutral-900 flex flex-col z-100">
      {/* Logo */}
      <div className="px-5 py-5">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/15 border border-white/20 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth={2.2}
              width={18}
              height={18}
            >
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8m-4-4v4" />
            </svg>
          </div>
          <span className="text-[1.05rem] font-extrabold text-white tracking-tight">
            Nu<span className="text-violet-200">Desk</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {sections.map((section) => (
          <div key={section.title}>
            <div className="text-[.65rem] font-bold uppercase tracking-wider text-white/30 px-2.5 pt-5 pb-2">
              {section.title}
            </div>
            {section.links.map((link) => {
              const active = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[.85rem] font-medium transition-colors mb-0.5",
                    active
                      ? "bg-white/12 text-white"
                      : "text-white/50 hover:bg-white/6 hover:text-white/75"
                  )}
                >
                  <Icon className="w-[18px] h-[18px] shrink-0" />
                  {link.label}
                  {link.badge && (
                    <span className="ml-auto text-[.65rem] font-bold bg-primary text-white px-1.5 py-0.5 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-1">
          <button
            onClick={onUserClick}
            className="flex items-center gap-2.5 px-2 flex-1 min-w-0 rounded-lg hover:bg-white/6 transition-colors py-1.5 cursor-pointer"
          >
            <div
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                colorMap[avatarColor]
              )}
            >
              {userInitials}
            </div>
            <div className="min-w-0 text-left">
              <div className="text-sm font-semibold text-white truncate">
                {userName}
              </div>
              <div className="text-[.7rem] text-white/40">{userRole}</div>
            </div>
          </button>
          {onLogout && (
            <button
              onClick={onLogout}
              title="Log out"
              className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/8 transition-colors shrink-0 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
