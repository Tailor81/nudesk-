import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "violet" | "orange" | "green" | "red" | "amber" | "blue" | "neutral";
  className?: string;
}

const variantClasses = {
  violet: "bg-violet-100 text-violet-700 border-violet-200",
  orange: "bg-orange-100 text-orange-700 border-orange-200",
  green: "bg-green-100 text-green-700 border-green-200",
  red: "bg-red-100 text-red-700 border-red-200",
  amber: "bg-amber-100 text-amber-700 border-amber-200",
  blue: "bg-blue-100 text-blue-700 border-blue-200",
  neutral: "bg-neutral-100 text-neutral-600 border-neutral-200",
};

export function Badge({ children, variant = "violet", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
