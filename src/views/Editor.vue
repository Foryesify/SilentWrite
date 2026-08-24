<template>
  <div class="editor"></div>
</template>

<style scoped>
.editor {
  display: flex;
  padding-top: 55px;
}
</style>

<script setup>
import { onMounted } from 'vue'
import { EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { codemirror } from '@/editor/codemirror.js'
import { editor } from './Editor.js'
import { actionsButton } from '@/components/ActionsButton.js'
import { windowControls } from '@/components/WindowControls.js'

function main() {
  const immersive = (view) => {
    if (view.hasFocus) (actionsButton.hide(), windowControls.hide())
    else (actionsButton.show(), windowControls.show())
  }
  const view = new EditorView({
    parent: document.querySelector('.editor'),
    state: EditorState.create({
      doc: '',
      extensions: codemirror(immersive),
    }),
  })
  editor.init(view)
}

onMounted(main)
</script>
