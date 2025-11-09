import type { NextConfig } from 'next';
import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin';
import webpack from 'webpack';

// Next.js configuration with styled-components support
const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }
    config.plugins.push(
      new webpack.IgnorePlugin({ resourceRegExp: /^zlib-sync$/ }),
      new webpack.IgnorePlugin({ resourceRegExp: /^bufferutil$/ })
    );
    return config;
  }
};

export default nextConfig;
