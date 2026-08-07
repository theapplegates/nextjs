import type { Element, ElementContent, Root, Text } from 'hast'
import type { Parent } from 'unist'
import { visit } from 'unist-util-visit'

const WHITESPACE_REGEX = /^\s*$/

function isImgElement(child: ElementContent): child is Element {
  return child.type === 'element' && child.tagName === 'img'
}

function isPictureElement(child: ElementContent): child is Element {
  return child.type === 'element' && child.tagName === 'picture'
}

function isWhitespaceText(child: ElementContent): child is Text {
  return child.type === 'text' && WHITESPACE_REGEX.test(child.value)
}

/**
 * Check if a paragraph only contains image/picture elements (and optional
 * whitespace text nodes). Handles:
 *   - Single image:   `<p><img /></p>`
 *   - Picture block:  `<p><picture>...</picture></p>`
 *   - Mixed:          `<p><img /><img /></p>`
 *   - With whitespace:`<p> <img /> </p>`
 */
function isImageOnlyParagraph(children: ElementContent[]): boolean {
  if (children.length === 0) return false
  return children.every(
    child => isImgElement(child) || isPictureElement(child) || isWhitespaceText(child),
  )
}

/**
 * Rehype plugin to unwrap images AND picture elements from paragraph wrappers.
 *
 * MDX re-parses the hast output as JSX. A `<picture>` block that lands inside
 * a `<p>` causes:
 *
 *   Unexpected closing tag `</picture>`, expected corresponding closing tag
 *   for `<img>`
 *
 * because JSX treats `<img>` as an open element (void elements need `/>`).
 * Unwrapping `<picture>` from `<p>` eliminates this parse path entirely.
 *
 * @example
 * Before: <p><img src="..." /></p>
 * After:  <img src="..." />
 *
 * Before: <p><picture><source ... /><img ... /></picture></p>
 * After:  <picture><source ... /><img ... /></picture>
 */
export default function rehypeUnwrapImages() {
  return (tree: Root) => {
    visit(
      tree,
      'element',
      (node: Element, index: number | undefined, parent: Parent | undefined) => {
        if (node.tagName !== 'p' || index === undefined || parent === undefined) {
          return
        }

        if (isImageOnlyParagraph(node.children)) {
          // Keep img and picture nodes; discard whitespace text nodes
          const mediaNodes = node.children.filter(
            child => isImgElement(child) || isPictureElement(child),
          )
          parent.children.splice(index, 1, ...mediaNodes)
          return index
        }
      },
    )
  }
}
