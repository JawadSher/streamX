import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    domains: ["images.unsplash.com", "lh3.googleusercontent.com"], 
  },
  experimental: {
    ppr: "incremental",
    serverActions: {
      allowedOrigins: ['*'],
    },
  },
};

export default nextConfig;
