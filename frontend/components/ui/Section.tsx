import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function Section({ children, className, id }: SectionProps) {
  return (
    <section
      id={id}
      className={cn("w-full px-4 sm:px-6 lg:px-8", className)}
    >
      <div className="mx-auto max-w-5xl">{children}</div>
    </section>
  );
}