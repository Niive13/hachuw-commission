import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { RULES } from "@/lib/constants/rules";
import { cn } from "@/lib/utils";
import { BackButton } from "@/components/layout/BackButton";

export const metadata: Metadata = {
  title: "Rules",
  description:
    "Apa yang bisa dan tidak bisa aku kerjakan. Baca dulu sebelum commission ya!",
};

const typeStyles = {
  do: {
    border: "border-success/40",
    bg: "bg-success/10",
    title: "text-success",
    icon: "✓",
    badge: "bg-success text-white",
  },
  ask: {
    border: "border-warning/40",
    bg: "bg-warning/10",
    title: "text-ink-600",
    icon: "?",
    badge: "bg-warning text-ink-900",
  },
  dont: {
    border: "border-danger/40",
    bg: "bg-danger/10",
    title: "text-danger",
    icon: "✕",
    badge: "bg-danger text-white",
  },
} as const;

export default function RulesPage() {
  return (
    <>
      <Section className="pt-8">
        <BackButton />
      </Section>
      {/* Header */}
      <Section className="pb-8 pt-16 text-center sm:pt-20">
        <h1 className="font-display text-4xl font-bold text-ink-800 sm:text-5xl">
          Rules
        </h1>
        <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-blush-300" />
        <p className="mx-auto mt-5 max-w-xl text-base text-ink-400">
          Sebelum commission, tolong baca rules di bawah ini dulu ya supaya
          kita sama-sama nyaman ♡
        </p>
      </Section>

      {/* Rules Grid */}
      <Section className="pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          {RULES.map((category) => {
            const style = typeStyles[category.type];
            return (
              <Card
                key={category.title}
                className={cn(
                  "border-2",
                  style.border,
                  style.bg,
                  "p-6",
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full text-lg font-bold",
                      style.badge,
                    )}
                  >
                    {style.icon}
                  </span>
                  <h2
                    className={cn(
                      "font-display text-xl font-bold tracking-wide",
                      style.title,
                    )}
                  >
                    {category.title}
                  </h2>
                </div>

                <ul className="mt-5 space-y-2.5">
                  {category.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm leading-relaxed text-ink-600"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-ink-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>

        {/* Note */}
        <Card className="mt-8 border-blush-200 bg-blush-50 p-6 text-center">
          <p className="text-sm text-ink-600">
            Kalau masih ragu apakah ide kamu termasuk DO, ASK, atau DON&apos;T —{" "}
            <span className="font-semibold text-blush-500">
              feel free to ask me first!
            </span>{" "}
            💌
          </p>
        </Card>
      </Section>
    </>
  );
}