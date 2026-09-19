import { EditorView, placeholder, keymap } from '@codemirror/view'
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands'
import { markdown } from '@codemirror/lang-markdown'
import { yamlFrontmatter } from '@codemirror/lang-yaml'
import { cm6ThemeSilent } from './cm6ThemeSilent'

export function editor(onFocus, onUpdate) {
  return [
    ...cm6ThemeSilent,
    yamlFrontmatter({ content: markdown() }),
    history(),
    placeholder('Type here...'),
    EditorView.lineWrapping,
    keymap.of([indentWithTab, ...defaultKeymap, ...historyKeymap]),
    EditorView.updateListener.of((update) => {
      if (update.focusChanged) onFocus?.(update.view)
      onUpdate?.(update)
    }),
  ]
}
