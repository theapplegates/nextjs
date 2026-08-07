import type { ImageCredit } from '@/types'

interface ImageCreditProps {
  credit: ImageCredit
}

/**
 * Renders a photo attribution line that looks like:
 *
 *   Fishing boats gathered in a harbour at sunrise.
 *   Photo by Philippe BONTEMPS on Unsplash.
 *
 * Drop it inside a <figure> below the hero image.
 * Matches the pattern from the reference Astro site's imageCredit frontmatter.
 */
export function ImageCreditCaption({ credit }: ImageCreditProps) {
  return (
    <figcaption className="mx-auto mt-3 max-w-2xl text-center text-xs leading-relaxed text-muted-foreground">
      {credit.caption && (
        <span>{credit.caption} </span>
      )}
      <span>
        Photo by{' '}
        <a
          href={credit.authorUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground/75 underline underline-offset-2 hover:text-primary transition-colors"
        >
          {credit.author}
        </a>
        {' '}on{' '}
        <a
          href={credit.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground/75 underline underline-offset-2 hover:text-primary transition-colors"
        >
          {credit.source}
        </a>
        .
      </span>
    </figcaption>
  )
}
