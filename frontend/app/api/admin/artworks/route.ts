import { NextResponse } from "next/server";
import { fetchLaravel, getToken } from "@/lib/server/auth";

export async function GET() {
  const token = await getToken();
  if (!token) return NextResponse.json({ success: false, message: "Unauthenticated." }, { status: 401 });

  const { status, body } = await fetchLaravel("/admin/artworks", { method: "GET" }, token);
  return NextResponse.json(body, { status });
}