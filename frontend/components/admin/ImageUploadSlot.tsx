"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ImageUploadSlotProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export function ImageUploadSlot({ onFileSelected, disabled }: ImageUploadSlotProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleClick() {
    if (!disabled) inputRef.current?.click();
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelected(file);
      // Reset input biar bisa pilih file yang sama lagi.
      e.target.value = "";
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelected(file);
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        disabled={disabled}
        className={cn(
          "flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-soft border-2 border-dashed bg-cream-50 text-ink-400 transition-all",
          dragging
            ? "border-blush-400 bg-blush-50 text-blush-500 scale-[1.02]"
            : "border-blush-200 hover:border-blush-300 hover:bg-blush-50 hover:text-blush-500",
          disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        <span className="text-3xl">+</span>
        <span className="text-xs font-semibold">Add Image</span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFile}
        className="hidden"
      />
    </>
  );
}