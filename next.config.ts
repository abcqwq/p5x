import type { NextConfig } from 'next';
import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin';

// Next.js configuration with styled-components support
const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client']
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }
    return config;
  }
};

export default nextConfig;
