import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable compression
  compress: true,

  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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

  // Performance optimizations
  poweredByHeader: false,
  reactStrictMode: true,

  // Compiler optimizations
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn'],
          }
        : false,
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Turbopack configuration (Next.js 16 uses Turbopack by default)
  turbopack: {
    resolveAlias: {
      // This helps Turbopack understand the project structure
    },
  },
};

export default nextConfig;
