/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      const backendUrl = process.env.BACKEND_INTERNAL_URL || 'http://127.0.0.1:8000';
      return [
        {
          source: '/api/v1/:path*',
          destination: `${backendUrl}/api/v1/:path*`,
        },
      ];
    }
    if (process.env.BACKEND_INTERNAL_URL) {
      return [
        {
          source: '/api/v1/:path*',
          destination: `${process.env.BACKEND_INTERNAL_URL}/api/v1/:path*`,
        },
      ];
    }
    return [];
  },
};

module.exports = nextConfig;
