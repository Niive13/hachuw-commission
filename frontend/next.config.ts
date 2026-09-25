import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Untuk Node.js App di cPanel.
  output: "standalone",

  images: {
    // Disable optimizer — gambar langsung di-serve dari sumbernya.
    // (Solusi karena server tidak bisa fetch ke Cloudflare sendiri.)
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