import { EditorView, placeholder, keymap } from '@codemirror/view'
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands'
import { markdown } from '@codemirror/lang-markdown'
import { yamlFrontmatter } from '@codemirror/lang-yaml'
import { cm6ThemeSilent } from './cm6ThemeSilent'
import { i18n } from '@/user/i18n.js'

export function codemirror(onFocus, onUpdate) {
  return [
    ...cm6ThemeSilent,
    yamlFrontmatter({ content: markdown() }),
    history(),
    placeholder(i18n.value['editor-placeholder']),
    EditorView.lineWrapping,
    keymap.of([indentWithTab, ...defaultKeymap, ...historyKeymap]),
    EditorView.updateListener.of((update) => {
      if (update.focusChanged) onFocus?.(update.view)
      onUpdate?.(update)
    }),
  ]
}
