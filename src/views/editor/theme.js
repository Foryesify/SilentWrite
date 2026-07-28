import { EditorView } from "@codemirror/view"

const cmVars = {
  '--cm-font': `Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI',
                Roboto, 'Helvetica Neue', 'PingFang SC', 'Hiragino Sans GB',
                'Microsoft YaHei', 'Noto Sans SC', sans-serif`,
  '--cm-mono': "'Cascadia Code', 'Segoe UI Mono', Menlo, Consolas, monospace",
  '--cm-fg': '#1c1c1c',
  '--cm-heading': '#141414',
  '--cm-muted': 'rgba(28, 28, 28, 0.5)',
  '--cm-syntax': 'rgba(28, 28, 28, 0.28)',
  '--cm-link': '#2f5d8c',
  '--cm-link-underline': 'rgba(47, 93, 140, 0.35)',
  '--cm-selection': 'rgba(47, 93, 140, 0.16)',
  '--cm-caret': '#1c1c1c',
  '--cm-placeholder': 'rgba(28, 28, 28, 0.32)',
  '--cm-hash-gutter': '5.5rem',
  '--cm-cursor-move': '120ms',
  '--cm-selection-move': '100ms',
  '--cm-cursor-blink': '1.05s',
  '--cm-focus-fade': '180ms',
  '--cm-hang-duration': '280ms',
  '--cm-line-dim': '0.38',
  '--cm-ease': 'cubic-bezier(0.22, 1, 0.36, 1)',
}

const cmVarsDark = {
  '--cm-fg': '#e8e8e8',
  '--cm-heading': '#f2f2f2',
  '--cm-muted': 'rgba(232, 232, 232, 0.52)',
  '--cm-syntax': 'rgba(232, 232, 232, 0.3)',
  '--cm-link': '#8eb6d9',
  '--cm-link-underline': 'rgba(142, 182, 217, 0.4)',
  '--cm-selection': 'rgba(142, 182, 217, 0.22)',
  '--cm-caret': '#f2f2f2',
  '--cm-placeholder': 'rgba(232, 232, 232, 0.34)',
}

export const theme = () => EditorView.theme({
  '&': {
    height: '100%',
    width: '100%',
    fontSize: '1.125rem',
    backgroundColor: 'transparent',
  },
  // Vars live on .cm-scroller (not `&` inside @media — style-mod expands that
  // into bare declarations and insertRule aborts the rest of the theme).
  '.cm-scroller': {
    ...cmVars,
    color: 'var(--cm-fg)',
    fontFamily: 'var(--cm-font)',
    lineHeight: '1.75',
    fontWeight: '400',
    overflow: 'auto',
  },
  '@media (prefers-color-scheme: dark)': {
    '.cm-scroller': cmVarsDark,
  },
  '@media (prefers-reduced-motion: reduce)': {
    '.cm-scroller': {
      '--cm-hang-duration': '0ms',
    },
  },
  '&.cm-focused': {
    outline: 'none',
  },
  // Editor fills the screen; only the text column is width-constrained
  '.cm-content': {
    width: '90%',
    maxWidth: '800px',
    marginLeft: 'auto',
    marginRight: 'auto',
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
    transition: `left var(--cm-cursor-move) var(--cm-ease),
                 top var(--cm-cursor-move) var(--cm-ease),
                 height var(--cm-cursor-move) var(--cm-ease)`,
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
    transition: `left var(--cm-selection-move) var(--cm-ease), 
                 top var(--cm-selection-move) var(--cm-ease), 
                 width var(--cm-selection-move) var(--cm-ease), 
                 height var(--cm-selection-move) var(--cm-ease), 
                 background-color 160ms var(--cm-ease)`,
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
    fontSize: '1em !important',
    fontWeight: '700',
    lineHeight: 'inherit',
    color: 'var(--cm-heading)',
    transform: 'translateX(0)',
    opacity: '1',
    transition: `transform var(--cm-hang-duration) var(--cm-ease), 
                 opacity var(--cm-hang-duration) var(--cm-ease)`,
  },
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
