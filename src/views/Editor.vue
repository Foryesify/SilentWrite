<template>
  <div class="editor">
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
import { onMounted, ref } from 'vue'
import { EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { codemirror } from '@/editor/codemirror.js'
import { editor } from './Editor.js'
import { windowControls } from '@/components/WindowControls.js'
import { Session } from '@/user/api.js'
import ActionsButton from './Editor/ActionsButton.vue'

const hidden = ref(false)

function main() {
  const immersive = (view) => {
    hidden.value = view.hasFocus
    if (view.hasFocus) windowControls.hide()
    else windowControls.show()
  }
  const autosave = (update) => {
    if (update.docChanged) {
      Session.editor.fileid?.setContent(update.state.doc.toString())
    }
  }
  const view = new EditorView({
    parent: document.querySelector('.editor'),
    state: EditorState.create({
      doc: '',
      extensions: codemirror(immersive, autosave),
    }),
  })
  editor.init(view)
}

onMounted(main)
</script>
