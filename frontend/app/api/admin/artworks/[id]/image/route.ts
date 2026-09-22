import { NextRequest, NextResponse } from "next/server";
import { fetchLaravel, getToken } from "@/lib/server/auth";

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const token = await getToken();
  if (!token) return NextResponse.json({ success: false, message: "Unauthenticated." }, { status: 401 });

  const formData = await request.formData();

  const { status, body } = await fetchLaravel(
    `/admin/artworks/${id}/image`,
    { method: "POST", body: formData },
    token,
  );

  return NextResponse.json(body, { status });
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const { id } = await params;
  const token = await getToken();
  if (!token) return NextResponse.json({ success: false, message: "Unauthenticated." }, { status: 401 });

  const { status, body } = await fetchLaravel(
    `/admin/artworks/${id}/image`,
    { method: "DELETE" },
    token,
  );

  return NextResponse.json(body, { status });
}