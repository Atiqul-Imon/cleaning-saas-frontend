import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable compression
  compress: true,

  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Optimize bundle
  experimental: {
    optimizePackageImports: [
      '@tanstack/react-query',
      '@supabase/supabase-js',
    ],
  },
};

export default nextConfig;
