import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Required by the Dockerfile: Cloud Run runs the standalone server.js.
  output: 'standalone',
};

export default nextConfig;
