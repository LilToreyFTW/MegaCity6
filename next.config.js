/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export for Vercel deployment to enable API routes
  // output: 'export',
  // trailingSlash: true,
  images: {
    unoptimized: true
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  basePath: process.env.NODE_ENV === 'production' ? '' : ''
}

module.exports = nextConfig
