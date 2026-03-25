"use client";

import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";
import Link from "next/link";
import { forwardRef, type ButtonHTMLAttributes } from "react";

type ButtonVariant =
  | "primary"
  | "accent"
  | "secondary"
  | "outline-v"
  | "outline-o"
  | "ghost"
  | "ghost-v"
  | "ghost-o"
  | "danger"
  | "danger-ghost"
  | "success-ghost";

type ButtonSize = "sm" | "md" | "lg" | "xl" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconRight?: LucideIcon;
  loading?: boolean;
  href?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white border-primary shadow-[var(--shadow-primary)] hover:bg-primary-hover hover:border-primary-hover hover:shadow-[0_6px_20px_rgba(124,58,237,.35)] hover:-translate-y-px active:translate-y-0",
  accent:
    "bg-accent text-white border-accent shadow-[var(--shadow-accent)] hover:bg-accent-hover hover:border-accent-hover hover:shadow-[0_6px_20px_rgba(249,115,22,.35)] hover:-translate-y-px",
  secondary:
    "bg-white text-neutral-700 border-neutral-200 shadow-sm hover:bg-neutral-50 hover:border-neutral-300",
  "outline-v":
    "bg-transparent text-primary border-primary hover:bg-primary-light",
  "outline-o":
    "bg-transparent text-accent border-accent hover:bg-accent-light",
  ghost:
    "text-neutral-500 border-transparent hover:bg-neutral-100 hover:text-neutral-900",
  "ghost-v": "text-primary border-transparent hover:bg-primary-light",
  "ghost-o": "text-accent border-transparent hover:bg-accent-light",
  danger:
    "bg-error text-white border-error hover:bg-red-700 hover:border-red-700",
  "danger-ghost": "text-error border-transparent hover:bg-error-light",
  "success-ghost": "text-success border-transparent hover:bg-success-light",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-1.5 text-[.8rem] rounded-lg gap-1.5",
  md: "px-[22px] py-2.5 text-sm rounded-[10px] gap-[7px]",
  lg: "px-7 py-[13px] text-[.95rem] rounded-xl gap-2",
  xl: "px-8 py-[15px] text-base rounded-2xl gap-2 font-bold",
  icon: "p-2.5 rounded-[10px]",
};

function buttonClasses(
  variant: ButtonVariant,
  size: ButtonSize,
  className?: string
) {
  return cn(
    "inline-flex items-center justify-center font-semibold leading-none whitespace-nowrap border-[1.5px] transition-all duration-150 cursor-pointer no-underline",
    "focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2",
    "disabled:opacity-45 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none disabled:pointer-events-none",
    variantClasses[variant],
    sizeClasses[size],
    className
  );
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      icon: Icon,
      iconRight: IconRight,
      loading,
      disabled,
      className,
      children,
      href,
      ...props
    },
    ref
  ) => {
    const inner = (
      <>
        {loading && (
          <svg
            className="animate-spin-slow w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M21 12a9 9 0 11-6.219-8.56" />
          </svg>
        )}
        {!loading && Icon && <Icon className="w-4 h-4" />}
        {children}
        {IconRight && <IconRight className="w-4 h-4" />}
      </>
    );

    if (href) {
      return (
        <Link
          href={href}
          className={buttonClasses(variant, size, className)}
        >
          {inner}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={buttonClasses(variant, size, className)}
        {...props}
      >
        {inner}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize };
