import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import { withNextCloudinary } from 'next-cloudinary/config'

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

export default withNextCloudinary(withNextIntl(nextConfig))
