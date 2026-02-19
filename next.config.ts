import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable compression
  compress: true,

  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Optimize bundle - tree-shake unused exports from these packages
  experimental: {
    optimizePackageImports: [
      '@tanstack/react-query',
      '@supabase/supabase-js',
      '@supabase/ssr',
      'clsx',
      'tailwind-merge',
    ],
  },

  // Turbopack configuration (Next.js 16 uses Turbopack by default)
  // Set root to avoid workspace root warning
  turbopack: {
    resolveAlias: {
      // This helps Turbopack understand the project structure
    },
  },
};

export default nextConfig;
