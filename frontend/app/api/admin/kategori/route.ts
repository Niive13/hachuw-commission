import { NextRequest, NextResponse } from "next/server";
import { fetchLaravel, getToken } from "@/lib/server/auth";

export async function GET() {
  const token = await getToken();
  if (!token) return NextResponse.json({ success: false, message: "Unauthenticated." }, { status: 401 });

  const { status, body } = await fetchLaravel("/admin/kategori", { method: "GET" }, token);
  return NextResponse.json(body, { status });
}

export async function POST(request: NextRequest) {
  const token = await getToken();
  if (!token) return NextResponse.json({ success: false, message: "Unauthenticated." }, { status: 401 });

  const body = await request.text();

  const { status, body: responseBody } = await fetchLaravel(
    "/admin/kategori",
    { method: "POST", body, headers: { "Content-Type": "application/json" } },
    token,
  );

  return NextResponse.json(responseBody, { status });
}