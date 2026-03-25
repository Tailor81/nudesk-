"use client";

import { Search, Bell } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

interface TopbarProps {
  title: string;
  userName: string;
  userInitials: string;
  avatarColor?: "violet" | "orange" | "green";
  searchPlaceholder?: string;
}

export function Topbar({
  title,
  userName,
  userInitials,
  avatarColor = "violet",
  searchPlaceholder = "Search...",
}: TopbarProps) {
  return (
    <div className="h-[60px] bg-white border-b border-neutral-200 flex items-center px-6 gap-4 sticky top-0 z-50">
      <span className="text-[1.05rem] font-bold tracking-tight">{title}</span>

      <div className="flex items-center gap-3 ml-auto">
        <div className="relative w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-neutral-400" />
          <input
            className="w-full h-9 pl-9 pr-3 text-[.82rem] border-[1.5px] border-neutral-200 rounded-xl bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            placeholder={searchPlaceholder}
          />
        </div>

        <button className="relative w-9 h-9 rounded-xl border-[1.5px] border-neutral-200 bg-white flex items-center justify-center hover:bg-neutral-50 transition-colors">
          <Bell className="w-4 h-4 text-neutral-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
        </button>

        <Avatar initials={userInitials} size="md" color={avatarColor} />
      </div>
    </div>
  );
}
