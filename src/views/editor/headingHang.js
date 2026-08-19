import { Decoration, EditorView, ViewPlugin } from '@codemirror/view'
import { EditorState, StateEffect, Transaction } from '@codemirror/state'
import { syntaxTree } from '@codemirror/language'
import { markdown } from '@codemirror/lang-markdown'
import { yamlFrontmatter } from '@codemirror/lang-yaml'
import { frontmatterYamlStyle, highlightStyle } from './highlightStyle'
import { theme } from './theme'

const ATX_HEADING_RE = /^ATXHeading([1-6])$/
const NARROW_QUERY = '(max-width: 700px)'
const hangTickEffect = StateEffect.define()
const hashMark = Decoration.mark({ class: 'cm-heading-hash' })
const lineDecoCache = new Map()

const SAMPLE_DOC = Array.from({ length: 6 }, (_, i) => {
  const hashes = '#'.repeat(i + 1)
  return `${hashes}\n${hashes} x`
}).join('\n')

function hangDisabled() {
  return matchMedia(NARROW_QUERY).matches
}

function findHeaderMark(node) {
  const cursor = node.cursor()
  if (!cursor.firstChild() || cursor.name !== 'HeaderMark') return null
  return { from: cursor.from, to: Math.min(cursor.to + 1, node.to) }
}

function markKey(level, text) {
  return `${level}:${text}`
}

function lineDeco(level, hang) {
  const key = hang ? `${level}:${hang.toFixed(2)}` : `${level}`
  let deco = lineDecoCache.get(key)
  if (!deco) {
    const attributes = {
      class: `cm-heading-line cm-heading-line-${level}`,
    }
    if (hang) attributes.style = `--cm-hang:${hang}px`
    deco = Decoration.line({ attributes })
    lineDecoCache.set(key, deco)
  }
  return deco
}

function hashWidth(view, from, to) {
  const start = view.coordsAtPos(from, 1)
  const end = view.coordsAtPos(to, -1)
  if (!start || !end) return 0
  return Math.max(0, end.left - start.left)
}

function editorFontKey(view) {
  return getComputedStyle(view.contentDOM).font
}

function collectHeadingMarks(view, range) {
  const marks = []
  syntaxTree(view.state).iterate({
    from: range?.from,
    to: range?.to,
    enter(node) {
      const match = ATX_HEADING_RE.exec(node.name)
      if (!match) return
      const level = Number(match[1])
      const mark = findHeaderMark(node.node)
      if (!mark) return false
      marks.push({
        level,
        text: view.state.doc.sliceString(mark.from, mark.to),
        from: mark.from,
        to: mark.to,
        lineFrom: view.state.doc.lineAt(node.from).from,
      })
      return false
    },
  })
  return marks
}

function hashDecorations(view) {
  const ranges = []
  for (const mark of collectHeadingMarks(view)) {
    ranges.push(lineDeco(mark.level).range(mark.lineFrom))
    ranges.push(hashMark.range(mark.from, mark.to))
  }
  return Decoration.set(ranges, true)
}

const probeHashMarks = ViewPlugin.fromClass(
  class {
    constructor(view) {
      this.decorations = hashDecorations(view)
    }

    update(update) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = hashDecorations(update.view)
      }
    }
  },
  { decorations: (v) => v.decorations },
)

function measureViewCache(view) {
  const cache = new Map()
  for (const mark of collectHeadingMarks(view)) {
    const width = hashWidth(view, mark.from, mark.to)
    if (width > 0) cache.set(markKey(mark.level, mark.text), width)
  }
  return cache
}

function warmHangCache(hostView) {
  return new Promise((resolve) => {
    const host = document.createElement('div')
    host.setAttribute('aria-hidden', 'true')
    host.style.cssText =
      'position:absolute;left:0;top:0;width:100%;visibility:hidden;pointer-events:none'
    hostView.scrollDOM.appendChild(host)

    const probe = new EditorView({
      parent: host,
      state: EditorState.create({
        doc: SAMPLE_DOC,
        extensions: [
          EditorView.lineWrapping,
          yamlFrontmatter({ content: markdown() }),
          theme(),
          highlightStyle(),
          frontmatterYamlStyle(),
          probeHashMarks,
        ],
      }),
    })

    let tries = 0
    const job = {
      read: () => measureViewCache(probe),
      write: (cache) => {
        if (cache.size < 6 && tries < 2) {
          tries += 1
          requestAnimationFrame(() => probe.requestMeasure(job))
          return
        }
        probe.destroy()
        host.remove()
        resolve(cache)
      },
    }
    probe.requestMeasure(job)
  })
}

function buildDecorations(view, cache) {
  if (hangDisabled()) return { decorations: Decoration.none, marks: [] }

  const ranges = []
  const marks = []

  for (const visible of view.visibleRanges) {
    for (const mark of collectHeadingMarks(view, visible)) {
      const hang = mark.text
        ? cache.get(markKey(mark.level, mark.text))
        : undefined
      ranges.push(lineDeco(mark.level, hang).range(mark.lineFrom))
      ranges.push(hashMark.range(mark.from, mark.to))
      marks.push(mark)
    }
  }

  return {
    decorations: Decoration.set(ranges, true),
    marks,
  }
}

function dispatchHangTick(view) {
  view.dispatch({
    effects: hangTickEffect.of(null),
    annotations: Transaction.addToHistory.of(false),
  })
}

export const headingHang = () =>
  ViewPlugin.fromClass(
    class {
      constructor(view) {
        this.cache = new Map()
        this.marks = []
        this.cancelled = false
        this.fontKey = editorFontKey(view)
        this.mq = matchMedia(NARROW_QUERY)
        this.onMq = () => {
          if (!view.dom.isConnected) return
          if (!hangDisabled()) this.warm(view)
          dispatchHangTick(view)
        }
        this.mq.addEventListener('change', this.onMq)
        this.measure = {
          read: (v) => this.readHangs(v),
          write: (measured, v) => this.writeHangs(measured, v),
        }
        this.apply(view)
        this.warm(view)
        if (this.needsMeasure()) view.requestMeasure(this.measure)
      }

      apply(view) {
        const built = buildDecorations(view, this.cache)
        this.decorations = built.decorations
        this.marks = built.marks
      }

      needsMeasure() {
        return this.marks.some(
          (mark) => !this.cache.has(markKey(mark.level, mark.text)),
        )
      }

      warm(view) {
        if (this.cancelled || hangDisabled()) return
        warmHangCache(view).then((cache) => {
          if (this.cancelled || !view.dom.isConnected) return
          let changed = false
          for (const [key, width] of cache) {
            const prev = this.cache.get(key)
            if (prev == null || Math.abs(prev - width) > 0.5) {
              this.cache.set(key, width)
              changed = true
            }
          }
          if (changed) dispatchHangTick(view)
        })
      }

      readHangs(view) {
        return this.marks.map((mark) => ({
          key: markKey(mark.level, mark.text),
          width: hashWidth(view, mark.from, mark.to),
        }))
      }

      writeHangs(measured, view) {
        if (!view.dom.isConnected) return
        let changed = false
        for (const { key, width } of measured) {
          if (width <= 0) continue
          const prev = this.cache.get(key)
          if (prev == null || Math.abs(prev - width) > 0.5) {
            this.cache.set(key, width)
            changed = true
          }
        }
        if (changed) dispatchHangTick(view)
      }

      update(update) {
        const tick = update.transactions.some((tr) =>
          tr.effects.some((e) => e.is(hangTickEffect)),
        )
        const fontKey = editorFontKey(update.view)
        if (fontKey !== this.fontKey) {
          this.fontKey = fontKey
          this.cache.clear()
          this.warm(update.view)
        }
        if (
          update.docChanged ||
          update.viewportChanged ||
          update.geometryChanged ||
          tick
        ) {
          this.apply(update.view)
          if (!tick && this.needsMeasure()) {
            update.view.requestMeasure(this.measure)
          }
        }
      }

      destroy() {
        this.cancelled = true
        this.mq.removeEventListener('change', this.onMq)
      }
    },
    { decorations: (v) => v.decorations },
  )
