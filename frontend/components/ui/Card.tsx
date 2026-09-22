import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  hover?: boolean;
}

export function Card({ children, className, hover = false, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white/80 backdrop-blur-sm rounded-round border border-blush-100 shadow-soft p-6",
        hover &&
          "transition-all duration-300 hover:shadow-hover hover:-translate-y-1 hover:border-blush-200",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}