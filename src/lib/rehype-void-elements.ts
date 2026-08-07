import type { Element, Root } from 'hast'
import { visit } from 'unist-util-visit'

/**
 * HTML void elements — elements that must not have a closing tag.
 * In JSX / MDX they MUST be self-closed: `<img />`, `<source />`, etc.
 * Without the trailing slash, the MDX compiler throws:
 *
 *   Unexpected closing tag `</picture>`, expected corresponding closing
 *   tag for `<img>`
 *
 * This plugin sets `selfClosing: true` on every void element in the hast
 * tree so that downstream serialisers (hast-util-to-jsx-runtime and
 * next-mdx-remote) always emit `<img ... />` rather than `<img ...>`.
 */
const VOID_ELEMENTS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
])

export default function rehypeVoidElements() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (VOID_ELEMENTS.has(node.tagName)) {
        // hast-util-to-html / hast-util-to-jsx-runtime respect this flag
        // and will emit a self-closing slash.
        // @ts-expect-error -- `selfClosing` is not in @types/hast but is
        // respected by hast serialisers
        node.selfClosing = true
      }
    })
  }
}
