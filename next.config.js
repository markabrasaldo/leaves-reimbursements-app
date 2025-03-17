/** @type {import('next').NextConfig} */
const nextConfig = {
  publicRuntimeConfig: {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    baseUrlIam: process.env.NEXT_PUBLIC_BASE_URL_IAM || 'http://localhost:3000',
    baseUrlLeave:
      process.env.NEXT_PUBLIC_BASE_URL_LEAVE || 'http://localhost:3000',
    baseUrlDashboard:
      process.env.NEXT_PUBLIC_BASE_URL_DASHBOARD || 'http://localhost:3000',
    baseUrlReimbursement:
      process.env.NEXT_PUBLIC_BASE_URL_REIMBURSEMENT || 'http://localhost:3000'
  },
  env: {
    DASHBOARD_URL: process.env.NEXT_PUBLIC_BASE_URL_DASHBOARD,
    LEAVES_URL: process.env.NEXT_PUBLIC_BASE_URL_LEAVE,
    REIMBURSEMENT_URL: process.env.NEXT_PUBLIC_BASE_URL_REIMBURSEMENT
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
