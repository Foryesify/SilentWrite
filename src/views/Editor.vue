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

/**
 * 当编辑器
 */
function onUpdate(u) {
  if (u.focusChanged) EditorManager.setFocus()
  if (u.docChanged) EditorManager.saveDoc()
}

onMounted(() => {
  EditorManager.init(
    new EditorView({
      parent: document.querySelector('.editor'),
      state: EditorState.create({ extensions: editor(onUpdate) }),
    }),
    'This'
  )
})
</script>
