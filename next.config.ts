import type { NextConfig } from "next";

const {
  NEXT_PUBLIC_API_URL = "http://localhost:3001/",
} = process.env;

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  },
  images: {
    domains: [
      "vertify-public-assets.s3.us-east-2.amazonaws.com",
      "omni-profile-images.s3.us-east-2.amazonaws.com",
      "avatar.vercel.sh",
      "localhost",
    ],
  },
};

export default nextConfig;
