import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['three'],
  turbopack: {},
  output: 'standalone',
};

export default nextConfig;
