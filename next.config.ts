import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 eslint: {
  ignoreDuringBuilds: true
 },
 typescript: {
  ignoreBuildErrors: true
 },
 images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'clubapi.ariakish.com',
        port: '',
        search: '',
      },
    ],
  },
};

export default nextConfig;
