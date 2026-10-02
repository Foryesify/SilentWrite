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
import { onMounted } from 'vue'
import { editor } from '@/editor/editor.js'
import { EditorManager } from './api.js'

function onUpdate(u) {
  if (u.focusChanged) EditorManager.setFocus()
  if (u.docChanged) EditorManager.saveDoc()
}

onMounted(() => {
  EditorManager.init(editor('.editor', onUpdate), '')
})
</script>
