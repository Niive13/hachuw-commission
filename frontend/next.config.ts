import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Untuk Node.js App di cPanel.
  output: "standalone",

  images: {
    remotePatterns: [
      // Development local
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
      // Production
      {
        protocol: "https",
        hostname: "api.hachuw.art",
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;