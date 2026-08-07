'use client'

import { CldImage } from 'next-cloudinary'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface MDXImageProps {
  src?: string
  alt?: string
  title?: string
  className?: string
  width?: number
  height?: number
}

/**
 * Renders images inside MDX content.
 *
 * Uses CldImage for Cloudinary-hosted images (res.cloudinary.com URLs or
 * public-ID-like paths) and Next.js Image for everything else.
 *
 * CldImage never emits raw <picture>/<img> HTML — it renders as a React
 * component — so the MDX JSX compiler never chokes on unclosed void tags.
 */
function isCloudinaryPath(src: string): boolean {
  // Already a full Cloudinary URL
  if (src.includes('res.cloudinary.com')) return true
  // Local path that maps to a public ID (no protocol, not a data URI)
  if (!src.startsWith('http') && !src.startsWith('data:')) return true
  return false
}

function localPathToPublicId(src: string): string {
  return src
    .replace(/^\/+/, '')
    .replace(/^public\//, '')
    .replace(/\.[^/.]+$/, '')
    .replace(/\/+/g, '/')
}

export function MDXImage({ src, alt = 'Image', title, className, width, height }: MDXImageProps) {
  if (!src) return null

  const imageNode = isCloudinaryPath(src)
    ? (
        <CldImage
          src={localPathToPublicId(src)}
          alt={alt}
          width={width ?? 1200}
          height={height ?? 675}
          sizes="(max-width: 768px) 100vw, 768px"
          className={cn('h-auto w-full object-contain', className)}
        />
      )
    : (
        <Image
          src={src}
          alt={alt}
          width={width ?? 1200}
          height={height ?? 675}
          className={cn('h-auto w-full object-contain', className)}
          unoptimized
        />
      )

  return (
    <figure className="prose-img:m-0 text-center">
      {imageNode}
      {title !== undefined && title !== '' && (
        <figcaption data-testid="mdx-image-title" className="line-clamp-3">
          {title}
        </figcaption>
      )}
    </figure>
  )
}
