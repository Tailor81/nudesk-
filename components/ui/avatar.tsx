import { cn } from "@/lib/utils";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
type AvatarColor = "violet" | "orange" | "green" | "yellow" | "blue";

interface AvatarProps {
  initials: string;
  size?: AvatarSize;
  color?: AvatarColor;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  xs: "w-6 h-6 text-[.65rem]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-lg",
};

const colorClasses: Record<AvatarColor, string> = {
  violet: "bg-violet-100 text-violet-700",
  orange: "bg-orange-100 text-orange-700",
  green: "bg-green-100 text-green-700",
  yellow: "bg-amber-100 text-amber-700",
  blue: "bg-blue-100 text-blue-700",
};

export function Avatar({
  initials,
  size = "md",
  color = "violet",
  className,
}: AvatarProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full font-bold shrink-0",
        sizeClasses[size],
        colorClasses[color],
        className
      )}
    >
      {initials}
    </div>
  );
}
