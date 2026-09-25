import { NextRequest, NextResponse } from "next/server";
import { fetchLaravel, getToken } from "@/lib/server/auth";

interface Params {
  params: Promise<{ id: string }>;
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const { id } = await params;
  const token = await getToken();
  if (!token) return NextResponse.json({ success: false, message: "Unauthenticated." }, { status: 401 });

  const { status, body } = await fetchLaravel(`/admin/portfolio/${id}`, { method: "DELETE" }, token);
  return NextResponse.json(body, { status });
}