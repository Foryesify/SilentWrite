import {
  EditorView,
  drawSelection,
  highlightActiveLine,
} from '@codemirror/view'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags } from '@lezer/highlight'
import { headingHang } from './headingHang'

/**
 * iA Writer–inspired Markdown look for CodeMirror 6.
 * Source stays editable; syntax markers share the style of their content.
 */
const editorChrome = EditorView.theme({
  '&': {
    height: '100%',
    fontSize: '1.125rem',
    color: 'var(--cm-fg)',
    backgroundColor: 'transparent',
  },
  '&.cm-focused': {
    outline: 'none',
  },
  '.cm-scroller': {
    fontFamily: 'var(--cm-font)',
    lineHeight: '1.75',
    fontWeight: '400',
    overflow: 'auto',
  },
  // Editor fills the screen; only the text column is width-constrained
  '.cm-content': {
    width: '90%',
    maxWidth: '800px',
    marginLeft: 'auto',
    marginRight: 'auto',
    boxSizing: 'border-box',
    padding: '2.5rem 0.5rem 45vh',
    paddingLeft: 'var(--cm-hash-gutter)',
    caretColor: 'transparent',
    fontFamily: 'inherit',
  },
  '.cm-line': {
    padding: '0',
    position: 'relative',
    opacity: 'var(--cm-line-dim)',
    transition: 'opacity var(--cm-focus-fade) var(--cm-ease)',
  },

  // Focus mode — only the active line stays full strength
  '.cm-activeLine': {
    opacity: '1',
    backgroundColor: 'transparent',
  },

  // Cursor — drawSelection reuses DOM nodes so left/top transitions animate moves
  '.cm-cursor, .cm-dropCursor': {
    borderLeftColor: 'var(--cm-caret)',
    borderLeftWidth: '2px',
    marginLeft: '-1px',
    transition:
      'left var(--cm-cursor-move) var(--cm-ease), top var(--cm-cursor-move) var(--cm-ease), height var(--cm-cursor-move) var(--cm-ease)',
    willChange: 'left, top',
  },
  // Smooth fade blink (override CM's steps(1) hard blink)
  '&.cm-focused > .cm-scroller > .cm-cursorLayer': {
    animation: 'cm-blink var(--cm-cursor-blink) ease-in-out infinite',
  },
  '@keyframes cm-blink': {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0 },
  },
  '@keyframes cm-blink2': {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0 },
  },

  // Selection — animate box geometry when the layer reuses elements
  '.cm-selectionBackground': {
    backgroundColor: 'var(--cm-selection) !important',
    transition:
      'left var(--cm-selection-move) var(--cm-ease), top var(--cm-selection-move) var(--cm-ease), width var(--cm-selection-move) var(--cm-ease), height var(--cm-selection-move) var(--cm-ease), background-color 160ms var(--cm-ease)',
  },
  '&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground': {
    backgroundColor: 'var(--cm-selection) !important',
  },
  '.cm-selectionLayer': {
    transition: 'opacity 120ms var(--cm-ease)',
  },
  '&.cm-focused ::selection': {
    backgroundColor: 'transparent',
  },
  '::selection': {
    backgroundColor: 'transparent',
  },

  '.cm-gutters': {
    display: 'none',
  },
  '.cm-placeholder': {
    color: 'var(--cm-placeholder)',
    fontStyle: 'italic',
  },
  '.cm-matchingBracket, &.cm-focused .cm-matchingBracket': {
    backgroundColor: 'transparent',
    outline: 'none',
  },

  // Hung ATX markers — out of flow so only `#` shifts; title stays flush with body
  '.cm-heading-line': {
    position: 'relative',
    paddingLeft: '0',
    transition: 'padding-left var(--cm-hang-duration) var(--cm-ease)',
  },
  // Start pose: title still indented as if `#` were in flow
  '.cm-heading-line-pre': {
    paddingLeft: '1.6em',
    transition: 'none',
  },
  '.cm-heading-hash': {
    position: 'absolute',
    right: '100%',
    top: '0',
    paddingRight: '0.4em',
    whiteSpace: 'pre',
    pointerEvents: 'auto',
    boxSizing: 'border-box',
    // Keep marker at editor size so "######" fits the gutter (title stays large)
    fontSize: '1em !important',
    fontWeight: '700',
    lineHeight: 'inherit',
    color: 'var(--cm-heading)',
    transform: 'translateX(0)',
    opacity: '1',
    transition:
      'transform var(--cm-hang-duration) var(--cm-ease), opacity var(--cm-hang-duration) var(--cm-ease)',
  },
  // Start pose: `#` sits where in-flow text begins, then transitions into the gutter
  '.cm-heading-hash-pre': {
    transform: 'translateX(100%)',
    opacity: '0.4',
    transition: 'none',
  },
  '.cm-heading-line-6 .cm-heading-hash': {
    color: 'var(--cm-muted)',
    fontWeight: '600',
  },
})

const markdownHighlightStyle = HighlightStyle.define([
  // Headings — size/weight hierarchy (applies to `#` marks via ATXHeading/... tags)
  {
    tag: tags.heading1,
    fontSize: '1.85em',
    fontWeight: '700',
    lineHeight: '1.3',
    color: 'var(--cm-heading)',
  },
  {
    tag: tags.heading2,
    fontSize: '1.5em',
    fontWeight: '700',
    lineHeight: '1.35',
    color: 'var(--cm-heading)',
  },
  {
    tag: tags.heading3,
    fontSize: '1.3em',
    fontWeight: '600',
    lineHeight: '1.4',
    color: 'var(--cm-heading)',
  },
  {
    tag: tags.heading4,
    fontSize: '1.15em',
    fontWeight: '600',
    lineHeight: '1.45',
    color: 'var(--cm-heading)',
  },
  {
    tag: tags.heading5,
    fontSize: '1.05em',
    fontWeight: '600',
    color: 'var(--cm-heading)',
  },
  {
    tag: tags.heading6,
    fontSize: '1em',
    fontWeight: '600',
    color: 'var(--cm-muted)',
  },

  // Inline — markers share these via StrongEmphasis/... / Emphasis/... tags
  { tag: tags.emphasis, fontStyle: 'italic' },
  { tag: tags.strong, fontWeight: '700' },
  {
    tag: tags.strikethrough,
    textDecoration: 'line-through',
  },

  // Links — markers + label share link style
  {
    tag: tags.link,
    color: 'var(--cm-link)',
    textDecoration: 'underline',
    textUnderlineOffset: '0.18em',
    textDecorationColor: 'var(--cm-link-underline)',
  },
  {
    tag: tags.url,
    color: 'var(--cm-link)',
    textDecoration: 'underline',
    textUnderlineOffset: '0.18em',
    textDecorationColor: 'var(--cm-link-underline)',
  },
  { tag: tags.monospace, fontFamily: 'var(--cm-mono)', fontSize: '0.92em' },

  // Quotes
  { tag: tags.quote, color: 'var(--cm-muted)', fontStyle: 'italic' },
  { tag: tags.contentSeparator, color: 'var(--cm-muted)' },

  // Do not fade processingInstruction/meta — markers keep parent text style
  { tag: tags.escape, color: 'var(--cm-muted)' },
  { tag: tags.comment, color: 'var(--cm-muted)', fontStyle: 'italic' },
  { tag: tags.documentMeta, color: 'var(--cm-muted)' },

  // Frontmatter / HTML leftovers
  { tag: tags.tagName, color: 'var(--cm-muted)' },
  { tag: tags.attributeName, color: 'var(--cm-muted)' },
  { tag: tags.attributeValue, color: 'var(--cm-link)' },
  { tag: tags.keyword, color: 'var(--cm-muted)' },
  { tag: tags.string, color: 'var(--cm-fg)' },
  { tag: tags.atom, color: 'var(--cm-muted)' },
  { tag: tags.bool, color: 'var(--cm-muted)' },
  { tag: tags.number, color: 'var(--cm-muted)' },
])

export const markdownTheme = [
  drawSelection({ cursorBlinkRate: 1050 }),
  highlightActiveLine(),
  editorChrome,
  syntaxHighlighting(markdownHighlightStyle),
  ...headingHang,
]
