"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

const DISCORD_URL = "https://discord.com/users/800943996180496385";

const TEMPLATE_MESSAGE = `Halo Hachuw! 👋

Aku datang dari website Hachuw dan ingin melakukan commission.
Aku mau tanya-tanya mengenai commission terlebih dahulu.`;

export function OrderHereButton() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleCopyAndOpen() {
    try {
      await navigator.clipboard.writeText(TEMPLATE_MESSAGE);
      setCopied(true);
      setTimeout(() => {
        window.open(DISCORD_URL, "_blank", "noopener,noreferrer");
        setOpen(false);
        setCopied(false);
      }, 800);
    } catch {
      // Fallback: buka Discord tanpa copy
      window.open(DISCORD_URL, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        size="lg"
        className="w-full sm:w-auto"
      >
        💬 Order Here!
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-ink-900/50 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-round border border-blush-100 bg-cream-50 p-6 shadow-hover"
          >
            <h3 className="font-display text-xl font-bold text-ink-800">
              Order via Discord 💬
            </h3>
            <p className="mt-2 text-sm text-ink-500">
              Copy template di bawah, lalu buka Discord-ku. Tinggal paste di
              chat ya ♡
            </p>

            <div className="mt-4 rounded-soft border border-blush-200 bg-white p-4">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-ink-700">
                {TEMPLATE_MESSAGE}
              </pre>
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
              >
                Batal
              </Button>
              <Button type="button" onClick={handleCopyAndOpen}>
                {copied ? "✓ Copied!" : "Copy & Open Discord"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}