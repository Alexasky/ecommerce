import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {protocol: 'https', hostname: 'lh3.googleusercontent.com'},
      {protocol: 'https', hostname: '4elzzrdgw6.ufs.sh'}
    ]
  }
};

export default nextConfig;
