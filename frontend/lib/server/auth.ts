import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";
export const TOKEN_COOKIE = "hachuw_token";

/**
 * Ambil token dari HTTP-only cookie (server-side).
 */
export async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_COOKIE)?.value ?? null;
}

/**
 * Set HTTP-only cookie berisi token.
 */
export async function setTokenCookie(response: NextResponse, token: string, maxAgeSeconds = 60 * 60 * 24 * 7) {
  response.cookies.set({
    name: TOKEN_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/",
    maxAge: maxAgeSeconds,
  });
  return response;
}

/**
 * Hapus cookie token.
 */
export async function clearTokenCookie(response: NextResponse) {
  response.cookies.set({
    name: TOKEN_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}

/**
 * Fetch ke Laravel API dengan Authorization Bearer.
 * Otomatis return response status & body.
 */
export async function fetchLaravel(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<{ status: number; body: unknown }> {
  const url = `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...((options.headers as Record<string, string>) ?? {}),
  };

  // Jangan set Content-Type kalau body FormData (biar boundary auto).
  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers,
    cache: "no-store",
  });

  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    // Non-JSON response
  }

  return { status: res.status, body };
}