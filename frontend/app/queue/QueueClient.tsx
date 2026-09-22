"use client";

import { useEffect, useState } from "react";
import { Section } from "@/components/ui/Section";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { QueueCard } from "@/components/queue/QueueCard";
import { queueService } from "@/services/queue.service";
import type { QueueItem } from "@/types/queue";
import { BackButton } from "@/components/layout/BackButton";
import { SkeletonQueueList } from "@/components/queue/SkeletonQueueList";

export function QueueClient() {
  const [active, setActive] = useState<QueueItem[]>([]);
  const [completed, setCompleted] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    queueService
      .getAll()
      .then((data) => {
        if (!cancelled) {
          setActive(data.active);
          setCompleted(data.completed);
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e?.message ?? "Gagal memuat queue.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Section className="pt-8">
          <BackButton />
      </Section>
      {/* Header */}
      <Section className="pb-8 pt-16 text-center sm:pt-20">
        <h1 className="font-display text-4xl font-bold text-ink-800 sm:text-5xl">
          Queue
        </h1>
        <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-blush-300" />
        <p className="mx-auto mt-5 max-w-xl text-base text-ink-400">
          Antrian commission yang sedang aku kerjakan. Update berkala ya ♡
        </p>
      </Section>

      {/* Legend */}
      <Section className="pb-6">
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-ink-400">Status:</span>
          <span className="rounded-full bg-peach-100 px-3 py-1 font-semibold text-ink-600">
            Waiting
          </span>
          <span className="rounded-full bg-lavender-100 px-3 py-1 font-semibold text-lavender-500">
            Sketch
          </span>
          <span className="rounded-full bg-warning/20 px-3 py-1 font-semibold text-ink-600">
            Revision
          </span>
          <span className="rounded-full bg-info/20 px-3 py-1 font-semibold text-ink-600">
            Rendering
          </span>
        </div>
      </Section>

      {loading && (
        <Section className="pb-20">
          <SkeletonQueueList count={3} />
        </Section>
      )}

      {error && (
        <Section className="pb-20">
          <div className="rounded-round border border-danger/30 bg-danger/10 p-6 text-center">
            <p className="text-sm text-danger">{error}</p>
          </div>
        </Section>
      )}

      {!loading && !error && (
        <>
          {/* Active Queue */}
          <Section className="pb-12">
            <div className="mb-5 flex items-center gap-3">
              <h2 className="font-display text-xl font-bold text-ink-800">
                Active Queue
              </h2>
              <span className="rounded-full bg-blush-100 px-3 py-1 text-xs font-semibold text-blush-500">
                {active.length}
              </span>
            </div>

            {active.length === 0 ? (
              <EmptyState
                title="Tidak ada antrian aktif"
                description="Semua commission sudah selesai! Slot terbuka untuk order baru ♡"
                icon={<span className="text-4xl">🌸</span>}
              />
            ) : (
              <div className="flex flex-col gap-4">
                {active.map((q) => (
                  <QueueCard key={q.id_queue} queue={q} variant="active" />
                ))}
              </div>
            )}
          </Section>

          {/* Completed Queue */}
          {completed.length > 0 && (
            <Section className="pb-20">
              <div className="mb-5 flex items-center gap-3">
                <h2 className="font-display text-xl font-bold text-ink-500">
                  ✨ Completed
                </h2>
                <span className="rounded-full bg-ink-50 px-3 py-1 text-xs font-semibold text-ink-400">
                  {completed.length}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {completed.map((q) => (
                  <QueueCard key={q.id_queue} queue={q} variant="completed" />
                ))}
              </div>
            </Section>
          )}
        </>
      )}
    </>
  );
}