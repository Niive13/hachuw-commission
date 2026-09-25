import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone TIDAK dipakai di Vercel (Vercel auto-handle).
  // Jadi kita hapus `output: "standalone"`.

  images: {
    // Disable optimizer karena kita pakai gambar dari API lain.
    unoptimized: true,

    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/storage/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "api.hachuw.art",
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;