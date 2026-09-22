import { NextRequest, NextResponse } from "next/server";
import { fetchLaravel, getToken } from "@/lib/server/auth";

export async function PUT(request: NextRequest) {
  const token = await getToken();
  if (!token) return NextResponse.json({ success: false, message: "Unauthenticated." }, { status: 401 });

  const body = await request.text();

  const { status, body: responseBody } = await fetchLaravel(
    "/admin/queue/reorder",
    { method: "PUT", body, headers: { "Content-Type": "application/json" } },
    token,
  );

  return NextResponse.json(responseBody, { status });
}