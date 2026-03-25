import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  max?: number;
  className?: string;
}

export function StarRating({ rating, max = 5, className }: StarRatingProps) {
  return (
    <div className={cn("inline-flex items-center gap-px", className)}>
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "w-3.5 h-3.5",
            i < Math.round(rating)
              ? "fill-star text-star"
              : "fill-neutral-200 text-neutral-200"
          )}
        />
      ))}
    </div>
  );
}
