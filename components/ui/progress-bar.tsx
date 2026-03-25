import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: "violet" | "orange" | "green" | "blue";
  className?: string;
}

const colorClasses = {
  violet: "bg-primary",
  orange: "bg-accent",
  green: "bg-success",
  blue: "bg-blue-600",
};

export function ProgressBar({
  value,
  max = 100,
  color = "violet",
  className,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      className={cn("h-1.5 bg-neutral-200 rounded-full overflow-hidden", className)}
    >
      <div
        className={cn("h-full rounded-full transition-all duration-300", colorClasses[color])}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
