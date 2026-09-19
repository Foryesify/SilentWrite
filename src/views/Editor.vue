<template>
  <div class="editor"></div>
</template>

<style scoped>
.editor {
  display: flex;
  padding: 55px 8px;
}
</style>

<script setup>
import { onMounted, ref } from 'vue'
import { EditorState } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import { editor } from '@/editor/editor.js'
import { EditorManager } from '@/user/api'

function onUpdate(u) {
  if (u.focusChanged) EditorManager.setFocus()
  if (u.docChanged) EditorManager.saveDoc()
}

onMounted(() => {
  EditorManager.init(editor('.editor', onUpdate), '')
})
</script>
