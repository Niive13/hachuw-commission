import { request } from "undici";

interface HttpResponse {
  status: number;
  body: unknown;
}

interface HttpOptions {
  method: string;
  headers?: Record<string, string>;
  body?: string | FormData;
  hostHeader?: string;
}

/**
 * Low-level HTTP request yang mengizinkan custom Host header.
 * Dipakai untuk fetch ke Laravel via localhost (bypass Cloudflare).
 */
export async function httpRequest(
  url: string,
  options: HttpOptions,
): Promise<HttpResponse> {
  const headers: Record<string, string> = {
    ...options.headers,
  };

  // Set custom Host header (mis. api.hachuw.art).
  if (options.hostHeader) {
    headers.host = options.hostHeader;
  }

  let body: string | undefined;
  if (options.body instanceof FormData) {
    // FormData: kirim raw (undici otomatis set content-type boundary).
    // Kita skip body handling di sini — akan di-bypass.
    throw new Error("FormData not supported in httpRequest, use native fetch");
  } else if (typeof options.body === "string") {
    body = options.body;
  }

  const res = await request(url, {
    method: options.method,
    headers,
    body,
  });

  let responseBody: unknown = null;
  try {
    responseBody = await res.body.json();
  } catch {
    // Non-JSON
  }

  return {
    status: res.statusCode,
    body: responseBody,
  };
}