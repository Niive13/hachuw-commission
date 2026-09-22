import { NextRequest, NextResponse } from "next/server";
import { fetchLaravel, getToken } from "@/lib/server/auth";

export async function GET() {
  const token = await getToken();
  if (!token) return NextResponse.json({ success: false, message: "Unauthenticated." }, { status: 401 });

  const { status, body } = await fetchLaravel("/admin/catalog", { method: "GET" }, token);
  return NextResponse.json(body, { status });
}

export async function POST(request: NextRequest) {
  const token = await getToken();
  if (!token) return NextResponse.json({ success: false, message: "Unauthenticated." }, { status: 401 });

  // Support JSON dan multipart (kalau ada cover_image).
  const contentType = request.headers.get("content-type") ?? "";

  let body: BodyInit;
  if (contentType.includes("multipart/form-data")) {
    body = await request.formData();
  } else {
    body = await request.text();
  }

  const { status, body: responseBody } = await fetchLaravel(
    "/admin/catalog",
    {
      method: "POST",
      body,
      headers: contentType.includes("multipart/form-data")
        ? {} // biar browser set boundary
        : { "Content-Type": "application/json" },
    },
    token,
  );

  return NextResponse.json(responseBody, { status });
}