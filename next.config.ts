// next.config.ts

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'i.imgur.com',
      'images.unsplash.com',
      'firebasestorage.googleapis.com',
      'res.cloudinary.com',
    ],
  },
  reactStrictMode: true,
  typedRoutes: true,
};

export default nextConfig;