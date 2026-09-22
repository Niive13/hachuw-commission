import Link from "next/link";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

export function BackButton({
  href = "/",
  label = "Kembali ke Home",
  className,
}: BackButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 text-sm font-semibold text-ink-400 transition-colors hover:text-blush-500",
        className,
      )}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-soft transition-transform group-hover:-translate-x-1 group-hover:bg-blush-50">
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </span>
      {label}
    </Link>
  );
}