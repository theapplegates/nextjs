import React from 'react'
import { cn } from '@/lib/utils'

interface CloudinaryPictureProps {
  /** Cloudinary public ID, e.g. "assets/images/foo" or "thumbnails/bar" */
  src: string
  alt: string
  width?: number
  height?: number
  sizes?: string
  breakpoints?: number[]
  /** Set true for the LCP / hero image: eager loading + fetchPriority=high */
  priority?: boolean
  className?: string
  pictureClass?: string
}

export function CloudinaryPicture({
  src,
  alt,
  width,
  height,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  breakpoints,
  priority = false,
  className,
  pictureClass,
}: CloudinaryPictureProps) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

  if (!cloudName) {
    console.error('[CloudinaryPicture] NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not defined')
    return null
  }

  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`

  /**
   * Build a Cloudinary transformation URL.
   * Uses c_limit so we never upscale a smaller source image.
   */
  const makeUrl = (format: string, w?: number): string => {
    const tx: string[] = ['q_auto']
    if (format) tx.push(`f_${format}`)
    if (w) tx.push(`c_limit,w_${w}`)
    return `${baseUrl}/${tx.join(',')}/${src}`
  }

  /** Inline aspect-ratio prevents layout shift even before the image loads. */
  const aspectStyle =
    width && height ? { aspectRatio: `${width} / ${height}` } : undefined

  const loadingAttr = priority ? ('eager' as const) : ('lazy' as const)
  const decodingAttr = priority ? ('auto' as const) : ('async' as const)

  // No breakpoints yet → single Cloudinary f_auto URL (good enough for dev)
  if (!breakpoints || breakpoints.length === 0) {
    return (
      <img
        src={makeUrl('auto')}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        loading={loadingAttr}
        decoding={decodingAttr}
        // @ts-expect-error -- fetchPriority ships in React 18.3+ / @types/react 18.3+
        fetchPriority={priority ? 'high' : 'auto'}
        style={aspectStyle}
        className={cn('w-full h-auto', className)}
      />
    )
  }

  // Sort ascending so srcSet is smallest → largest (some parsers prefer this)
  const sorted = [...breakpoints].sort((a, b) => a - b)
  const largest = sorted[sorted.length - 1]

  /**
   * Width descriptors (e.g. "url 400w") are mandatory for the browser to use
   * the `sizes` attribute when picking a breakpoint. Without them the browser
   * just downloads the largest image every time.
   */
  const buildSrcSet = (format: string): string =>
    sorted.map((w) => `${makeUrl(format, w)} ${w}w`).join(', ')

  return (
    <picture className={cn('block w-full h-auto', pictureClass)}>
      {/*
        Format fallback chain — browser picks the first type it supports:
          1. JXL  — best compression; Safari 17+. Chrome removed its flag.
          2. AVIF — the safe cutting-edge default; Chrome, Firefox, Safari 16+.
          3. WebP — universal among all modern browsers.
          4. <img> fallback for everything else.
      */}
      <source type="image/jxl"  srcSet={buildSrcSet('jxl')}  sizes={sizes} />
      <source type="image/avif" srcSet={buildSrcSet('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={buildSrcSet('webp')} sizes={sizes} />
      <img
        src={makeUrl('webp', largest)}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        loading={loadingAttr}
        decoding={decodingAttr}
        // @ts-expect-error -- fetchPriority ships in React 18.3+ / @types/react 18.3+
        fetchPriority={priority ? 'high' : 'auto'}
        style={aspectStyle}
        className={cn('w-full h-auto object-cover', className)}
      />
    </picture>
  )
}
