import { NextResponse } from "next/server";
import { clearTokenCookie, fetchLaravel, getToken } from "@/lib/server/auth";

export async function POST() {
  const token = await getToken();

  if (token) {
    // Beritahu Laravel untuk revoke token (best effort).
    await fetchLaravel("/auth/logout", { method: "POST" }, token);
  }

  const response = NextResponse.json({
    success: true,
    message: "Logout berhasil.",
  });

  await clearTokenCookie(response);

  return response;
}