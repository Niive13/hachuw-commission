import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
}

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      {icon ? (
        <div className="text-blush-300">{icon}</div>
      ) : (
        <div className="text-4xl">🌷</div>
      )}
      <h3 className="font-display text-lg font-bold text-ink-700">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-ink-400">{description}</p>
      )}
    </div>
  );
}