import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

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
  const url = `${API_URL}${cleanPath}`;

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...((options.headers as Record<string, string>) ?? {}),
  };

  // Set Content-Type JSON hanya kalau bukan FormData.
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