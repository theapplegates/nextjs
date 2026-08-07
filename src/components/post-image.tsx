'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { CldImage } from 'next-cloudinary'
import { DotPattern } from '@/components/ui/dot-pattern'
import { cn } from '@/lib/utils'

/**
 * Strip a local file path down to a Cloudinary public ID.
 *
 * /thumbnails/foo.jpg        → thumbnails/foo
 * public/thumbnails/foo.jpg  → thumbnails/foo
 * assets/images/bar.png      → assets/images/bar
 */
function localPathToPublicId(src: string): string | null {
  const clean = src
    .replace(/^\/+/, '')
    .replace(/^public\//, '')
    .replace(/\.[^/.]+$/, '')
    .replace(/\/+/g, '/')
  return clean || null
}

interface PostImageProps {
  src?: string
  alt: string
  width?: number
  height?: number
  placeholder?: string
  sizes?: string
  loading?: 'lazy' | 'eager'
  /** Set true for the LCP / hero image: eager loading + fetchPriority=high */
  priority?: boolean
  unoptimized?: boolean
  hoverScale?: boolean
  className?: string
  /** @deprecated — no longer used; kept for API compat */
  pictureClass?: string
}

export function PostImage({
  src,
  alt,
  width,
  height,
  placeholder,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  loading = 'lazy',
  priority = false,
  unoptimized = false,
  hoverScale = false,
  className,
}: PostImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    setLoaded(false)
    setError(false)
  }, [src])

  // 1. No source → placeholder
  if (!src || src === '') {
    return (
      <div className={cn('relative flex h-full w-full items-center justify-center bg-muted', className)}>
        {placeholder && <span className="text-sm text-muted-foreground">{placeholder}</span>}
      </div>
    )
  }

  // 2. Derive Cloudinary public ID.
  //    CldImage handles all URL-building, format selection, and srcSet — no
  //    raw <picture> HTML is ever emitted so MDX parse errors cannot occur.
  const publicId = localPathToPublicId(src)

  if (publicId) {
    return (
      <CldImage
        src={publicId}
        alt={alt}
        width={width ?? 1600}
        height={height ?? 900}
        sizes={sizes}
        priority={priority}
        className={cn(
          'w-full object-cover transition-transform duration-300',
          hoverScale && 'group-hover:scale-105',
          className,
        )}
      />
    )
  }

  // 3. Fallback: standard Next.js Image for paths that can't map to Cloudinary.
  return (
    <>
      {!loaded && (
        <>
          <DotPattern
            width={20}
            height={20}
            cx={1}
            cy={1}
            cr={1}
            className={cn(
              'fill-muted-foreground/20 transition-transform duration-300',
              hoverScale && 'group-hover:scale-105',
            )}
          />
          {placeholder !== undefined && placeholder !== '' && (
            <span className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
              {placeholder}
            </span>
          )}
        </>
      )}
      {!error && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          loading={priority ? 'eager' : loading}
          priority={priority}
          unoptimized={unoptimized}
          className={cn(
            'object-cover transition-transform duration-300',
            hoverScale && 'group-hover:scale-105',
            className,
          )}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
    </>
  )
}
