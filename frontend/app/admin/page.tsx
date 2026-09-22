"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { LoadingState } from "@/components/ui/LoadingState";
import { adminService } from "@/services/admin.service";
import { useToast } from "@/components/ui/Toast";
import { CommissionStatusToggle } from "@/components/admin/CommissionStatusToggle";

interface DashboardStats {
  total_catalog: number;
  total_portfolio: number;
  total_queue_active: number;
  queue_waiting: number;
  queue_in_progress: number;
  queue_completed: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    let cancelled = false;

    adminService
      .getDashboard()
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e?.message ?? "Gagal memuat statistik.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-ink-800">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-ink-400">
          Ringkasan aktivitas catalog & queue.
        </p>
      </div>

      {loading && <LoadingState message="Memuat statistik..." />}

      {error && (
        <div className="rounded-round border border-danger/30 bg-danger/10 p-6 text-center">
          <p className="text-sm text-danger">{error}</p>
        </div>
      )}

      {!loading && !error && stats && (
        <>
          {/* Commission Status Toggle */}
          <div className="mb-8">
            <CommissionStatusToggle />
          </div>
          {/* Top Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              label="Total Catalog"
              value={stats.total_catalog}
              icon="🎨"
              href="/admin/catalog"
              color="blush"
            />
            <StatCard
              label="Portfolio Images"
              value={stats.total_portfolio}
              icon="🖼️"
              color="lavender"
            />
            <StatCard
              label="Queue Aktif"
              value={stats.total_queue_active}
              icon="⚡"
              href="/admin/queue"
              color="peach"
            />
          </div>

          {/* Queue Breakdown */}
          <div className="mt-8">
            <h2 className="mb-4 font-display text-xl font-bold text-ink-800">
              Queue Breakdown
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard
                label="Waiting"
                value={stats.queue_waiting}
                icon="⏳"
                color="peach"
                small
              />
              <StatCard
                label="In Progress"
                value={stats.queue_in_progress}
                icon="🎨"
                color="lavender"
                small
              />
              <StatCard
                label="Completed"
                value={stats.queue_completed}
                icon="✅"
                color="success"
                small
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h2 className="mb-4 font-display text-xl font-bold text-ink-800">
              Quick Actions
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href="/admin/catalog"
                className="flex items-center gap-3 rounded-round border border-blush-100 bg-white p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:border-blush-200 hover:shadow-hover"
              >
                <span className="text-2xl">🎨</span>
                <div>
                  <p className="font-semibold text-ink-800">Kelola Catalog</p>
                  <p className="text-xs text-ink-400">
                    Tambah, edit, atau hapus catalog
                  </p>
                </div>
              </Link>
              <Link
                href="/admin/queue"
                className="flex items-center gap-3 rounded-round border border-blush-100 bg-white p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:border-blush-200 hover:shadow-hover"
              >
                <span className="text-2xl">📋</span>
                <div>
                  <p className="font-semibold text-ink-800">Kelola Queue</p>
                  <p className="text-xs text-ink-400">
                    Update status & antrian commission
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ============ STAT CARD COMPONENT ============

type StatColor = "blush" | "lavender" | "peach" | "success";

const colorMap: Record<StatColor, string> = {
  blush: "border-blush-200 bg-blush-50",
  lavender: "border-lavender-200 bg-lavender-50",
  peach: "border-peach-200 bg-peach-100",
  success: "border-success/30 bg-success/10",
};

interface StatCardProps {
  label: string;
  value: number;
  icon: string;
  href?: string;
  color: StatColor;
  small?: boolean;
}

function StatCard({ label, value, icon, href, color, small }: StatCardProps) {
  const content = (
    <div
      className={`flex items-center justify-between rounded-round border p-4 shadow-soft transition-all ${colorMap[color]} ${
        href ? "hover:-translate-y-0.5 hover:shadow-hover" : ""
      }`}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
          {label}
        </p>
        <p
          className={`mt-1 font-display font-bold text-ink-800 ${
            small ? "text-2xl" : "text-3xl"
          }`}
        >
          {value}
        </p>
      </div>
      <span className={small ? "text-2xl" : "text-3xl"}>{icon}</span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}