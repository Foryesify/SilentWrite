<template>
  <div class="editor"></div>
</template>

<style scoped>
.editor {
  display: flex;
  padding: 44px 8px;
}
</style>

<script setup>
import { onMounted } from 'vue'
import { invoke, isTauri } from '@tauri-apps/api/core'
import { listen } from '@tauri-apps/api/event'
import { editor } from '@/editor/editor.js'
import { EditorManager, Session } from './api.js'

let fileOpenQueue = Promise.resolve()

function onUpdate(u) {
  if (u.focusChanged) EditorManager.setFocus()
  if (u.docChanged) EditorManager.saveDoc()
}

function openPendingFiles() {
  fileOpenQueue = fileOpenQueue.then(async () => {
    const paths = await invoke('take_pending_files')
    for (const path of paths) {
      Session.isLoading = true
      try {
        const content = await invoke('read_markdown_file', { path })
        Session.filePath = path
        Session.fileHandle = null
        EditorManager.fillText(content)
      } catch (error) {
        console.error(`Failed to open ${path}:`, error)
      } finally {
        Session.isLoading = false
      }
    }
  }).catch((error) => console.error('Failed to process opened Markdown files:', error))
  return fileOpenQueue
}

onMounted(async () => {
  EditorManager.init(editor('.editor', onUpdate), '')

  if (isTauri()) {
    await listen('markdown-open-request', openPendingFiles)
    await openPendingFiles()
  }
})
</script>
