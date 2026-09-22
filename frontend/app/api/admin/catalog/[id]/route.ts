import { NextRequest, NextResponse } from "next/server";
import { fetchLaravel, getToken } from "@/lib/server/auth";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_: NextRequest, { params }: Params) {
  const { id } = await params;
  const token = await getToken();
  if (!token) return NextResponse.json({ success: false, message: "Unauthenticated." }, { status: 401 });

  const { status, body } = await fetchLaravel(`/admin/catalog/${id}`, { method: "GET" }, token);
  return NextResponse.json(body, { status });
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const token = await getToken();
  if (!token) return NextResponse.json({ success: false, message: "Unauthenticated." }, { status: 401 });

  const contentType = request.headers.get("content-type") ?? "";

  // Kalau multipart (ada cover upload), pakai method spoofing.
  // Kalau JSON, kirim PUT langsung.
  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    formData.append("_method", "PUT");

    const { status, body } = await fetchLaravel(
      `/admin/catalog/${id}`,
      { method: "POST", body: formData },
      token,
    );
    return NextResponse.json(body, { status });
  }

  // JSON PUT — kirim apa adanya.
  const body = await request.text();

  const { status, body: responseBody } = await fetchLaravel(
    `/admin/catalog/${id}`,
    {
      method: "PUT",
      body,
      headers: { "Content-Type": "application/json" },
    },
    token,
  );

  return NextResponse.json(responseBody, { status });
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const { id } = await params;
  const token = await getToken();
  if (!token) return NextResponse.json({ success: false, message: "Unauthenticated." }, { status: 401 });

  const { status, body } = await fetchLaravel(`/admin/catalog/${id}`, { method: "DELETE" }, token);
  return NextResponse.json(body, { status });
}