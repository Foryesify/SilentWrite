import { Decoration, EditorView, ViewPlugin } from '@codemirror/view'
import { EditorSelection, StateEffect } from '@codemirror/state'
import { syntaxTree } from '@codemirror/language'

const ATX_HEADING_RE = /^ATXHeading([1-6])$/
const NARROW_QUERY = '(max-width: 700px)'

function hangDisabled() {
  return matchMedia(NARROW_QUERY).matches
}

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

function buildDecorations(view, settled, forceSettled = false) {
  if (hangDisabled()) {
    return {
      decorations: Decoration.none,
      present: new Set(),
      priming: [],
    }
  }

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

        const primed = !forceSettled && !settled.has(lineFrom)
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

function resolveHashMark(view, hashEl, clientY) {
  const probeX = hashEl.getBoundingClientRect().right + 2
  const linePos = view.posAtCoords({ x: probeX, y: clientY })
  if (linePos == null) return null
  const lineFrom = view.state.doc.lineAt(linePos).from
  const heading = headingAtLine(view.state, lineFrom)
  if (!heading) return null
  return findHeaderMark(heading.node)
}

function posInHashEl(event, hashEl, mark) {
  const rect = hashEl.getBoundingClientRect()
  const t =
    rect.width > 0
      ? Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
      : 0
  return mark.from + Math.round(t * (mark.to - mark.from))
}

function posFromPointer(view, event) {
  const target = event.target
  if (target instanceof Element) {
    const hashEl = target.closest('.cm-heading-hash')
    if (hashEl) {
      const mark = resolveHashMark(view, hashEl, event.clientY)
      if (mark) return posInHashEl(event, hashEl, mark)
    }
  }
  return view.posAtCoords({ x: event.clientX, y: event.clientY })
}

function hashMouseSelection(view, event) {
  if (hangDisabled()) return null
  if (event.button !== 0) return null
  if (!(event.target instanceof Element)) return null
  const hashEl = event.target.closest('.cm-heading-hash')
  if (!hashEl) return null

  const mark = resolveHashMark(view, hashEl, event.clientY)
  if (!mark) return null

  let startPos = posInHashEl(event, hashEl, mark)
  let startSel = view.state.selection

  return {
    update(update) {
      if (update.docChanged) {
        startPos = update.changes.mapPos(startPos)
        startSel = startSel.map(update.changes)
      }
    },
    get(curEvent, extend, multiple) {
      let curPos = posFromPointer(view, curEvent)
      if (curPos == null) curPos = startPos

      const range =
        startPos === curPos
          ? EditorSelection.cursor(startPos)
          : EditorSelection.range(startPos, curPos)

      if (extend) {
        return startSel.replaceRange(
          startSel.main.extend(range.from, range.to, range.assoc),
        )
      }
      if (multiple) return startSel.addRange(range)
      return EditorSelection.create([range])
    },
  }
}

export const headingHang = () =>
  ViewPlugin.fromClass(
    class {
      constructor(view) {
        this.settled = new Set()
        this.raf = 0
        this.mq = matchMedia(NARROW_QUERY)
        this.forceSettled = false
        this.onMq = () => {
          if (!view.dom.isConnected) return
          this.forceSettled = !hangDisabled()
          view.dispatch({ effects: hangTickEffect.of(null) })
        }
        this.mq.addEventListener('change', this.onMq)
        const built = buildDecorations(view, this.settled)
        this.decorations = built.decorations
        this.queuePrime(view, built.priming)
      }

      queuePrime(view, priming) {
        if (!priming.length) return
        if (this.raf) cancelAnimationFrame(this.raf)
        const lines = [...priming]
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
          const forceSettled = this.forceSettled
          this.forceSettled = false
          const built = buildDecorations(
            update.view,
            this.settled,
            forceSettled,
          )
          this.decorations = built.decorations

          if (forceSettled) {
            for (const pos of built.present) this.settled.add(pos)
          }
          for (const pos of [...this.settled]) {
            if (!built.present.has(pos)) this.settled.delete(pos)
          }

          this.queuePrime(update.view, built.priming)
        }
      }

      destroy() {
        this.mq.removeEventListener('change', this.onMq)
        if (this.raf) cancelAnimationFrame(this.raf)
      }
    },
    {
      decorations: (v) => v.decorations,
      provide: () => EditorView.mouseSelectionStyle.of(hashMouseSelection),
    },
  )
