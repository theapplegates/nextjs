/**
 * Generate Cloudinary responsive breakpoints and write them to
 * src/data/cloudinary-breakpoints.json.
 *
 * Usage:
 *   pnpm cloudinary:breakpoints <path-or-public-id> [...]
 *
 * Examples:
 *   pnpm cloudinary:breakpoints src/assets/images/hero.jpg
 *   pnpm cloudinary:breakpoints public/thumbnails/laptop.jpg
 *   pnpm cloudinary:breakpoints assets/images/hero   # existing Cloudinary public ID
 *
 * Required env vars (in .env or .env.local):
 *   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME  (or CLOUDINARY_CLOUD_NAME)
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 *
 * Optional tuning env vars:
 *   CLOUDINARY_BREAKPOINT_BYTES_STEP   default 20000
 *   CLOUDINARY_BREAKPOINT_MIN_WIDTH    default 200
 *   CLOUDINARY_BREAKPOINT_MAX_WIDTH    default 2000
 *   CLOUDINARY_BREAKPOINT_MAX_IMAGES   default 10
 */

import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { basename, dirname, extname, relative, resolve } from 'node:path'
import { v2 as cloudinary } from 'cloudinary'

// ─── Env ─────────────────────────────────────────────────────────────────────

// Support both NEXT_PUBLIC_ prefix (front-end) and plain CLOUDINARY_ prefix
const cloudName =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ??
  process.env.CLOUDINARY_CLOUD_NAME ??
  process.env.PUBLIC_CLOUDINARY_CLOUD_NAME

const apiKey    = process.env.CLOUDINARY_API_KEY
const apiSecret = process.env.CLOUDINARY_API_SECRET

// ─── Args ────────────────────────────────────────────────────────────────────

const imageRefs = process.argv.slice(2).filter(Boolean)

if (!imageRefs.length) {
  console.error(
    'Usage: pnpm cloudinary:breakpoints <cloudinary-public-id-or-local-file> [...]',
  )
  process.exit(1)
}

if (!cloudName || !apiKey || !apiSecret) {
  console.error(
    'Missing Cloudinary credentials. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME (or ' +
    'CLOUDINARY_CLOUD_NAME), CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env.',
  )
  process.exit(1)
}

// ─── Cloudinary config ───────────────────────────────────────────────────────

cloudinary.config({
  cloud_name: cloudName,
  api_key:    apiKey,
  api_secret: apiSecret,
  secure:     true,
})

const breakpointRequest = {
  create_derived: true,
  bytes_step:  Number(process.env.CLOUDINARY_BREAKPOINT_BYTES_STEP  ?? 20_000),
  min_width:   Number(process.env.CLOUDINARY_BREAKPOINT_MIN_WIDTH   ?? 200),
  max_width:   Number(process.env.CLOUDINARY_BREAKPOINT_MAX_WIDTH   ?? 2000),
  max_images:  Number(process.env.CLOUDINARY_BREAKPOINT_MAX_IMAGES  ?? 10),
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const outputPath = resolve('src/data/cloudinary-breakpoints.json')

const readExistingBreakpoints = async () => {
  try {
    return JSON.parse(await readFile(outputPath, 'utf8'))
  } catch (err) {
    if (err?.code === 'ENOENT') return {}
    throw err
  }
}

/**
 * Extract and sort width values from a Cloudinary API response.
 * Sorting ascending is important — the srcSet in CloudinaryPicture iterates
 * in order and browsers expect widths to be reasonable, sorted values.
 */
const getWidths = (result) =>
  result.responsive_breakpoints?.[0]?.breakpoints
    ?.map((bp) => bp.width)
    .filter((w) => Number.isFinite(w))
    .sort((a, b) => a - b)

const isLocalFile = async (imageRef) => {
  try {
    return (await stat(resolve(imageRef))).isFile()
  } catch {
    return false
  }
}

/**
 * Convert a local file path to a Cloudinary public ID.
 *
 * src/assets/images/hero.jpg  → assets/images/hero
 * public/thumbnails/foo.jpg   → thumbnails/foo
 * ./some/other/path/bar.png   → bar  (basename fallback)
 */
const getPublicIdFromPath = (imagePath) => {
  const abs = resolve(imagePath)
  const relToProject = relative(process.cwd(), abs)
  const withoutExt = relToProject.slice(0, -extname(relToProject).length)

  // src/assets/images → assets/images (matches the JSON key convention)
  if (!withoutExt.startsWith('..')) {
    return withoutExt
      .replace(/^src\/assets\/images\//, 'assets/images/')
      .replace(/^public\//, '')   // public/thumbnails/foo → thumbnails/foo
  }

  // Outside project root — just use the basename
  return basename(imagePath, extname(imagePath))
}

// ─── Main ────────────────────────────────────────────────────────────────────

const breakpointsByPublicId = await readExistingBreakpoints()

for (const imageRef of imageRefs) {
  const localFile = await isLocalFile(imageRef)
  const publicId  = localFile ? getPublicIdFromPath(imageRef) : imageRef

  console.log(`\n☁️  Processing: ${publicId}${localFile ? ` (from ${imageRef})` : ''}`)

  const result = localFile
    ? await cloudinary.uploader.upload(resolve(imageRef), {
        public_id:     publicId,
        overwrite:     true,
        resource_type: 'image',
        responsive_breakpoints: [breakpointRequest],
      })
    : await cloudinary.uploader.explicit(publicId, {
        type:          'upload',
        resource_type: 'image',
        responsive_breakpoints: [breakpointRequest],
      })

  const widths = getWidths(result)

  if (!widths?.length) {
    throw new Error(
      `Cloudinary did not return breakpoints for "${imageRef}". ` +
      'Check that the asset exists and your credentials are correct.',
    )
  }

  breakpointsByPublicId[publicId] = widths
  console.log(`📏 Breakpoints: ${widths.join(', ')}`)
}

await mkdir(dirname(outputPath), { recursive: true })
await writeFile(outputPath, `${JSON.stringify(breakpointsByPublicId, null, 2)}\n`)
console.log(`\n💾 Saved to ${outputPath}`)
