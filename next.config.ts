import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/graphood-api/:path*',
        destination: 'https://graphood-5x58.vercel.app/:path*',
      },
    ];
  },
};

export default nextConfig;
