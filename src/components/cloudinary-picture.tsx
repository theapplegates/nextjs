'use client'

/**
 * CloudinaryPicture — thin wrapper around CldImage from next-cloudinary.
 *
 * next-cloudinary handles everything internally:
 *   - f_auto / q_auto transformations
 *   - Responsive srcSet generation
 *   - Format negotiation (AVIF, WebP)
 *   - Never emits raw <picture>/<img> HTML into MDX, so no JSX parse errors
 *
 * Usage:
 *   <CloudinaryPicture src="thumbnails/my-photo" alt="..." width={1200} height={630} />
 */
export { CldImage as CloudinaryPicture } from 'next-cloudinary'
