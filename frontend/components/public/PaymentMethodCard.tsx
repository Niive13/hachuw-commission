"use client";

import { useState } from "react";

interface PaymentMethodCardProps {
  name: string;
  logo: string;
}

export function PaymentMethodCard({ name, logo }: PaymentMethodCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-soft border border-lavender-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-soft">
      {/* Logo container — fixed height, flexible width */}
      <div className="flex h-12 w-full items-center justify-center">
        {!imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logo}
            alt={`${name} logo`}
            className="max-h-12 w-auto max-w-full object-contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-xs font-semibold text-ink-400">
            {name}
          </span>
        )}
      </div>

      {/* Name label */}
      <p className="text-xs font-semibold text-ink-600">{name}</p>
    </div>
  );
}