import { EditorView } from "@codemirror/view"

const isTouch = matchMedia('(pointer: coarse)').matches

const cmVars = {
  '--cm-font': "system-ui, sans-serif",
  '--cm-mono': "monospace",
  '--cm-fg': '#222',
  '--cm-heading': '#141414',
  '--cm-muted': '#aaa',
  '--cm-selection': '#e9e9e9',
  '--cm-caret': '#222',
  '--cm-placeholder': '#444',
  '--cm-hash-gutter': '40px',
}

const cmVarsDark = {
  '--cm-fg': '#e8e8e8',
  '--cm-heading': '#f2f2f2',
  '--cm-muted': 'rgba(232, 232, 232, 0.52)',
  '--cm-selection': '#555',
  '--cm-caret': '#f2f2f2',
  '--cm-placeholder': 'rgba(232, 232, 232, 0.34)',
}

export const theme = () => EditorView.theme({
  // Editor
  '&': {
    outline: 'none !important',
    height: '100%'
  },
  '.cm-scroller': {
    ...cmVars,
    fontSize: '1.2em',
    color: 'var(--cm-fg)',
    fontFamily: 'var(--cm-font)',
    fontWeight: '400',
    justifyContent: 'center',
  },
  '@media (prefers-color-scheme: dark)': {
    '.cm-scroller': cmVarsDark,
  },
  '.cm-content': {
    maxWidth: 'min(36em, 80vw)',
    flex: '1 1 auto',
    padding: '0 var(--cm-hash-gutter)',
  },
  '@media (max-width: 700px)': {
    '.cm-scroller': {
      '--cm-hash-gutter': '0',
    },
    '.cm-content': {
      'maxWidth': '95vw',
    }
  },

  // Line
  '.cm-line': {
    padding: '0',
    position: 'relative',
    opacity: '0.5',
    transition: 'opacity 0.1s ease-out',
  },
  '.cm-activeLine': {
    opacity: '1',
    backgroundColor: 'transparent',
  },

  // Cursor
  '.cm-cursor, .cm-dropCursor': {
    borderLeft: '2px solid var(--cm-caret)',
    transition: isTouch ? 'none' : 'all 0.08s ease-out',
  },
  '&.cm-focused > .cm-scroller > .cm-cursorLayer': {
    animation: 'cm-blink 1s ease-in-out infinite',
  },
  '@keyframes cm-blink': {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0 },
  },

  // Selection
  '.cm-selectionBackground': {
    backgroundColor: 'var(--cm-selection) !important',
    transition: `all 0.1s ease-out`,
  },
  // iOS Safari still paints native contenteditable selection
  // on top of drawSelection; Chromium honors transparent ::selection.
  '.cm-line::selection, .cm-line ::selection': {
    backgroundColor: 'transparent !important',
    color: 'inherit !important',
  },
  '.cm-content::selection, .cm-content ::selection': {
    backgroundColor: 'transparent !important',
    color: 'inherit !important',
  },

  // Heading hang: hashes stay in flow; text-indent pulls them into the gutter.
  '.cm-heading-line': {
    textIndent: 'calc(-1 * var(--cm-hang, 0px))',
  },
  '.cm-heading-hash': {
    whiteSpace: 'pre',
    fontSize: '1em !important',
    fontWeight: '400',
    color: 'var(--cm-heading)',
  },
  '.cm-heading-line-6 .cm-heading-hash': {
    color: 'var(--cm-muted)',
  },
})
