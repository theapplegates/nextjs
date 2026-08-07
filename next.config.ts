import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: ['next-mdx-remote'],

  // Turbopack: pin the project root so that a stray lockfile in a parent
  // directory does not confuse Turbopack's workspace-root detection.
  turbopack: {
    root: process.cwd(),
  },

  // Allow next/image to serve optimised versions of Cloudinary URLs in
  // the Next.js Image fallback branch of PostImage.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
}

export default withNextIntl(nextConfig)
