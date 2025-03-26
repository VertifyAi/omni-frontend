/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['vertify-public-assets.s3.us-east-2.amazonaws.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/integrations/:path*',
        destination: 'http://localhost:3001/integrations/:path*',
      },
    ];
  },
}

module.exports = nextConfig 