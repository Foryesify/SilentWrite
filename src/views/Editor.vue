<template>
  <div class="editor" ref="host">
    <ActionsButton :hidden />
  </div>
</template>

<style scoped>
.editor {
  display: flex;
  padding-top: 55px;
}
</style>

<script setup>
import { ref, watch } from 'vue'
import { EditorState } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import { codemirror } from '@/editor/codemirror.js'
import { editor, editorEpoch, page } from '@/user/session.js'
import { currentDoc, leaveEditor } from '@/user/document.js'
import { saveMarkdown } from '@/user/api.js'
import { windowControls } from '@/components/WindowControls.js'
import ActionsButton from './Editor/ActionsButton.vue'

const host = ref(null)
const hidden = ref(false)

function immersive(view) {
  hidden.value = view.hasFocus
  if (view.hasFocus) windowControls.hide()
  else windowControls.show()
}

function autosave(update) {
  if (update.docChanged) currentDoc()?.setContent(update.state.doc.toString())
}

function load() {
  editor.view?.destroy()
  const view = new EditorView({
    parent: host.value,
    state: EditorState.create({
      doc: currentDoc()?.text() ?? '',
      extensions: [
        ...codemirror(immersive, autosave),
        keymap.of([
          {
            key: 'Mod-s',
            run: () => {
              saveMarkdown()
              return true
            },
          },
        ]),
      ],
    }),
  })
  editor.init(view)
}

watch([page, host, editorEpoch], ([p, el]) => {
  if (!el) return
  if (p === 'Editor') load()
  else {
    currentDoc()?.setContent(editor.text())
    leaveEditor()
    editor.view?.destroy()
    editor.init(null)
    hidden.value = false
    windowControls.show()
  }
})
</script>
