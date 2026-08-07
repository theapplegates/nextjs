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

  // res.cloudinary.com is whitelisted for next/image fallback paths.
  // next-cloudinary needs no config wrapper — only NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in .env.local
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
