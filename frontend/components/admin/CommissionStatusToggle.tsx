"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

export function CommissionStatusToggle() {
  const [status, setStatus] = useState<"open" | "closed">("open");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    let cancelled = false;
    adminService
      .getSettings()
      .then((settings) => {
        if (cancelled) return;
        const found = settings.find((s) => s.key === "commission_status");
        if (found && (found.value === "open" || found.value === "closed")) {
          setStatus(found.value);
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Gagal memuat.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function toggle(newStatus: "open" | "closed") {
    if (newStatus === status || updating) return;
    setUpdating(true);
    setError(null);
    const prev = status;
    setStatus(newStatus);

    try {
      await adminService.updateSetting("commission_status", newStatus);
      toast.success(
        newStatus === "open"
          ? "Status berubah ke Open for Commission ✨"
          : "Status berubah ke Closed 🚫",
      );
    } catch (e) {
      setStatus(prev);
      const msg = e instanceof Error ? e.message : "Gagal update status.";
      setError(msg);
      toast.error(msg);
    } finally {
      setUpdating(false);
    }
  }
  if (loading) {
    return (
      <div className="rounded-round border border-blush-100 bg-white p-5 shadow-soft">
        <p className="text-sm text-ink-400">Memuat status commission...</p>
      </div>
    );
  }

  return (
    <div className="rounded-round border border-blush-100 bg-white p-5 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-bold text-ink-800">
            Commission Status
          </h3>
          <p className="mt-1 text-xs text-ink-400">
            Kontrol apakah kamu sedang open atau closed untuk commission.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex items-center gap-1 rounded-full border border-blush-100 bg-cream-50 p-1">
          <button
            type="button"
            onClick={() => toggle("open")}
            disabled={updating}
            className={cn(
              "rounded-full px-4 py-2 text-xs font-semibold transition-all",
              status === "open"
                ? "bg-success text-white shadow-soft"
                : "text-ink-500 hover:bg-white",
              updating && "cursor-wait opacity-60",
            )}
          >
            ✨ Open
          </button>
                    <button
            type="button"
            onClick={() => toggle("closed")}
            disabled={updating}
            className={cn(
              "rounded-full px-4 py-2 text-xs font-semibold transition-all",
              status === "closed"
                ? "bg-danger text-white shadow-soft"
                : "text-ink-500 hover:bg-white",
              updating && "cursor-wait opacity-60",
            )}
          >
            🚫 Closed
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-3 text-xs text-danger">{error}</p>
      )}
    </div>
  );
}