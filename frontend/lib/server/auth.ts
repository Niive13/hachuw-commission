import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { httpRequest } from "./http";

// URL publik (untuk redirect browser, dsb).
const API_URL_PUBLIC = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

// URL internal (untuk fetch server-side, bypass Cloudflare).
const API_URL_INTERNAL = process.env.INTERNAL_API_URL ?? "http://127.0.0.1/api";

// Host header untuk internal request (agar LiteSpeed route ke vhost yang benar).
const API_HOST_HEADER = process.env.INTERNAL_API_HOST ?? "api.hachuw.art";

export const TOKEN_COOKIE = "hachuw_token";

export async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_COOKIE)?.value ?? null;
}

export async function setTokenCookie(
  response: NextResponse,
  token: string,
  maxAgeSeconds = 60 * 60 * 24 * 7,
) {
  response.cookies.set({
    name: TOKEN_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    domain: process.env.NODE_ENV === "production" ? ".hachuw.art" : undefined,
    path: "/",
    maxAge: maxAgeSeconds,
  });
  return response;
}

export async function clearTokenCookie(response: NextResponse) {
  response.cookies.set({
    name: TOKEN_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    domain: process.env.NODE_ENV === "production" ? ".hachuw.art" : undefined,
    path: "/",
    maxAge: 0,
  });
  return response;
}

export async function fetchLaravel(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<{ status: number; body: unknown }> {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${API_URL_INTERNAL}${cleanPath}`;

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...((options.headers as Record<string, string>) ?? {}),
  };

  // Jangan set Content-Type untuk FormData.
  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Kalau body FormData, kita butuh fetch biasa (undici custom Host tidak support FormData).
  // Fallback ke fetch public API URL (via Cloudflare) — untuk upload file.
  if (options.body instanceof FormData) {
    const res = await fetch(`${API_URL_PUBLIC}${cleanPath}`, {
      ...options,
      headers,
      cache: "no-store",
    });

    let body: unknown = null;
    try {
      body = await res.json();
    } catch {}

    return { status: res.status, body };
  }

  // Untuk JSON request, pakai httpRequest (bypass Cloudflare).
  const method = options.method ?? "GET";
  const bodyString = typeof options.body === "string" ? options.body : undefined;

  const res = await httpRequest(url, {
    method,
    headers,
    body: bodyString,
    hostHeader: API_HOST_HEADER,
  });

  return res;
}