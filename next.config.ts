import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ hostname: "*" }],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
