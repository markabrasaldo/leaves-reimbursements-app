/** @type {import('next').NextConfig} */
const nextConfig = {
  publicRuntimeConfig: {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'api.slingacademy.com',
        port: ''
      }
    ]
  },
  transpilePackages: ['geist']
};

module.exports = nextConfig;
