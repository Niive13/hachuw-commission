import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant =
  | "default"
  | "pink"
  | "lavender"
  | "peach"
  | "success"
  | "warning"
  | "danger";

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-ink-50 text-ink-600 border-ink-400/20",
  pink: "bg-blush-100 text-blush-600 border-blush-200",
  lavender: "bg-lavender-100 text-lavender-500 border-lavender-200",
  peach: "bg-peach-100 text-ink-600 border-peach-200",
  success: "bg-success/20 text-ink-700 border-success/40",
  warning: "bg-warning/20 text-ink-700 border-warning/40",
  danger: "bg-danger/20 text-danger border-danger/40",
};

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}