import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  output: 'standalone',
  allowedDevOrigins: ['*.manus.computer'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  async rewrites() {
    const backendUrl = process.env.INTERNAL_API_URL || 'http://backend:8080';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: '/oauth2/:path*',
        destination: `${backendUrl}/oauth2/:path*`,
      },
      {
        source: '/login/oauth2/:path*',
        destination: `${backendUrl}/login/oauth2/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
