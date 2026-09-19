<template>
  <div class="editor"></div>
</template>

<style scoped>
.editor {
  display: flex;
  z-index: 900;
  padding: 55px 8px;
  background-color: transparent;
}
</style>

<script setup>
import { onMounted, ref } from 'vue'
import { EditorState } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import { editor } from '@/editor/editor.js'
import { EditorManager } from '@/user/api'

function onFocus() {
  EditorManager.focus.value
}

function onUpdate() {
  // auto save the file
}

onMounted(() => {
  const config = {
    parent: document.querySelector('.editor'),
    state: EditorState.create({
      doc: '',
      extensions: editor(onFocus, onUpdate),
    }),
  }
  EditorManager.init(new EditorView(config))
})
</script>
