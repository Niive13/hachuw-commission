"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { PortfolioImage } from "@/types/catalog";

interface ImageGridItemProps {
  image: PortfolioImage;
  onPreview: (url: string) => void;
  onDelete: () => void;
}

export function ImageGridItem({ image, onPreview, onDelete }: ImageGridItemProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative aspect-square overflow-hidden rounded-soft border border-blush-100 bg-cream-50 shadow-soft transition-all hover:shadow-card"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.url}
        alt="Portfolio"
        className="h-full w-full cursor-zoom-in object-cover transition-transform duration-500 group-hover:scale-105"
        onClick={() => onPreview(image.url)}
      />

      {/* Overlay on hover */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900/70 via-transparent to-transparent transition-opacity",
          hovered ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Delete button */}
      {hovered && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          aria-label="Delete image"
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-danger text-white shadow-card transition-transform hover:scale-110"
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
      )}
    </div>
  );
}