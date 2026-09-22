interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Memuat..." }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-blush-200 border-t-blush-500" />
      <p className="text-sm text-ink-400">{message}</p>
    </div>
  );
}