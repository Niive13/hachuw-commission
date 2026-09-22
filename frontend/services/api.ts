const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    status: number,
    errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

interface RequestOptions extends RequestInit {
  // Bisa diperluas nanti (token, dst.)
}

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const url = `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    cache: options.cache ?? "no-store",
  });

  let payload: unknown = null;
  try {
    payload = await res.json();
  } catch {
    // Response bukan JSON
  }

  if (!res.ok) {
    const err = payload as { message?: string; errors?: Record<string, string[]> } | null;
    throw new ApiError(
      err?.message ?? `Request failed with status ${res.status}`,
      res.status,
      err?.errors,
    );
  }

  return payload as T;
}