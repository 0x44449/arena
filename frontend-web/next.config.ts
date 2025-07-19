import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/__/auth/:path*',
          destination: `https://arena-538a6.firebaseapp.com/__/auth/:path*`
        }
      ]
    }
  },
};

export default nextConfig;
