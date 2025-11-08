import type { NextConfig } from 'next';

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
      // Dynamically import the Prisma plugin to avoid TypeScript issues
      const {
        PrismaPlugin
      } = require('@prisma/nextjs-monorepo-workaround-plugin');
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }
    return config;
  }
};

export default nextConfig;
