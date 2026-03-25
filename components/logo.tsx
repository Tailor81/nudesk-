import { Monitor } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "dark" | "light";
  className?: string;
}

export function Logo({ variant = "dark", className }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)}>
      <div className="w-[38px] h-[38px] bg-primary rounded-[10px] flex items-center justify-center shrink-0">
        <Monitor className="w-[18px] h-[18px] text-white" />
      </div>
      <span
        className={cn(
          "text-[1.2rem] font-extrabold tracking-[-0.025em]",
          variant === "dark" ? "text-neutral-900" : "text-white"
        )}
      >
        Nu<span className={variant === "dark" ? "text-primary" : "text-violet-200"}>Desk</span>
      </span>
    </Link>
  );
}
