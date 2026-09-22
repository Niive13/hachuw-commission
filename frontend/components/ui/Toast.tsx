"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// ============================================================
// TYPES
// ============================================================

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

// ============================================================
// CONTEXT
// ============================================================

const ToastContext = createContext<ToastContextValue | null>(null);

// ============================================================
// PROVIDER
// ============================================================

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, type, message }]);

      // Auto-dismiss setelah 4 detik.
      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast],
  );

  const success = useCallback((m: string) => showToast(m, "success"), [showToast]);
  const error = useCallback((m: string) => showToast(m, "error"), [showToast]);
  const info = useCallback((m: string) => showToast(m, "info"), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info }}>
      {children}

      {/* Toast Container */}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex flex-col gap-2 sm:right-6 sm:top-6">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onDismiss={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ============================================================
// TOAST ITEM
// ============================================================

const typeStyles: Record<ToastType, { bg: string; icon: string; label: string }> = {
  success: {
    bg: "border-success/40 bg-success/10 text-success",
    icon: "✓",
    label: "Berhasil",
  },
  error: {
    bg: "border-danger/40 bg-danger/10 text-danger",
    icon: "✕",
    label: "Error",
  },
  info: {
    bg: "border-info/40 bg-info/10 text-info",
    icon: "ℹ",
    label: "Info",
  },
};

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger animation setelah mount.
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const style = typeStyles[toast.type];

  return (
    <div
      className={cn(
        "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-round border bg-white p-4 shadow-card transition-all duration-300",
        style.bg,
        visible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0",
      )}
    >
      {/* Icon */}
      <span
        className={cn(
          "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold",
          toast.type === "success" && "bg-success text-white",
          toast.type === "error" && "bg-danger text-white",
          toast.type === "info" && "bg-info text-white",
        )}
      >
        {style.icon}
      </span>

      {/* Content */}
      <div className="flex-1">
        <p className="text-xs font-bold uppercase tracking-wide">{style.label}</p>
        <p className="mt-0.5 text-sm text-ink-700">{toast.message}</p>
      </div>

      {/* Close */}
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Close"
        className="text-ink-400 transition-colors hover:text-ink-600"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <path d="M6 6l12 12M6 18L18 6" />
        </svg>
      </button>
    </div>
  );
}

// ============================================================
// HOOK
// ============================================================

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);

  if (!ctx) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }

  return ctx;
}