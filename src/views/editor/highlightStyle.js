import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags } from '@lezer/highlight'

export const highlightStyle = () => syntaxHighlighting(HighlightStyle.define([
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
  { tag: tags.emphasis, fontStyle: 'italic' },
  { tag: tags.strong, fontWeight: '700' },
  {
    tag: tags.strikethrough,
    textDecoration: 'line-through',
  },
  { tag: tags.link, color: 'var(--cm-link)' },
  {
    tag: tags.url,
    color: 'var(--cm-link)',
    textDecoration: 'underline',
    textUnderlineOffset: '0.18em',
    textDecorationColor: 'var(--cm-link-underline)',
  },
  { tag: tags.monospace, fontFamily: 'var(--cm-mono)', fontSize: '0.92em' },
  { tag: tags.quote, color: 'var(--cm-muted)', fontStyle: 'italic' },
  { tag: tags.contentSeparator, color: 'var(--cm-muted)' },
  { tag: tags.escape, color: 'var(--cm-muted)' },
  { tag: tags.comment, color: 'var(--cm-muted)', fontStyle: 'italic' },
  { tag: tags.documentMeta, color: 'var(--cm-muted)' },

  { tag: tags.tagName, color: 'var(--cm-muted)' },
  { tag: tags.attributeName, color: 'var(--cm-muted)' },
  { tag: tags.attributeValue, color: 'var(--cm-link)' },
  { tag: tags.keyword, color: 'var(--cm-muted)' },
  { tag: tags.string, color: 'var(--cm-fg)' },
  { tag: tags.atom, color: 'var(--cm-muted)' },
  { tag: tags.bool, color: 'var(--cm-muted)' },
  { tag: tags.number, color: 'var(--cm-muted)' },
]))
