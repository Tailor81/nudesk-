import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full px-3.5 py-2.5 border-[1.5px] border-neutral-200 rounded-[10px] text-sm bg-white text-neutral-900 outline-none transition-[border-color,box-shadow] duration-150",
          "placeholder:text-neutral-400",
          "focus:border-primary focus:shadow-[0_0_0_3px_rgba(124,58,237,.12)]",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-neutral-100",
          error &&
            "border-error focus:border-error focus:shadow-[0_0_0_3px_rgba(239,68,68,.12)]",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
export { Input };
