/**
 * Fetch wrapper untuk komunikasi ke BFF Next.js.
 * Cookie HTTP-only otomatis terkirim (same-origin).
 */

export class BffError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = "BffError";
    this.status = status;
    this.errors = errors;
  }
}

interface BffOptions extends RequestInit {
  // Kosong, extend nanti kalau perlu.
}

export async function bffFetch<T>(
  path: string,
  options: BffOptions = {},
): Promise<T> {
  const url = path.startsWith("/") ? path : `/${path}`;

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...((options.headers as Record<string, string>) ?? {}),
  };

  // Set Content-Type JSON hanya kalau body bukan FormData.
  if (!(options.body instanceof FormData) && options.body !== undefined && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: "same-origin",
  });

  let payload: unknown = null;
  try {
    payload = await res.json();
  } catch {
    // Non-JSON
  }

  if (!res.ok) {
    const err = payload as { message?: string; errors?: Record<string, string[]> } | null;
    throw new BffError(
      err?.message ?? `Request failed with status ${res.status}`,
      res.status,
      err?.errors,
    );
  }

  return payload as T;
}