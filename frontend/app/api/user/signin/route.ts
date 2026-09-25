import { NextRequest, NextResponse } from "next/server";
import { fetchLaravel, setTokenCookie } from "@/lib/server/auth";

export async function POST(request: NextRequest) {
  let payload: { username?: string; password?: string };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const { status, body } = await fetchLaravel("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (status !== 200) {
    return NextResponse.json(body, { status });
  }

  const data = body as { data?: { token?: string } };
  const token = data?.data?.token;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Token tidak ditemukan di response." },
      { status: 500 },
    );
  }

  // Kembalikan response TANPA token (token hanya di HTTP-only cookie).
  const responsePayload = {
    success: true,
    message: "Login berhasil.",
    data: {
      admin: (body as { data?: { admin?: unknown } })?.data?.admin,
    },
  };

  const response = NextResponse.json(responsePayload, { status: 200 });
  await setTokenCookie(response, token);

  return response;
}