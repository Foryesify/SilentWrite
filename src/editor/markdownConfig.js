import { markdown } from '@codemirror/lang-markdown'
import { InlineContext, TaskList } from '@lezer/markdown'

/**
 * Only complete `[text](url)` / `![alt](url)`.
 * Bare `[x]` / `[label]` shortcut refs are left as plain text (lezer would
 * otherwise treat them as links without checking definitions).
 */
const inlineLinksOnly = {
  remove: ['LinkEnd'],
  parseInline: [
    {
      name: 'LinkEnd',
      parse(cx, next, pos) {
        if (next !== 93 /* ] */) return -1

        let image = false
        let index = cx.findOpeningDelimiter(InlineContext.linkStart)
        if (index == null) {
          index = cx.findOpeningDelimiter(InlineContext.imageStart)
          image = true
          if (index == null) return -1
        }

        const opening = cx.getDelimiterAt(index)
        if (!opening) return -1

        // Reject shortcut / reference links: [x], [a][b]
        if (cx.char(pos + 1) !== 40 /* ( */) {
          const inner = cx.takeContent(index)
          for (const child of inner) cx.addElement(child)
          return pos + 1
        }

        const content = cx.takeContent(index)
        content.unshift(cx.elt('LinkMark', opening.from, opening.to))
        content.push(cx.elt('LinkMark', pos, pos + 1))

        const openParen = pos + 1
        let cursor = cx.skipSpace(openParen + 1)
        let url = null

        if (cx.char(cursor) === 60 /* < */) {
          let end = cursor + 1
          while (
            end < cx.end &&
            cx.char(end) !== 62 /* > */ &&
            cx.char(end) !== 10
          ) {
            end++
          }
          if (cx.char(end) === 62) {
            url = cx.elt('URL', cursor, end + 1)
            cursor = end + 1
          }
        } else {
          let end = cursor
          let depth = 0
          let escaped = false
          for (; end < cx.end; end++) {
            const ch = cx.char(end)
            if (ch === 32 || ch === 10) break
            if (escaped) {
              escaped = false
              continue
            }
            if (ch === 92 /* \ */) {
              escaped = true
              continue
            }
            if (ch === 40 /* ( */) depth++
            else if (ch === 41 /* ) */) {
              if (!depth) break
              depth--
            }
          }
          if (end > cursor) url = cx.elt('URL', cursor, end)
          cursor = end
        }

        cursor = cx.skipSpace(cursor)
        if (cx.char(cursor) !== 41 /* ) */) {
          return cx.addElement(
            cx.elt(image ? 'Image' : 'Link', opening.from, pos + 1, content),
          )
        }

        content.push(cx.elt('LinkMark', openParen, openParen + 1))
        if (url) content.push(url)
        content.push(cx.elt('LinkMark', cursor, cursor + 1))
        return cx.addElement(
          cx.elt(image ? 'Image' : 'Link', opening.from, cursor + 1, content),
        )
      },
    },
  ],
}

export const markdownLang = markdown({
  extensions: [TaskList, inlineLinksOnly],
})
