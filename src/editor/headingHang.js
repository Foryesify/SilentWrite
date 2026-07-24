import { Decoration, EditorView, ViewPlugin } from '@codemirror/view'
import { Prec, StateEffect } from '@codemirror/state'
import { syntaxTree } from '@codemirror/language'

const ATX_HEADING_RE = /^ATXHeading([1-6])$/

/** Advance hang marks from pre → animated settle. */
const hangTickEffect = StateEffect.define()

const hashMark = Decoration.mark({ class: 'cm-heading-hash' })
/** Instant start pose; next tick swaps to hashMark so CSS transition runs. */
const hashMarkPre = Decoration.mark({
  class: 'cm-heading-hash cm-heading-hash-pre',
})

const lineDecos = Object.fromEntries(
  Array.from({ length: 6 }, (_, i) => {
    const level = i + 1
    return [
      level,
      Decoration.line({
        attributes: { class: `cm-heading-line cm-heading-line-${level}` },
      }),
    ]
  }),
)

const linePreDecos = Object.fromEntries(
  Array.from({ length: 6 }, (_, i) => {
    const level = i + 1
    return [
      level,
      Decoration.line({
        attributes: {
          class: `cm-heading-line cm-heading-line-${level} cm-heading-line-pre`,
        },
      }),
    ]
  }),
)

function findHeaderMark(node) {
  const cursor = node.cursor()
  if (!cursor.firstChild() || cursor.name !== 'HeaderMark') return null
  // Include the space after hashes so title text starts flush
  return { from: cursor.from, to: Math.min(cursor.to + 1, node.to) }
}

function headingAtLine(state, lineFrom) {
  let found = null
  syntaxTree(state).iterate({
    from: lineFrom,
    to: lineFrom + 1,
    enter(node) {
      const match = ATX_HEADING_RE.exec(node.name)
      if (!match) return
      found = { level: Number(match[1]), node: node.node }
      return false
    },
  })
  return found
}

function mapPosSet(set, changes) {
  const next = new Set()
  for (const pos of set) {
    next.add(changes.mapPos(pos, 1))
  }
  return next
}

function buildDecorations(view, settled) {
  const ranges = []
  const present = new Set()
  const priming = []
  const tree = syntaxTree(view.state)

  for (const { from, to } of view.visibleRanges) {
    tree.iterate({
      from,
      to,
      enter(node) {
        const match = ATX_HEADING_RE.exec(node.name)
        if (!match) return

        const level = Number(match[1])
        const lineFrom = view.state.doc.lineAt(node.from).from
        present.add(lineFrom)

        const primed = !settled.has(lineFrom)
        ranges.push((primed ? linePreDecos : lineDecos)[level].range(lineFrom))

        const mark = findHeaderMark(node.node)
        if (mark) {
          ranges.push(
            (primed ? hashMarkPre : hashMark).range(mark.from, mark.to),
          )
        }
        if (primed) priming.push(lineFrom)
        return false
      },
    })
  }

  return {
    decorations: Decoration.set(ranges, true),
    present,
    priming,
  }
}

const headingPlugin = ViewPlugin.fromClass(
  class {
    constructor(view) {
      this.settled = new Set()
      this.raf = 0
      const built = buildDecorations(view, this.settled)
      this.decorations = built.decorations
      this.queuePrime(view, built.priming)
    }

    queuePrime(view, priming) {
      if (!priming.length) return
      if (this.raf) cancelAnimationFrame(this.raf)
      const lines = [...priming]
      // Two frames: paint pre pose, then settle so transition can run
      this.raf = requestAnimationFrame(() => {
        this.raf = requestAnimationFrame(() => {
          this.raf = 0
          if (!view.dom.isConnected) return
          for (const pos of lines) this.settled.add(pos)
          view.dispatch({ effects: hangTickEffect.of(null) })
        })
      })
    }

    update(update) {
      const tick = update.transactions.some((tr) =>
        tr.effects.some((e) => e.is(hangTickEffect)),
      )

      if (update.docChanged) {
        this.settled = mapPosSet(this.settled, update.changes)
      }

      if (update.docChanged || update.viewportChanged || tick) {
        const built = buildDecorations(update.view, this.settled)
        this.decorations = built.decorations

        for (const pos of [...this.settled]) {
          if (!built.present.has(pos)) this.settled.delete(pos)
        }

        if (!tick) this.queuePrime(update.view, built.priming)
      }
    }

    destroy() {
      if (this.raf) cancelAnimationFrame(this.raf)
    }
  },
  { decorations: (v) => v.decorations },
)

/** Map clicks on hung hashes to the correct source positions (still selectable). */
const hashClick = Prec.highest(
  EditorView.domEventHandlers({
    mousedown(event, view) {
      const target = event.target
      if (!(target instanceof Element)) return false
      const hashEl = target.closest('.cm-heading-hash')
      if (!hashEl) return false

      const probeX = hashEl.getBoundingClientRect().right + 2
      const linePos = view.posAtCoords({ x: probeX, y: event.clientY })
      if (linePos === null) return false

      const lineFrom = view.state.doc.lineAt(linePos).from
      const heading = headingAtLine(view.state, lineFrom)
      if (!heading) return false

      const mark = findHeaderMark(heading.node)
      if (!mark) return false

      const rect = hashEl.getBoundingClientRect()
      const t =
        rect.width > 0
          ? Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
          : 0
      const pos = mark.from + Math.round(t * (mark.to - mark.from))

      event.preventDefault()
      if (event.shiftKey) {
        view.dispatch({
          selection: {
            anchor: view.state.selection.main.anchor,
            head: pos,
          },
        })
      } else {
        view.dispatch({ selection: { anchor: pos } })
      }
      view.focus()
      return true
    },
  }),
)

export const headingHang = [headingPlugin, hashClick]
